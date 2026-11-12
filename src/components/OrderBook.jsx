import React, { useState, useEffect } from 'react';

export default function OrderBook({ price }) {
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const basePrice = price || 91420;
      
      // Generate simulated live bids (buying pressure)
      const newBids = Array.from({ length: 5 }, (_, i) => {
        const p = (basePrice - (i + 1) * 12).toFixed(2);
        const amount = (Math.random() * 1.5 + 0.1).toFixed(4);
        return { price: p, size: amount };
      });

      // Generate simulated live asks (selling pressure)
      const newAsks = Array.from({ length: 5 }, (_, i) => {
        const p = (basePrice + (i + 1) * 12).toFixed(2);
        const amount = (Math.random() * 1.5 + 0.1).toFixed(4);
        return { price: p, size: amount };
      }).reverse();

      setBids(newBids);
      setAsks(newAsks);
    }, 1200);

    return () => clearInterval(interval);
  }, [price]);

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <span>📊 Live Order Book Depth</span>
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">REAL-TIME</span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
        {/* Asks (Sells) */}
        <div className="space-y-1">
          <div className="text-[10px] text-slate-500 uppercase font-bold flex justify-between border-b border-slate-800 pb-1">
            <span>Price ($)</span>
            <span>Size</span>
          </div>
          {asks.map((ask, idx) => (
            <div key={idx} className="flex justify-between text-rose-400">
              <span>{Number(ask.price).toLocaleString()}</span>
              <span className="text-slate-300">{ask.size}</span>
            </div>
          ))}
        </div>

        {/* Bids (Buys) */}
        <div className="space-y-1">
          <div className="text-[10px] text-slate-500 uppercase font-bold flex justify-between border-b border-slate-800 pb-1">
            <span>Price ($)</span>
            <span>Size</span>
          </div>
          {bids.map((bid, idx) => (
            <div key={idx} className="flex justify-between text-emerald-400">
              <span>{Number(bid.price).toLocaleString()}</span>
              <span className="text-slate-300">{bid.size}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}