import React, { useState } from 'react';

export default function RiskCalculator({ price }) {
  const [accountBalance, setAccountBalance] = useState('10000');
  const [riskPercent, setRiskPercent] = useState('2');
  const [entryPrice, setEntryPrice] = useState(price || 91420);
  const [stopLossPrice, setStopLossPrice] = useState(89500);

  // Calculations
  const riskAmount = (Number(accountBalance) * (Number(riskPercent) / 100)).toFixed(2);
  const priceRiskPerUnit = Math.abs(Number(entryPrice) - Number(stopLossPrice));
  const suggestedPositionSize = priceRiskPerUnit > 0 ? (riskAmount / priceRiskPerUnit).toFixed(4) : 0;

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <span>🛡️ Risk & Margin Guard</span>
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">PRO TOOLS</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Account Balance ($)</label>
          <input 
            type="number" 
            value={accountBalance} 
            onChange={(e) => setAccountBalance(e.target.value)} 
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none" 
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Risk Tolerance (%)</label>
          <input 
            type="number" 
            step="0.1" 
            value={riskPercent} 
            onChange={(e) => setRiskPercent(e.target.value)} 
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none" 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Entry Price ($)</label>
          <input 
            type="number" 
            value={entryPrice} 
            onChange={(e) => setEntryPrice(e.target.value)} 
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none" 
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Stop Loss ($)</label>
          <input 
            type="number" 
            value={stopLossPrice} 
            onChange={(e) => setStopLossPrice(e.target.value)} 
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none" 
          />
        </div>
      </div>

      <div className="bg-slate-950/80 rounded-xl border border-slate-800/60 p-3 space-y-2 text-xs">
        <div className="flex justify-between text-slate-400">
          <span>Max Capital at Risk:</span>
          <span className="font-bold text-rose-400">${riskAmount}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Recommended Size:</span>
          <span className="font-bold text-emerald-400">{suggestedPositionSize} Units</span>
        </div>
      </div>
    </div>
  );
}