
import React, { useState } from 'react';
import { Icons } from './Icons';
import { Task, Channel, Agent } from '../types';

interface ContactListProps {
  channels: Channel[];
  tasks: Task[];
  activeChannelId: string;
  onSelectChannel: (channelId: string, taskId?: string) => void;
}

export const ContactList: React.FC<ContactListProps> = ({ 
  channels, 
  tasks, 
  activeChannelId, 
  onSelectChannel 
}) => {
  
  const specialChannels = channels.filter(c => c.type === 'special' || c.type === 'group');
  const fileChannels = channels.filter(c => c.type === 'file');

  // Helper to find the task associated with a file channel
  const getTaskForChannel = (channelId: string) => tasks.find(t => t.id === channelId);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
       {/* 1. SPECIAL OPERATIVES */}
       <div className="px-4 py-3 text-[10px] font-bold text-gray-500 tracking-widest uppercase border-b border-gray-800/50 bg-[#0f0f0f] flex justify-between items-center">
          <span>OPERATIVES</span>
          <Icons.Users size={12} />
       </div>
       <div className="flex flex-col gap-1 p-2">
          {specialChannels.map(channel => (
             <ContactItem 
                key={channel.id}
                channel={channel}
                isActive={activeChannelId === channel.id}
                onClick={() => onSelectChannel(channel.id)}
             />
          ))}
          {/* Mock Plugins */}
          <div className="mt-2 pt-2 border-t border-gray-800/50">
             <div className="px-2 pb-1 text-[9px] text-gray-600 font-mono">INSTALLED PLUGINS</div>
             <button className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-white/5 transition-colors opacity-50 cursor-not-allowed group">
                <Icons.GitBranch size={14} className="text-orange-500" />
                <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-400 group-hover:text-gray-200">Git Keeper</span>
                </div>
                <Icons.Plug size={10} className="ml-auto text-gray-600" />
             </button>
              <button className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-white/5 transition-colors opacity-50 cursor-not-allowed group">
                <Icons.ShieldCheck size={14} className="text-green-500" />
                <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-400 group-hover:text-gray-200">Quality Core</span>
                </div>
                <Icons.Plug size={10} className="ml-auto text-gray-600" />
             </button>
          </div>
       </div>

       {/* 2. FILE SYSTEM INTELLIGENCE (Tree-like list) */}
       <div className="mt-2 flex-1 flex flex-col min-h-0 border-t border-gray-800">
           <div className="px-4 py-3 text-[10px] font-bold text-gray-500 tracking-widest uppercase border-b border-gray-800/50 bg-[#0f0f0f] flex justify-between items-center">
              <span>FILE INTELLIGENCE</span>
              <Icons.Cpu size={12} />
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              {fileChannels.length === 0 ? (
                 <div className="text-center mt-8 text-gray-700 text-xs px-4">
                    <Icons.Bot size={24} className="mx-auto mb-2 opacity-20" />
                    <p>No intelligent files spawned yet.</p>
                 </div>
              ) : (
                <FileAgentTree 
                    tasks={tasks}
                    channels={fileChannels}
                    activeChannelId={activeChannelId}
                    onSelectChannel={onSelectChannel}
                />
              )}
           </div>
       </div>
    </div>
  );
};

const ContactItem: React.FC<{ channel: Channel, isActive: boolean, onClick: () => void }> = ({ channel, isActive, onClick }) => {
    let icon = <Icons.Hash size={14} className="text-gray-500" />;
    let color = "text-gray-400";
    
    if (channel.id === 'architect') {
        icon = <Icons.Brain size={14} className="text-purple-400" />;
        color = "text-purple-300";
    } else if (channel.id === 'team-synapse') {
        icon = <Icons.Users size={14} className="text-cyan-400" />;
        color = "text-cyan-300";
    }

    return (
        <button 
            onClick={onClick}
            className={`
                flex items-center gap-3 w-full p-2 rounded-md transition-all
                ${isActive ? 'bg-[#1e1e1e] border-l-2 border-purple-500 shadow-md' : 'border-l-2 border-transparent hover:bg-white/5'}
            `}
        >
            <div className="flex-shrink-0">{icon}</div>
            <div className="flex flex-col items-start min-w-0">
                <span className={`text-xs font-semibold truncate ${isActive ? color : 'text-gray-400'}`}>
                    {channel.name}
                </span>
                {channel.description && (
                    <span className="text-[9px] text-gray-600 truncate max-w-[140px]">{channel.description}</span>
                )}
            </div>
            {channel.status === 'working' && <Icons.Loader2 size={10} className="ml-auto animate-spin text-yellow-500" />}
        </button>
    )
}

// A flattened/hybrid tree view that treats files as chat contacts
const FileAgentTree: React.FC<{ 
    tasks: Task[], 
    channels: Channel[], 
    activeChannelId: string,
    onSelectChannel: (id: string, taskId?: string) => void 
}> = ({ tasks, channels, activeChannelId, onSelectChannel }) => {
    // Reusing the tree building logic conceptually, but simplified for the "List of Agents" feel
    // For this specific request, let's keep it as a list but indented to show hierarchy,
    // reinforcing that "src/components/Header.tsx" is an entity.

    const getIconForFile = (name: string) => {
        if (name.endsWith('tsx')) return <Icons.FileCode size={14} className="text-cyan-600" />;
        if (name.endsWith('css')) return <Icons.Layout size={14} className="text-blue-600" />;
        return <Icons.FileCode size={14} className="text-gray-600" />;
    };

    return (
        <div className="flex flex-col gap-1">
            {tasks.map(task => {
                const isActive = activeChannelId === task.id;
                const channel = channels.find(c => c.id === task.id);
                const isWorking = channel?.status === 'working';
                
                // Simple indentation based on depth
                const depth = (task.file_name?.split('/').length || 1) - 1;

                return (
                    <button
                        key={task.id}
                        onClick={() => onSelectChannel(task.id, task.id)}
                        className={`
                            flex items-center gap-2 py-1.5 px-2 rounded-md text-left transition-colors relative group
                            ${isActive ? 'bg-purple-500/10 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}
                        `}
                        style={{ marginLeft: `${depth * 8}px` }}
                    >
                        {/* Connection Line visual for depth */}
                        {depth > 0 && (
                            <div className="absolute left-[-8px] top-0 bottom-0 w-px bg-gray-800" />
                        )}
                        
                        <div className="relative">
                           {getIconForFile(task.file_name || '')}
                           {/* Online Status Dot */}
                           <div className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-[#0a0a0a] ${isWorking ? 'bg-yellow-400' : 'bg-green-500'}`}></div>
                        </div>

                        <div className="flex flex-col min-w-0">
                            <span className={`text-xs truncate font-mono ${isActive ? 'text-cyan-200' : ''}`}>
                                {task.file_name?.split('/').pop()}
                            </span>
                        </div>

                        {isWorking && <Icons.Loader2 size={10} className="ml-auto animate-spin text-cyan-500" />}
                    </button>
                )
            })}
        </div>
    )
}
