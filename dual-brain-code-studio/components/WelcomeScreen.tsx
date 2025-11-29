import React from 'react';
import { Icons } from './Icons';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="h-screen w-full bg-[#0d0d0d] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-[#0d0d0d] to-[#0d0d0d] z-0"></div>
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

      <div className="z-10 flex flex-col items-center max-w-5xl text-center space-y-10 p-6 animate-fade-in">
        
        {/* The Dual Brain Visual */}
        <div className="flex items-center gap-6 md:gap-12 relative mb-4">
          
          {/* Left: Architect */}
          <div className="relative group animate-float" style={{ animationDelay: '0s' }}>
            <div className="absolute inset-0 bg-purple-600/20 blur-2xl rounded-full group-hover:bg-purple-600/30 transition-all duration-700"></div>
            <div className="w-28 h-28 md:w-36 md:h-36 bg-[#151515] border border-purple-500/30 rounded-3xl flex flex-col items-center justify-center relative z-10 shadow-2xl backdrop-blur-sm group-hover:border-purple-500/60 transition-colors">
              <Icons.Brain size={42} className="text-purple-400 mb-2" />
              <span className="text-[10px] font-bold text-purple-300 tracking-widest uppercase">Architect</span>
            </div>
          </div>

          {/* Center: Connection */}
          <div className="flex flex-col items-center gap-2 opacity-60">
            <div className="w-10 md:w-20 h-0.5 bg-gradient-to-r from-purple-500/50 to-cyan-500/50"></div>
            <div className="w-6 h-6 rounded-full bg-[#1e1e1e] border border-gray-700 flex items-center justify-center z-20">
               <Icons.Zap size={12} className="text-yellow-400" />
            </div>
            <div className="w-10 md:w-20 h-0.5 bg-gradient-to-r from-purple-500/50 to-cyan-500/50"></div>
          </div>

          {/* Right: Coder */}
          <div className="relative group animate-float" style={{ animationDelay: '2s' }}>
            <div className="absolute inset-0 bg-cyan-600/20 blur-2xl rounded-full group-hover:bg-cyan-600/30 transition-all duration-700"></div>
             <div className="w-28 h-28 md:w-36 md:h-36 bg-[#151515] border border-cyan-500/30 rounded-3xl flex flex-col items-center justify-center relative z-10 shadow-2xl backdrop-blur-sm group-hover:border-cyan-500/60 transition-colors">
              <Icons.Cpu size={42} className="text-cyan-400 mb-2" />
              <span className="text-[10px] font-bold text-cyan-300 tracking-widest uppercase">Coder</span>
            </div>
          </div>
        </div>

        {/* Brand Content */}
        <div className="space-y-2 max-w-3xl">
          <h1 className="text-7xl md:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-white to-cyan-400 tracking-tighter pb-4">
            Quiz
          </h1>
          <div className="flex items-center justify-center gap-3 text-gray-500 font-mono text-sm tracking-[0.5em] uppercase">
             <span>QZ.COOL</span>
          </div>
          
          <p className="text-gray-400/80 text-lg pt-4 max-w-xl mx-auto font-light">
            The Dual-Brain Code Studio where <span className="text-purple-400">Architecture</span> meets <span className="text-cyan-400">Execution</span>.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left max-w-4xl mt-8">
           <div className="p-4 rounded-xl bg-[#1a1a1a]/50 border border-gray-800/50 hover:border-purple-500/30 transition-all group">
              <div className="flex items-center gap-3 mb-2 text-gray-300 font-semibold group-hover:text-purple-300 transition-colors">
                <Icons.Brain size={18} />
                <span>Deep Thought</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">Gemini 2.5 Flash Architect analyzes requirements and plans structure.</p>
           </div>
           <div className="p-4 rounded-xl bg-[#1a1a1a]/50 border border-gray-800/50 hover:border-cyan-500/30 transition-all group">
              <div className="flex items-center gap-3 mb-2 text-gray-300 font-semibold group-hover:text-cyan-300 transition-colors">
                <Icons.Terminal size={18} />
                <span>Precision Code</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">Gemini 3.0 Pro Coder implements the plan with high-reasoning capabilities.</p>
           </div>
           <div className="p-4 rounded-xl bg-[#1a1a1a]/50 border border-gray-800/50 hover:border-white/30 transition-all group">
              <div className="flex items-center gap-3 mb-2 text-gray-300 font-semibold group-hover:text-white transition-colors">
                <Icons.Check size={18} />
                <span>Auto-Review</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">Continuous audit loop ensures code quality and correctness.</p>
           </div>
        </div>

        {/* CTA */}
        <div className="pt-8">
            <button 
            onClick={onStart}
            className="group relative px-10 py-4 bg-white text-black font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_-15px_rgba(255,255,255,0.4)] cursor-pointer"
            >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-cyan-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-multiply"></div>
            <span className="flex items-center gap-2 relative z-10">
                Initialize Workspace
                <Icons.Play size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
            </button>
        </div>

        <div className="absolute bottom-6 text-[10px] text-gray-700 font-mono tracking-widest opacity-50">
            QZ.COOL &copy; {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};