
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './Icons';
import { generateArchitectPlan, chatWithCoder } from '../services/geminiService';
import { GenerationState, Task, Role, Message, Agent, Channel } from '../types';
import { PreviewFrame } from './PreviewFrame';
import { ContactList } from './ContactList';
import { ChatInterface } from './ChatInterface';

interface WorkspaceProps {
  onBack: () => void;
}

// Utility to generate persona based on filename
const assignAgent = (fileName: string): Agent => {
    const ext = fileName.split('.').pop() || '';
    if (['css', 'scss', 'less'].includes(ext)) {
        return { id: 'agent-viz', name: 'Visualist', role: 'visualist', color: '#f472b6', status: 'idle' };
    }
    if (['ts', 'js', 'json'].includes(ext)) {
        return { id: 'agent-logic', name: 'Logician', role: 'logician', color: '#4ade80', status: 'idle' };
    }
    return { id: 'agent-build', name: 'Builder', role: 'builder', color: '#22d3ee', status: 'idle' };
};

const getRandomResponse = (agentName: string, action: 'start' | 'finish', taskName: string) => {
    const starts = [
        `Picking up ${taskName}.`,
        `Analyzing ${taskName} requirements.`,
        `On it. ${taskName} is mine.`,
        `Initiating sequence for ${taskName}.`
    ];
    const finishes = [
        `Done with ${taskName}. @Architect, please verify.`,
        `Optimized and committed ${taskName}.`,
        `${taskName} implementation complete.`,
        `Requesting merge for ${taskName}.`
    ];
    const arr = action === 'start' ? starts : finishes;
    return arr[Math.floor(Math.random() * arr.length)];
};

const INITIAL_CHANNELS: Channel[] = [
    { id: 'architect', type: 'special', name: 'Architect', description: 'Project Lead', status: 'online' },
    { id: 'team-synapse', type: 'group', name: 'Team Synapse', description: 'Global Team Feed', status: 'online' },
];

