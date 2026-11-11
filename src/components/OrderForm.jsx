import React, { useState } from 'react';

export default function OrderForm({ asset, price, onExecuteTrade }) {
  const [orderType, setOrderType] = useState('market');
  const [side, setSide] = useState('buy');
  const [amount, setAmount] = useState('0.25');
  const [leverage, setLeverage] = useState('10');
  const [takeProfit, setTakeProfit] = useState('95000');
  const [stopLoss, setStopLoss] = useState('89000');

  const handleSubmit = (e) => {
    e.preventDefault();
    onExecuteTrade({
      id: Date.now(),
      asset: asset,
      type: side.toUpperCase(),
      entry: price,
      size: `${amount} ${asset.split('/')[0]}`,
      lev: `${leverage}x`,
      pnl: '+$0.00',
      pnlClass: 'text-slate-400'
    });
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Place Order</h3>
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button 
            type="button" 
            onClick={() => setSide('buy')} 
            className={`py-2 rounded-lg font-bold text-sm transition ${side === 'buy' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:text-white'}`}
          >
            BUY / LONG
          </button>
          <button 
            type="button" 
            onClick={() => setSide('sell')} 
            className={`py-2 rounded-lg font-bold text-sm transition ${side === 'sell' ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' : 'text-slate-400 hover:text-white'}`}
          >
            SELL / SHORT
          </button>
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">Order Type</label>
          <select value={orderType} onChange={(e) => setOrderType(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white outline-none">
            <option value="market">Market Order</option>
            <option value="limit">Limit Order</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">Amount ({asset.split('/')[0]})</label>
          <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white outline-none" />
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">Leverage ({leverage}x)</label>
          <input type="range" min="1" max="50" value={leverage} onChange={(e) => setLeverage(e.target.value)} className="w-full accent-rose-500 cursor-pointer" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Take Profit ($)</label>
            <input type="number" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white outline-none" />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Stop Loss ($)</label>
            <input type="number" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white outline-none" />
          </div>
        </div>

        <button type="submit" className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition ${side === 'buy' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'}`}>
          Execute {side.toUpperCase()} Order
        </button>
      </form>
    </div>
  );
}