import React from 'react';

export default function Navbar({ onOpenSignalModal }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-purple-600 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-rose-500/20">P</div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            PesaEx Terminal <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">MODULAR + SUPABASE</span>
          </h1>
          <p className="text-xs text-slate-400">Institutional Multi-Asset Trading & Cloud Database Architecture</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={onOpenSignalModal} 
          className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-md transition flex items-center gap-2"
        >
          <span>🔗 Share Live Signal Link</span>
        </button>
      </div>
    </header>
  );
}