import React, { useState, useEffect } from 'react';

export default function PriceChart({ asset, setAsset, price, setPrice, priceChange, timeframe, setTimeframe }) {
  const [multiData, setMultiData] = useState({
    line1: [89500, 90100, 89800, 90400, 90900, 90600, 91200, 91000, 91500, 91420],
    line2: [88500, 89200, 89100, 89700, 90100, 89900, 90500, 90400, 90800, 90750],
    line3: [90500, 90900, 90600, 91100, 91600, 91300, 91800, 91650, 92100, 92000],
    line4: [87500, 88100, 88000, 88600, 89000, 88800, 89400, 89250, 89700, 89600],
    line5: [91500, 91900, 91700, 92200, 92600, 92400, 92900, 92800, 93300, 93150]
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(prev => {
        const delta = Number((Math.random() * 60 - 29.5).toFixed(2));
        const newPrice = Number((prev + delta).toFixed(2));
        
        setMultiData(current => {
          const updateLine = (arr, offset) => {
            const updated = [...arr, newPrice + offset];
            if (updated.length > 20) updated.shift();
            return updated;
          };
          return {
            line1: updateLine(current.line1, 0),
            line2: updateLine(current.line2, -800),
            line3: updateLine(current.line3, 600),
            line4: updateLine(current.line4, -1600),
            line5: updateLine(current.line5, 1400)
          };
        });

        return newPrice;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [setPrice]);

  const chartHeight = 220;
  const chartWidth = 600;

  const allValues = [...multiData.line1, ...multiData.line2, ...multiData.line3, ...multiData.line4, ...multiData.line5];
  const minP = Math.min(...allValues);
  const maxP = Math.max(...allValues);
  const rangeP = maxP - minP || 1;

  const getPoints = (arr) => {
    return arr.map((val, idx) => {
      const x = (idx / (arr.length - 1)) * chartWidth;
      const y = chartHeight - ((val - minP) / rangeP) * (chartHeight - 40) - 20;
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <select value={asset} onChange={(e) => setAsset(e.target.value)} className="bg-slate-800 border border-slate-700 text-white font-semibold px-3 py-1.5 rounded-lg outline-none">
            <option value="BTC/USD">BTC/USD</option>
            <option value="ETH/USD">ETH/USD</option>
            <option value="SOL/USD">SOL/USD</option>
            <option value="EUR/USD">EUR/USD</option>
          </select>
          <span className="text-2xl font-black tracking-tight text-white">${price.toLocaleString()}</span>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">{priceChange}</span>
        </div>
        <div className="flex gap-1 bg-slate-800/60 p-1 rounded-lg text-xs">
          {['1H', '4H', '1D', '1W'].map(tf => (
            <button key={tf} onClick={() => setTimeframe(tf)} className={`px-3 py-1 rounded font-medium transition ${timeframe === tf ? 'bg-rose-600 text-white shadow' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>{tf}</button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-xs font-medium mb-3 px-1 text-slate-300">
        <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-rose-500 rounded"></span> Primary Trend</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-emerald-400 rounded"></span> Bullish EMA</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-cyan-400 rounded"></span> Volume VWAP</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-amber-400 rounded"></span> Resistance</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-purple-400 rounded"></span> Support Band</span>
      </div>

      <div className="h-64 bg-slate-950/80 rounded-xl border border-slate-800/60 p-4 relative overflow-hidden flex flex-col justify-end">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48 overflow-visible">
          <polyline fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={getPoints(multiData.line1)} />
          <polyline fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={getPoints(multiData.line2)} />
          <polyline fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={getPoints(multiData.line3)} />
          <polyline fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={getPoints(multiData.line4)} />
          <polyline fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={getPoints(multiData.line5)} />
        </svg>
      </div>
    </div>
  );
}