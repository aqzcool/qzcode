
import React, { useEffect, useRef, useState } from 'react';
import { Message, Agent, Role } from '../types';
import { Icons } from './Icons';

interface TeamFeedProps {
  messages: Message[];
  agents: Agent[];
  onSendMessage: (text: string) => void;
}

export const TeamFeed: React.FC<TeamFeedProps> = ({ messages, agents, onSendMessage }) => {
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  const getAgent = (name?: string) => {
    if (!name) return null;
    if (name === 'Architect') return { color: 'text-purple-400', bg: 'bg-purple-500/10' };
    return agents.find(a => a.name === name) || { color: 'text-cyan-400', bg: 'bg-cyan-500/10' };
  };

  return (
    <div className="flex flex-col h-full bg-[#111]">
      {/* Header */}
      <div className="h-9 flex items-center justify-between px-3 border-b border-gray-800 bg-[#161616]">
        <div className="flex items-center gap-2">
           <Icons.Hash size={12} className="text-gray-500" />
           <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">TEAM_SYNAPSE</span>
        </div>
        <div className="flex items-center gap-1">
           <div className="flex -space-x-1.5">
              <div className="w-4 h-4 rounded-full bg-purple-500 border border-[#161616] flex items-center justify-center text-[8px] font-bold">A</div>
              {agents.slice(0, 3).map(a => (
                  <div key={a.id} className="w-4 h-4 rounded-full border border-[#161616] flex items-center justify-center text-[6px] font-bold text-black" style={{ backgroundColor: a.color }}>
                    {a.name.substring(0,1)}
                  </div>
              ))}
           </div>
           <span className="text-[9px] text-gray-500 ml-1">{agents.length + 1} Online</span>
        </div>
      </div>

      {/* Feed Stream */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-30 text-center px-4">
            <Icons.Users size={32} className="mb-2" />
            <p className="text-xs">Agents are offline. Initialize Architect to spawn team.</p>
          </div>
        )}
        
        {messages.map((msg) => {
           const isUser = msg.role === Role.USER;
           const isSystem = msg.senderType === 'system';
           const agentStyle = !isUser ? getAgent(msg.senderName) : null;

           if (isSystem) {
             return (
               <div key={msg.id} className="flex justify-center my-2">
                 <span className="text-[9px] text-gray-600 font-mono py-1 px-3 bg-gray-900 rounded-full border border-gray-800">
                    {msg.content}
                 </span>
               </div>
             )
           }

           return (
            <div key={msg.id} className={`flex gap-3 group animate-fade-in ${isUser ? 'flex-row-reverse' : ''}`}>
               {/* Avatar */}
               <div className={`
                 w-7 h-7 flex-shrink-0 rounded-md flex items-center justify-center text-[10px] font-bold shadow-lg
                 ${isUser 
                    ? 'bg-white text-black' 
                    : (msg.role === Role.ARCHITECT ? 'bg-purple-600 text-white' : '')} 
               `}
               style={!isUser && msg.role !== Role.ARCHITECT ? { backgroundColor: (agentStyle as any)?.color?.replace('text-', 'bg-') || '#06b6d4', color: '#000' } : {}}
               >
                 {isUser ? 'U' : (msg.role === Role.ARCHITECT ? 'A' : msg.senderName?.substring(0,1))}
               </div>

               <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-baseline gap-2 mb-0.5">
                     <span className={`text-[10px] font-bold ${isUser ? 'text-gray-300' : (msg.role === Role.ARCHITECT ? 'text-purple-400' : 'text-cyan-400')}`}>
                        {msg.senderName || 'User'}
                     </span>
                     <span className="text-[9px] text-gray-600">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div className={`
                    text-xs leading-relaxed p-2 rounded-lg border
                    ${isUser 
                        ? 'bg-gray-800 border-gray-700 text-gray-100 rounded-tr-none' 
                        : (msg.role === Role.ARCHITECT 
                            ? 'bg-purple-900/10 border-purple-500/20 text-purple-200 rounded-tl-none' 
                            : 'bg-[#1a1a1a] border-gray-800 text-gray-300 rounded-tl-none')}
                  `}>
                    {msg.content}
                  </div>
               </div>
            </div>
           );
        })}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-[#111] border-t border-gray-800">
        <form onSubmit={handleSubmit} className="relative group">
           <div className="absolute left-2 top-2.5 text-gray-600">
              <Icons.AtSign size={12} />
           </div>
           <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-md py-2 pl-7 pr-8 text-xs text-white focus:border-purple-500 focus:outline-none transition-all"
              placeholder="Message the team..."
           />
           <button 
             type="submit"
             disabled={!input.trim()}
             className="absolute right-2 top-2 text-gray-500 hover:text-white disabled:opacity-30"
           >
              <Icons.Send size={12} />
           </button>
        </form>
      </div>
    </div>
  );
};