export const Workspace: React.FC<WorkspaceProps> = ({ onBack }) => {
  const [editorMode, setEditorMode] = useState<'code' | 'preview'>('code');
  const [bottomPanelTab, setBottomPanelTab] = useState<'terminal' | 'problems'>('terminal');
  
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    currentStep: 'idle',
    architectThinking: '',
    messages: [], 
    channels: INITIAL_CHANNELS,
    activeChannelId: 'architect',
    activeAgents: [],
    tasks: [],
    activeTaskId: null,
  });

  // Helper to add message
  const addMessage = (msg: Message) => {
    setState(prev => ({
        ...prev,
        messages: [...prev.messages, msg]
    }));
  };

  const handleSendMessage = async (text: string) => {
    const currentChannel = state.channels.find(c => c.id === state.activeChannelId);
    if (!currentChannel) return;

    const userMsg: Message = {
        id: `msg-user-${Date.now()}`,
        role: Role.USER,
        content: text,
        timestamp: Date.now(),
        channelId: currentChannel.id
    };

    addMessage(userMsg);

    // LOGIC ROUTER: Who are we talking to?
    
    // CASE A: Talking to ARCHITECT
    if (currentChannel.id === 'architect') {
        await runArchitectFlow(text, userMsg);
    } 
    // CASE B: Talking to TEAM SYNAPSE (Broadcast)
    else if (currentChannel.id === 'team-synapse') {
        // Just a broadcast for now, maybe Architect responds
        setTimeout(() => {
            const reply: Message = {
                id: `msg-sys-${Date.now()}`,
                role: Role.ARCHITECT,
                senderName: 'Architect',
                content: "Noted. Broadcasting to relevant agents.",
                timestamp: Date.now(),
                channelId: 'team-synapse'
            };
            addMessage(reply);
        }, 800);
    }
    // CASE C: Talking to a SPECIFIC FILE AGENT
    else if (currentChannel.type === 'file') {
        const task = state.tasks.find(t => t.id === currentChannel.id);
        if (task) {
            await runCoderFlow(task, text, userMsg);
        }
    }
  };

  const runArchitectFlow = async (prompt: string, userMsg: Message) => {
    setState(prev => ({
      ...prev,
      isGenerating: true,
      currentStep: 'architecting',
      architectThinking: 'Designing agent protocol...',
      error: undefined
    }));

    try {
      // Get history for architect channel
      const history = state.messages.filter(m => m.channelId === 'architect');
      const architectOutput = await generateArchitectPlan(prompt, history);
      
      const architectMsg: Message = {
          id: `msg-arch-${Date.now()}`,
          role: Role.ARCHITECT,
          senderName: 'Architect',
          content: architectOutput.chat_response,
          timestamp: Date.now(),
          channelId: 'architect'
      };
      addMessage(architectMsg);

      // If there are tasks, broadcast to Team Synapse and create Channels
      if (architectOutput.tasks.length > 0) {
          const teamBroadcast: Message = {
              id: `msg-broadcast-${Date.now()}`,
              role: Role.ARCHITECT,
              senderName: 'Architect',
              content: `@everyone New directive: ${architectOutput.plan_overview}. Spawning agents.`,
              timestamp: Date.now(),
              channelId: 'team-synapse'
          };
          addMessage(teamBroadcast);

          // Create new tasks and channels
          const existingTasksMap = new Map(state.tasks.map(t => [t.file_name, t]));
          const activeAgentsMap = new Map<string, Agent>();
          const newChannels: Channel[] = [];

          const newTasks: Task[] = architectOutput.tasks.map((t, idx) => {
            const agent = assignAgent(t.file_name);
            activeAgentsMap.set(agent.role, agent);

            const existing = existingTasksMap.get(t.file_name);
            let taskId = existing?.id || `task-${Date.now()}-${idx}`;

            // Create a channel for this file if it doesn't exist
            if (!state.channels.find(c => c.id === taskId)) {
                newChannels.push({
                    id: taskId,
                    type: 'file',
                    name: t.file_name.split('/').pop() || t.file_name,
                    description: t.description,
                    agentId: agent.id,
                    status: 'idle'
                });
            }

            if (existing) {
                return { ...existing, title: t.title, description: t.description, assignedAgentId: agent.id, status: 'pending' };
            } else {
                return {
                    id: taskId,
                    title: t.title,
                    description: t.description,
                    file_name: t.file_name,
                    assignedAgentId: agent.id,
                    status: 'pending',
                    code: ''
                };
            }
          });

          setState(prev => ({
            ...prev,
            currentStep: 'coding',
            architectThinking: architectOutput.plan_overview,
            activeAgents: Array.from(activeAgentsMap.values()),
            tasks: newTasks,
            channels: [...prev.channels, ...newChannels],
            activeTaskId: prev.activeTaskId && newTasks.find(t => t.id === prev.activeTaskId) ? prev.activeTaskId : newTasks[0]?.id || null
          }));

          // Trigger Coding (simplified parallel execution)
          // We will simulate the agents talking in their own channels and the team channel
          executeTasks(newTasks);
      } else {
          setState(prev => ({ ...prev, isGenerating: false, currentStep: 'idle' }));
      }

    } catch (e) {
      console.error(e);
      setState(prev => ({ ...prev, isGenerating: false, error: "Architect connection failure." }));
    }
  };

  const executeTasks = async (tasks: Task[]) => {
      const pendingTasks = tasks.filter(t => t.status === 'pending');
      
      const promises = pendingTasks.map(async (task) => {
          const agent = assignAgent(task.file_name || '');
          
          // 1. Announce in Team Channel
          addMessage({
              id: `msg-start-${task.id}`,
              role: Role.CODER,
              senderName: agent.name,
              content: getRandomResponse(agent.name, 'start', task.file_name || 'file'),
              timestamp: Date.now(),
              channelId: 'team-synapse'
          });

          // 2. Announce in File Channel (Private Log)
          addMessage({
            id: `msg-start-p-${task.id}`,
            role: Role.CODER,
            senderName: agent.name,
            content: `Initialize task: ${task.description}. Starting code generation sequence...`,
            timestamp: Date.now(),
            channelId: task.id,
            senderType: 'system'
          });

          updateTaskStatus(task.id, 'running');
          updateChannelStatus(task.id, 'working');

          // Artificial Delay for effect
          await new Promise(r => setTimeout(r, 1500 + Math.random() * 2000));

          try {
              // 3. Actually generate code
              // We pass the file's specific history
              const history = state.messages.filter(m => m.channelId === task.id);
              
              const response = await chatWithCoder(task.title, task.file_name || '', task.code, history);

              // 4. Update Task with Code
              updateTaskComplete(task.id, response.code);

              // 5. Post explanation to File Channel
              addMessage({
                  id: `msg-code-${task.id}`,
                  role: Role.CODER,
                  senderName: agent.name,
                  content: response.explanation || "Code updated successfully.",
                  timestamp: Date.now(),
                  channelId: task.id
              });

              // 6. Announce Complete in Team Channel
              addMessage({
                  id: `msg-fin-${task.id}`,
                  role: Role.CODER,
                  senderName: agent.name,
                  content: getRandomResponse(agent.name, 'finish', task.file_name || 'file'),
                  timestamp: Date.now(),
                  channelId: 'team-synapse'
              });

          } catch (err) {
              updateTaskStatus(task.id, 'error');
              addMessage({
                  id: `msg-err-${task.id}`,
                  role: Role.CODER,
                  senderName: agent.name,
                  content: "Compilation failed. Check local logs.",
                  timestamp: Date.now(),
                  channelId: 'team-synapse'
              });
          } finally {
              updateChannelStatus(task.id, 'online');
          }
      });

      await Promise.all(promises);
      setState(prev => ({ ...prev, isGenerating: false, currentStep: 'complete' }));
  };

  const runCoderFlow = async (task: Task, prompt: string, userMsg: Message) => {
      // Direct chat with an agent about a specific file
      const agent = assignAgent(task.file_name || '');
      
      setState(prev => ({ ...prev, isGenerating: true, architectThinking: `Agent ${agent.name} is thinking...` }));
      updateChannelStatus(task.id, 'working');

      try {
        const history = state.messages.filter(m => m.channelId === task.id);
        const response = await chatWithCoder(task.title, task.file_name || '', task.code, history);

        updateTaskComplete(task.id, response.code);
        
        addMessage({
            id: `msg-resp-${Date.now()}`,
            role: Role.CODER,
            senderName: agent.name,
            content: response.explanation,
            timestamp: Date.now(),
            channelId: task.id
        });
      } catch (err) {
         console.error(err);
      } finally {
          setState(prev => ({ ...prev, isGenerating: false }));
          updateChannelStatus(task.id, 'online');
      }
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, status } : t)
    }));
  };

  const updateChannelStatus = (channelId: string, status: Channel['status']) => {
    setState(prev => ({
        ...prev,
        channels: prev.channels.map(c => c.id === channelId ? { ...c, status } : c)
    }));
  };

  const updateTaskComplete = (taskId: string, code: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, status: 'completed', code } : t)
    }));
  };

  const activeTask = state.tasks.find(t => t.id === state.activeTaskId);
  const activeChannel = state.channels.find(c => c.id === state.activeChannelId) || state.channels[0];
  const problemCount = state.tasks.filter(t => t.status === 'error').length;

  return (
    <div className="flex flex-col h-screen bg-[#0d0d0d] text-white overflow-hidden font-sans">
      {/* 1. TOP HEADER */}
      <header className="h-12 border-b border-gray-800 flex items-center justify-between px-4 bg-[#0d0d0d] z-30 select-none">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white">
            <Icons.ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
             <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <span className="font-bold text-[10px] text-black">Q</span>
             </div>
             <span className="font-bold tracking-wider text-sm text-gray-200">
              QZ.COOL <span className="text-gray-600 font-normal mx-2">|</span> NEURAL LINK STUDIO
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1 bg-[#151515] border border-gray-800 rounded-full">
              <Icons.Zap size={12} className={state.isGenerating ? "text-yellow-400" : "text-gray-600"} />
              <span className="text-[10px] font-mono uppercase text-gray-400">
                  {state.currentStep === 'idle' ? 'STANDBY' : state.currentStep}
              </span>
           </div>
        </div>
      </header>

      {/* 2. MAIN WORKBENCH (3 Columns) */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* COL 1: NEURAL DIRECTORY (Left Sidebar) */}
        <div className="w-64 bg-[#0a0a0a] border-r border-gray-800 flex flex-col flex-shrink-0">
           <ContactList 
              channels={state.channels}
              tasks={state.tasks}
              activeChannelId={state.activeChannelId}
              onSelectChannel={(cid, taskId) => {
                  setState(prev => ({
                      ...prev,
                      activeChannelId: cid,
                      activeTaskId: taskId || prev.activeTaskId 
                  }))
              }}
           />

           {/* Settings Entry */}
           <div className="p-2 border-t border-gray-800 bg-[#0a0a0a]">
              <button 
                onClick={() => alert("Settings module is under construction by the Architect.")}
                className="flex items-center gap-2 w-full p-2 rounded-md text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                  <Icons.Settings size={14} />
                  <span>Settings</span>
              </button>
           </div>
        </div>

        {/* COL 2: UNIFIED CHAT (Middle Panel) */}
        <div className="w-[450px] bg-[#0f0f0f] border-r border-gray-800 flex flex-col flex-shrink-0 relative">
           <ChatInterface 
              activeChannel={activeChannel}
              messages={state.messages}
              onSendMessage={handleSendMessage}
              isGenerating={state.isGenerating}
              thinking={state.architectThinking}
           />
        </div>

        {/* COL 3: WORKBENCH (Right Panel) */}
        <div className="flex-1 flex flex-col bg-[#111] min-w-0">
           
           {/* Tab Bar */}
           <div className="h-9 bg-[#111] border-b border-gray-800 flex items-center overflow-x-auto no-scrollbar">
              {state.tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setState(prev => ({ ...prev, activeTaskId: task.id, activeChannelId: task.id }))} // Clicking tab also switches chat to that file
                  className={`
                    group flex items-center gap-2 px-3 h-full text-xs font-medium border-r border-gray-800/50 min-w-[120px] max-w-[200px]
                    ${state.activeTaskId === task.id 
                      ? 'bg-[#1e1e1e] text-cyan-100 border-t-2 border-t-cyan-500' 
                      : 'bg-transparent text-gray-500 hover:bg-[#151515] hover:text-gray-300'}
                  `}
                >
                  <span className="flex-shrink-0">
                     {task.file_name?.endsWith('css') ? <Icons.Layout size={12} className="text-blue-400"/> : <Icons.FileCode size={12} className={state.activeTaskId === task.id ? "text-cyan-400" : ""}/>}
                  </span>
                  <span className="truncate">{task.file_name?.split('/').pop() || task.title}</span>
                  {task.status === 'running' && <Icons.Loader2 size={10} className="animate-spin text-cyan-500 ml-auto" />}
                </button>
              ))}
              {state.tasks.length === 0 && (
                 <div className="px-4 text-[10px] text-gray-700 font-mono">WAITING FOR ARCHITECT...</div>
              )}
           </div>

           {/* Workbench Content */}
           <div className="flex-1 flex flex-col overflow-hidden relative">
              
               {/* Top: Code Editor / Preview */}
               <div className="flex-1 overflow-hidden relative bg-[#111]">
                  {state.tasks.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center opacity-30">
                         <Icons.Code2 size={48} />
                         <p className="mt-4 text-xs">Waiting for code generation...</p>
                      </div>
                  ) : (
                      editorMode === 'code' ? (
                         <div className="h-full overflow-auto p-4 custom-scrollbar font-mono text-sm leading-6 text-gray-300">
                            {activeTask?.code ? (
                              <pre>{activeTask.code}</pre>
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-600 text-xs">
                                 {activeTask ? (
                                    <div className="flex flex-col items-center gap-2">
                                       <Icons.Loader2 size={24} className="animate-spin text-cyan-500" />
                                       <span>Agent is typing...</span>
                                    </div>
                                 ) : (
                                    <span>Select a file to view code.</span>
                                 )}
                              </div>
                            )}
                         </div>
                      ) : (
                         <PreviewFrame tasks={state.tasks} activeTaskId={state.activeTaskId} />
                      )
                  )}
                  
                  {/* View Toggle Overlay */}
                  {state.tasks.length > 0 && (
                      <div className="absolute top-4 right-4 flex bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-xl p-1 z-20">
                         <button onClick={() => setEditorMode('code')} className={`p-1.5 rounded ${editorMode==='code'?'bg-gray-700 text-white':'text-gray-500'}`}><Icons.Code2 size={14}/></button>
                         <button onClick={() => setEditorMode('preview')} className={`p-1.5 rounded ${editorMode==='preview'?'bg-gray-700 text-white':'text-gray-500'}`}><Icons.Eye size={14}/></button>
                      </div>
                  )}
               </div>

               {/* Bottom: Terminal / Problems */}
               <div className="h-40 border-t border-gray-800 bg-[#0d0d0d] flex flex-col flex-shrink-0">
                   {/* Panel Header */}
                   <div className="flex items-center px-4 h-8 border-b border-gray-800/50 gap-6 bg-[#0f0f0f]">
                       <button 
                         onClick={() => setBottomPanelTab('terminal')}
                         className={`text-[10px] font-bold tracking-widest h-full border-b-2 transition-colors ${bottomPanelTab === 'terminal' ? 'border-purple-500 text-gray-200' : 'border-transparent text-gray-600 hover:text-gray-400'}`}
                       >
                         TERMINAL
                       </button>
                        <button 
                         onClick={() => setBottomPanelTab('problems')}
                         className={`flex items-center gap-1 text-[10px] font-bold tracking-widest h-full border-b-2 transition-colors ${bottomPanelTab === 'problems' ? 'border-purple-500 text-gray-200' : 'border-transparent text-gray-600 hover:text-gray-400'}`}
                       >
                         PROBLEMS
                         {problemCount > 0 && <span className="bg-red-500/20 text-red-400 px-1.5 rounded-full text-[9px]">{problemCount}</span>}
                       </button>
                   </div>
                   
                   {/* Panel Content */}
                   <div className="flex-1 overflow-auto p-3 font-mono text-xs custom-scrollbar">
                       {bottomPanelTab === 'terminal' && (
                           <div className="text-gray-400 space-y-1">
                               <div className="flex gap-2">
                                  <span className="text-green-500">➜</span>
                                  <span className="text-cyan-500">~/neural-link</span>
                                  <span className="text-gray-500">connected</span>
                               </div>
                               <div className="opacity-50">Node: {state.activeChannelId}</div>
                           </div>
                       )}
                       {bottomPanelTab === 'problems' && (
                           <div className="space-y-1">
                                {state.tasks.filter(t => t.status === 'error').map(t => (
                                    <div key={t.id} className="flex items-start gap-2 text-red-400 hover:bg-white/5 p-1 rounded cursor-pointer group">
                                        <Icons.XCircle size={14} className="mt-0.5 flex-shrink-0" />
                                        <div className="flex flex-col">
                                          <span className="text-gray-300 font-semibold">{t.file_name}</span>
                                          <span className="opacity-80">Generation failed for this file.</span>
                                        </div>
                                    </div>
                                ))}
                                {problemCount === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-600 italic opacity-50">
                                        <Icons.Check size={24} className="mb-2" />
                                        <span>No problems detected. System healthy.</span>
                                    </div>
                                )}
                           </div>
                       )}
                   </div>
               </div>
           </div>
        </div>

      </main>

      {/* 3. STATUS BAR (Bottom) */}
      <footer className="h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-[10px] font-sans z-40 select-none">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
               <Icons.GitBranch size={10} />
               <span>MAIN</span>
            </div>
            <div className="flex items-center gap-1 opacity-80">
               <Icons.Code2 size={10} />
               <span>{state.tasks.length} AGENTS ONLINE</span>
            </div>
         </div>
         <div className="flex items-center gap-4 opacity-90">
            <span>TypeScript React</span>
            <div className="flex items-center gap-1 ml-2">
               <Icons.Check size={10} />
               <span>Prettier</span>
            </div>
         </div>
      </footer>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
