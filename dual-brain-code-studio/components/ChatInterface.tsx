
import React, { useEffect, useRef, useState } from 'react';
import { Message, Channel, Role } from '../types';
import { Icons } from './Icons';

interface ChatInterfaceProps {
  activeChannel: Channel;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isGenerating: boolean;
  thinking?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  activeChannel, 
  messages, 
  onSendMessage,
  isGenerating,
  thinking
}) => {
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannel.id]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isGenerating) return;
    onSendMessage(input);
    setInput('');
  };

  const getHeaderIcon = () => {
      switch(activeChannel.type) {
          case 'special': return activeChannel.id === 'architect' ? <Icons.Brain className="text-purple-500" /> : <Icons.GitBranch className="text-orange-500" />;
          case 'group': return <Icons.Hash className="text-cyan-500" />;
          case 'file': return <Icons.FileCode className="text-blue-400" />;
          default: return <Icons.MessageSquare />;
      }
  };

  // Filter messages for this channel
  const channelMessages = messages.filter(m => m.channelId === activeChannel.id);

  return (
    <div className="flex flex-col h-full bg-[#111]">
        {/* Chat Header */}
        <div className="h-10 flex items-center justify-between px-4 border-b border-gray-800 bg-[#141414] shadow-sm z-10">
            <div className="flex items-center gap-3">
                {getHeaderIcon()}
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-200 uppercase tracking-wide">
                        {activeChannel.name}
                    </span>
                    <span className="text-[9px] text-gray-500 font-mono">
                        {activeChannel.type === 'file' ? 'AI AGENT • ONLINE' : (activeChannel.description || 'CHANNEL')}
                    </span>
                </div>
            </div>
            {activeChannel.type === 'file' && (
                <div className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[9px] rounded border border-green-500/20">
                    LISTENING
                </div>
            )}
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5">
            {channelMessages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50 space-y-2">
                    <div className="p-3 bg-gray-800/50 rounded-full">
                        {getHeaderIcon()}
                    </div>
                    <p className="text-xs">
                        Start a secure line with {activeChannel.name}...
                    </p>
                </div>
            )}

            {channelMessages.map((msg) => {
                const isUser = msg.role === Role.USER;
                const isSystem = msg.senderType === 'system';
                
                if (isSystem) {
                    return (
                        <div key={msg.id} className="flex justify-center w-full my-2 opacity-70">
                            <span className="text-[10px] text-cyan-500 bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-900/50 font-mono">
                                {msg.content}
                            </span>
                        </div>
                    );
                }

                return (
                    <div key={msg.id} className={`flex gap-3 animate-fade-in max-w-full ${isUser ? 'flex-row-reverse' : ''}`}>
                         {/* Avatar */}
                        <div className={`
                             w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 shadow-lg border border-white/5
                             ${isUser ? 'bg-gray-200 text-black' : (msg.role === Role.ARCHITECT ? 'bg-purple-600 text-white' : 'bg-cyan-700 text-white')}
                        `}>
                            {isUser ? 'U' : (msg.senderName?.[0] || 'A')}
                        </div>
                        
                        <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                            <div className="flex items-center gap-2 mb-1 px-1">
                                <span className="text-[10px] font-bold text-gray-400">{msg.senderName || 'Unknown'}</span>
                                <span className="text-[9px] text-gray-600">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <div className={`
                                px-3 py-2 text-xs leading-relaxed rounded-xl shadow-sm whitespace-pre-wrap
                                ${isUser 
                                    ? 'bg-[#2a2a2a] text-gray-100 rounded-tr-none border border-gray-700' 
                                    : (msg.role === Role.ARCHITECT 
                                        ? 'bg-purple-500/10 text-purple-100 border border-purple-500/20 rounded-tl-none'
                                        : 'bg-cyan-900/20 text-cyan-100 border border-cyan-500/20 rounded-tl-none')}
                            `}>
                                {msg.content}
                            </div>
                        </div>
                    </div>
                )
            })}

            {isGenerating && (
                <div className="flex items-center gap-3 px-2">
                     <div className="w-8 h-8 flex items-center justify-center">
                        <Icons.Loader2 size={16} className="text-purple-500 animate-spin" />
                     </div>
                     <span className="text-xs text-purple-400 animate-pulse font-mono">
                         {thinking || 'Processing...'}
                     </span>
                </div>
            )}
            <div ref={endRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-gray-800 bg-[#111]">
            <div className="relative group">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                        }
                    }}
                    placeholder={`Message ${activeChannel.name}...`}
                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded-xl pl-4 pr-10 py-3 text-xs text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none h-[44px] max-h-32"
                />
                <button 
                    onClick={() => handleSubmit()}
                    disabled={!input.trim() || isGenerating}
                    className="absolute right-2 top-2 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30"
                >
                    <Icons.Send size={14} />
                </button>
            </div>
            <div className="mt-1 flex justify-between px-1">
                 <span className="text-[9px] text-gray-600 font-mono">CTRL+ENTER to send</span>
                 <span className="text-[9px] text-gray-600 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    SECURE CONNECTION
                 </span>
            </div>
        </div>
    </div>
  );
};
