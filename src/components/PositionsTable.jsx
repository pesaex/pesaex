import React from 'react';

export default function PositionsTable({ positions, onClearHistory }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Active Open Positions (Cloud Synced)</h3>
        {positions.length > 0 && (
          <button onClick={onClearHistory} className="text-xs text-rose-400 hover:underline">Clear History</button>
        )}
      </div>
      <div className="overflow-x-auto">
        {positions.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No active positions found. Execute an order above!</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-400 border-b border-slate-800">
              <tr>
                <th className="pb-3">Asset</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Entry Price</th>
                <th className="pb-3">Size</th>
                <th className="pb-3">Leverage</th>
                <th className="pb-3">Unrealized PnL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {positions.map(pos => (
                <tr key={pos.id} className="hover:bg-slate-800/30">
                  <td className="py-3 font-semibold text-white">{pos.asset}</td>
                  <td className="py-3"><span className={`px-2 py-0.5 rounded text-xs font-bold ${pos.type === 'BUY' || pos.type === 'LONG' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>{pos.type}</span></td>
                  <td className="py-3 text-slate-300">${Number(pos.entry).toLocaleString()}</td>
                  <td className="py-3 text-slate-300">{pos.size}</td>
                  <td className="py-3 text-slate-300">{pos.lev}</td>
                  <td className={`py-3 font-bold ${pos.pnlClass}`}>{pos.pnl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}