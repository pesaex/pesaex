import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PriceChart from './components/PriceChart';
import PositionsTable from './components/PositionsTable';
import Sidebar from './components/Sidebar';
import { supabase } from './services/supabase';

export default function App() {
  const [asset, setAsset] = useState('BTC/USD');
  const [price, setPrice] = useState(91420.50);
  const [priceChange, setPriceChange] = useState('+3.42%');
  const [timeframe, setTimeframe] = useState('1H');

  const [positions, setPositions] = useState([
    { id: 1, asset: 'BTC/USD', type: 'LONG', entry: 90800, size: '0.5 BTC', lev: '10x', pnl: '+$310.25', pnlClass: 'text-emerald-400' },
    { id: 2, asset: 'ETH/USD', type: 'SHORT', entry: 3420, size: '4.2 ETH', lev: '5x', pnl: '-$42.10', pnlClass: 'text-rose-400' }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [signalLink, setSignalLink] = useState('');
  const [copied, setCopied] = useState(false);

  // Fetch positions from Supabase on load
  useEffect(() => {
    async function fetchPositions() {
      const { data, error } = await supabase.from('positions').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setPositions(data);
      }
    }
    fetchPositions();
  }, []);

  const handleExecuteTrade = async (newPos) => {
    setPositions([newPos, ...positions]);

    const { error } = await supabase.from('positions').insert([
      {
        asset: newPos.asset,
        type: newPos.type,
        entry: newPos.entry,
        size: newPos.size,
        lev: newPos.lev,
        pnl: newPos.pnl,
        pnl_class: newPos.pnlClass
      }
    ]);

    if (error) {
      console.error('Error saving position to Supabase:', error.message);
    }
  };

  const clearHistory = async () => {
    if (confirm('Clear all cloud-saved positions?')) {
      setPositions([]);
      await supabase.from('positions').delete().neq('id', 0);
    }
  };

  const generateSignalLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const link = `${baseUrl}?asset=${encodeURIComponent(asset)}&side=buy&entry=${price}`;
    setSignalLink(link);
    setModalOpen(true);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(signalLink);
    setCopied(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar onOpenSignalModal={generateSignalLink} />

      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        <div className="lg:col-span-2 space-y-6">
          <PriceChart 
            asset={asset} 
            setAsset={setAsset} 
            price={price} 
            setPrice={setPrice} 
            priceChange={priceChange} 
            timeframe={timeframe} 
            setTimeframe={setTimeframe} 
          />
          <PositionsTable positions={positions} onClearHistory={clearHistory} />
        </div>

        <Sidebar 
          asset={asset} 
          price={price} 
          onExecuteTrade={handleExecuteTrade} 
        />
      </main>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Shareable Trade Signal Link</h3>
            <p className="text-xs text-slate-400">Anyone with this link can view your live signal parameters.</p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-emerald-400 break-all font-mono">
              {signalLink}
            </div>
            <div className="flex gap-3">
              <button onClick={copyToClipboard} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-medium py-2.5 rounded-xl transition text-sm">
                {copied ? '✅ Copied!' : 'Copy Link'}
              </button>
              <button onClick={() => setModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-2.5 rounded-xl transition text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}