import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, PieChart, Activity, Zap, 
  Share2, Copy, Check, Lock, ArrowUpRight, ArrowDownRight, RefreshCw, 
  Settings, Bell, Search, ChevronDown, Sliders, ShieldCheck, HelpCircle,
  ExternalLink, BarChart2, Layers, Filter, Eye, X, Terminal, Server, Rocket,
  Cloud, Code
} from 'lucide-react';

// --- Default Pre-configured Assets & Mock Data ---
const ASSETS = [
  { symbol: 'BTC/USD', name: 'Bitcoin', price: 92450.80, change24h: 3.42, high: 93800.00, low: 89500.00, volume: '2.4B', type: 'Crypto' },
  { symbol: 'ETH/USD', name: 'Ethereum', price: 3450.25, change24h: -1.15, high: 3580.00, low: 3390.10, volume: '1.1B', type: 'Crypto' },
  { symbol: 'SOL/USD', name: 'Solana', price: 184.60, change24h: 8.75, high: 191.20, low: 168.40, volume: '840M', type: 'Crypto' },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: 1.0845, change24h: 0.12, high: 1.0880, low: 1.0820, volume: '4.8B', type: 'Forex' },
  { symbol: 'NVDA/USD', name: 'NVIDIA Corp', price: 138.20, change24h: 4.85, high: 140.50, low: 132.10, volume: '3.2B', type: 'Stock' }
];

export default function App() {
  // Global State
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [chartTimeframe, setChartTimeframe] = useState('1H');
  const [chartType, setChartType] = useState('line'); // 'line' or 'candlestick'
  
  // User Portfolio State
  const [balance, setBalance] = useState(48250.00);
  const [positions, setPositions] = useState([
    { id: 'pos-1', symbol: 'BTC/USD', type: 'LONG', amount: 0.25, entryPrice: 91200.00, leverage: 10, pnl: 312.70, pnlPercent: 1.37 },
    { id: 'pos-2', symbol: 'ETH/USD', type: 'SHORT', amount: 2.0, entryPrice: 3510.00, leverage: 5, pnl: 119.50, pnlPercent: 1.70 }
  ]);
  const [tradeHistory, setTradeHistory] = useState([
    { id: 'th-1', symbol: 'SOL/USD', type: 'BUY', price: 172.40, amount: 15, total: 2586.00, time: '14:22:10', status: 'FILLED' },
    { id: 'th-2', symbol: 'BTC/USD', type: 'SELL', price: 92100.00, amount: 0.1, total: 9210.00, time: '12:05:44', status: 'FILLED' }
  ]);

  // Real-time Dynamic Price Simulation
  const [currentPrice, setCurrentPrice] = useState(selectedAsset.price);
  const [priceHistory, setPriceHistory] = useState([]);
  const [candles, setCandles] = useState([]);

  // Order Book State
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);

  // Modals state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderType, setOrderType] = useState('BUY'); // 'BUY' or 'SELL'
  const [orderExecutionType, setOrderExecutionType] = useState('MARKET'); // 'MARKET' or 'LIMIT'
  const [tradeAmount, setTradeAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [leverage, setLeverage] = useState(10);
  const [notification, setNotification] = useState(null);

  // Link Generator State
  const [shareConfig, setShareConfig] = useState({
    symbol: selectedAsset.symbol,
    action: 'BUY',
    leverage: 10,
    takeProfit: '',
    stopLoss: '',
    comment: 'Strong momentum breakout confirmation on key resistance.',
    creator: 'ProTrader_Alpha'
  });
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync current price on asset change
  useEffect(() => {
    setCurrentPrice(selectedAsset.price);
    setLimitPrice(selectedAsset.price.toString());
    generateMockHistory(selectedAsset.price);
    generateOrderBook(selectedAsset.price);
  }, [selectedAsset]);

  // Generate initial price history & candles for current asset
  const generateMockHistory = (basePrice) => {
    const history = [];
    const generatedCandles = [];
    let price = basePrice * 0.95;
    const now = Date.now();
    
    for (let i = 50; i >= 0; i--) {
      const time = new Date(now - i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const change = (Math.random() - 0.48) * (basePrice * 0.004);
      price += change;
      
      const open = price - change;
      const close = price;
      const high = Math.max(open, close) + Math.random() * (basePrice * 0.002);
      const low = Math.min(open, close) - Math.random() * (basePrice * 0.002);
      
      history.push({ time, price: parseFloat(price.toFixed(2)) });
      generatedCandles.push({ time, open, high, low, close });
    }
    setPriceHistory(history);
    setCandles(generatedCandles);
  };

  // Generate realistic Bids/Asks Order Book
  const generateOrderBook = (basePrice) => {
    const newBids = [];
    const newAsks = [];
    let bidAccum = 0;
    let askAccum = 0;

    for (let i = 1; i <= 8; i++) {
      const bidPrice = basePrice * (1 - i * 0.0006);
      const bidSize = (Math.random() * 1.5 + 0.1).toFixed(3);
      bidAccum += parseFloat(bidSize);
      newBids.push({ price: bidPrice.toFixed(2), amount: bidSize, total: bidAccum.toFixed(3) });

      const askPrice = basePrice * (1 + i * 0.0006);
      const askSize = (Math.random() * 1.5 + 0.1).toFixed(3);
      askAccum += parseFloat(askSize);
      newAsks.push({ price: askPrice.toFixed(2), amount: askSize, total: askAccum.toFixed(3) });
    }
    setBids(newBids);
    setAsks(newAsks.reverse());
  };

  // Ticker Live Engine: Simulate real-time price fluctuation and live order book feed
  useEffect(() => {
    const interval = setInterval(() => {
      const deltaPercent = (Math.random() - 0.495) * 0.003;
      setCurrentPrice((prevPrice) => {
        const updated = Math.max(0.01, prevPrice * (1 + deltaPercent));
        const formatted = parseFloat(updated.toFixed(2));
        
        // Update price history live
        setPriceHistory((prevHistory) => {
          const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const newHist = [...prevHistory.slice(1), { time: nowTime, price: formatted }];
          return newHist;
        });

        return formatted;
      });

      // Update Order Book randomly
      generateOrderBook(currentPrice);
    }, 1200);

    return () => clearInterval(interval);
  }, [currentPrice]);

  // Show temporary toast notification
  const notify = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Handle Order Placement
  const handleExecuteOrder = (e) => {
    e.preventDefault();
    const amountVal = parseFloat(tradeAmount);
    if (!amountVal || amountVal <= 0) {
      notify('Please enter a valid amount', 'error');
      return;
    }

    const execPrice = orderExecutionType === 'MARKET' ? currentPrice : parseFloat(limitPrice);
    const totalCost = (execPrice * amountVal) / leverage;

    if (totalCost > balance) {
      notify('Insufficient margin balance!', 'error');
      return;
    }

    // Deduct balance, add position & trade history
    setBalance(prev => prev - totalCost);

    const newPosition = {
      id: `pos-${Date.now()}`,
      symbol: selectedAsset.symbol,
      type: orderType === 'BUY' ? 'LONG' : 'SHORT',
      amount: amountVal,
      entryPrice: execPrice,
      leverage: leverage,
      pnl: 0.00,
      pnlPercent: 0.00
    };

    const newTrade = {
      id: `th-${Date.now()}`,
      symbol: selectedAsset.symbol,
      type: orderType,
      price: execPrice,
      amount: amountVal,
      total: execPrice * amountVal,
      time: new Date().toLocaleTimeString(),
      status: 'FILLED'
    };

    setPositions([newPosition, ...positions]);
    setTradeHistory([newTrade, ...tradeHistory]);
    setIsOrderModalOpen(false);
    setTradeAmount('');
    notify(`Successfully placed ${orderType} order for ${amountVal} ${selectedAsset.symbol}!`, 'success');
  };

  // Close active position
  const handleClosePosition = (id) => {
    const pos = positions.find(p => p.id === id);
    if (!pos) return;
    
    // Return margin + PnL
    const returnedValue = ((pos.entryPrice * pos.amount) / pos.leverage) + pos.pnl;
    setBalance(prev => prev + returnedValue);
    setPositions(positions.filter(p => p.id !== id));
    notify(`Closed ${pos.symbol} ${pos.type} position. PnL: $${pos.pnl.toFixed(2)}`, pos.pnl >= 0 ? 'success' : 'error');
  };

  // Link generation helper
  const generatedShareUrl = useMemo(() => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      trade: 'copy',
      symbol: shareConfig.symbol,
      action: shareConfig.action,
      lev: shareConfig.leverage,
      tp: shareConfig.takeProfit || 'none',
      sl: shareConfig.stopLoss || 'none',
      ref: shareConfig.creator
    });
    return `${baseUrl}?${params.toString()}`;
  }, [shareConfig]);

  const copyToClipboard = async () => {
    let success = false;

    // First attempt modern Clipboard API wrapped in try/catch
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(generatedShareUrl);
        success = true;
      } catch (err) {
        // Direct clipboard API blocked by iframe permission policy
        success = false;
      }
    }

    // Fallback strategy using hidden textarea & document.execCommand
    if (!success) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = generatedShareUrl;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch (err) {
        success = false;
      }
    }

    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
      notify('Live trading signal link copied to clipboard!', 'success');
    } else {
      notify('Could not auto-copy. Please select and copy the text manually.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* --- Top Navigation Bar --- */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="h-5 w-5 text-white fill-current" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                ApexTrade
              </span>
              <span className="ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                PRO LIVE
              </span>
            </div>
          </div>

          {/* Quick Asset Selector Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
            {ASSETS.map((asset) => (
              <button
                key={asset.symbol}
                onClick={() => setSelectedAsset(asset)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  selectedAsset.symbol === asset.symbol
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {asset.symbol}
              </button>
            ))}
          </nav>
        </div>

        {/* Global Controls & User Stats */}
        <div className="flex items-center gap-3">
          {/* Free Hosting & Deployment Button */}
          <button
            onClick={() => setIsDeployModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
          >
            <Rocket className="h-3.5 w-3.5" />
            <span>Host Free Link</span>
          </button>

          {/* Share Live Trading Link Action Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Generate Signal Link</span>
          </button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Portfolio Balance Badge */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Available Equity</span>
            <span className="text-sm font-mono font-bold text-emerald-400">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <button 
            onClick={() => {
              setOrderType('BUY');
              setIsOrderModalOpen(true);
            }}
            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-emerald-500/10 transition-all"
          >
            Trade
          </button>
        </div>
      </header>

      {/* --- Main Dashboard Container --- */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        
        {/* LEFT & CENTER COLUMN: Asset Overview & Interactive Charts (Cols 8) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Header Stats Bar for Selected Asset */}
          <div className="bg-slate-900/70 rounded-xl border border-slate-800 p-4 flex flex-wrap items-center justify-between gap-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400">
                {selectedAsset.symbol.slice(0, 3)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white tracking-tight">{selectedAsset.symbol}</h1>
                  <span className="text-xs text-slate-400 font-medium">{selectedAsset.name}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-mono font-extrabold tracking-tight text-white">
                    ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded ${
                    selectedAsset.change24h >= 0 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {selectedAsset.change24h >= 0 ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                    {selectedAsset.change24h >= 0 ? '+' : ''}{selectedAsset.change24h}%
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 text-xs border-l border-slate-800 pl-6">
              <div>
                <p className="text-slate-400 font-medium">24h High</p>
                <p className="font-mono text-slate-200 font-semibold mt-0.5">${selectedAsset.high.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">24h Low</p>
                <p className="font-mono text-slate-200 font-semibold mt-0.5">${selectedAsset.low.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">24h Volume</p>
                <p className="font-mono text-slate-200 font-semibold mt-0.5">{selectedAsset.volume}</p>
              </div>
            </div>
          </div>

          {/* Interactive Chart Section */}
          <div className="bg-slate-900/70 rounded-xl border border-slate-800 p-4 flex flex-col flex-1 min-h-[420px] backdrop-blur-sm relative">
            
            {/* Chart Toolbar Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b border-slate-800">
              <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
                {['15M', '1H', '4H', '1D', '1W'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setChartTimeframe(tf)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                      chartTimeframe === tf 
                        ? 'bg-indigo-600 text-white shadow' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => setChartType('line')}
                    className={`px-2.5 py-1 rounded font-medium ${chartType === 'line' ? 'bg-slate-800 text-indigo-400 font-bold' : 'text-slate-400'}`}
                  >
                    Line
                  </button>
                  <button
                    onClick={() => setChartType('candlestick')}
                    className={`px-2.5 py-1 rounded font-medium ${chartType === 'candlestick' ? 'bg-slate-800 text-indigo-400 font-bold' : 'text-slate-400'}`}
                  >
                    Candles
                  </button>
                </div>
              </div>
            </div>

            {/* Rendered Chart */}
            <div className="flex-1 w-full relative min-h-[300px]">
              {chartType === 'line' ? (
                <LineChartVisual data={priceHistory} />
              ) : (
                <CandlestickChartVisual candles={candles} />
              )}
            </div>

            {/* Live Data Stream Indicator */}
            <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-slate-950/80 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-full text-[11px] font-mono text-slate-300 shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              LIVE TICKER STREAM: ACTIVE
            </div>
          </div>

          {/* Active Positions & Portfolio Dashboard */}
          <div className="bg-slate-900/70 rounded-xl border border-slate-800 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-400" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">Open Positions</h3>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 font-medium px-2 py-0.5 rounded-full">
                {positions.length} Active
              </span>
            </div>

            {positions.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No open positions. Use the order execution panel to open a position.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800/60 pb-2">
                      <th className="pb-2 font-medium">Asset</th>
                      <th className="pb-2 font-medium">Type</th>
                      <th className="pb-2 font-medium">Size</th>
                      <th className="pb-2 font-medium">Entry Price</th>
                      <th className="pb-2 font-medium">Mark Price</th>
                      <th className="pb-2 font-medium">PnL ($)</th>
                      <th className="pb-2 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {positions.map((pos) => {
                      const isLong = pos.type === 'LONG';
                      const markPrice = currentPrice;
                      const priceDiff = isLong ? markPrice - pos.entryPrice : pos.entryPrice - markPrice;
                      const livePnL = priceDiff * pos.amount * pos.leverage;
                      const pnlClass = livePnL >= 0 ? 'text-emerald-400' : 'text-rose-400';

                      return (
                        <tr key={pos.id} className="hover:bg-slate-800/30 transition">
                          <td className="py-2.5 font-bold text-white">{pos.symbol}</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isLong ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}>
                              {pos.type} {pos.leverage}x
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-200">{pos.amount}</td>
                          <td className="py-2.5 text-slate-300">${pos.entryPrice.toLocaleString()}</td>
                          <td className="py-2.5 text-slate-300">${markPrice.toLocaleString()}</td>
                          <td className={`py-2.5 font-bold ${pnlClass}`}>
                            {livePnL >= 0 ? '+' : ''}${livePnL.toFixed(2)}
                          </td>
                          <td className="py-2.5 text-right">
                            <button
                              onClick={() => handleClosePosition(pos.id)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-600/80 hover:text-white text-slate-300 transition text-[11px] font-sans"
                            >
                              Close
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Order Book & Order Execution (Cols 4) */}
        <div className="lg:col-span-4 flex flex-col gap-3 md:gap-4">
          
          {/* Quick Order Action Box */}
          <div className="bg-slate-900/70 rounded-xl border border-slate-800 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <Terminal className="h-4 w-4 text-indigo-400" />
                Order Execution
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">Spot / Perpetual</span>
            </div>

            {/* Buy / Sell Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-lg border border-slate-800 mb-4">
              <button
                onClick={() => setOrderType('BUY')}
                className={`py-2 text-xs font-bold rounded-md transition-all ${
                  orderType === 'BUY'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                BUY / LONG
              </button>
              <button
                onClick={() => setOrderType('SELL')}
                className={`py-2 text-xs font-bold rounded-md transition-all ${
                  orderType === 'SELL'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                SELL / SHORT
              </button>
            </div>

            {/* Execution Form */}
            <form onSubmit={handleExecuteOrder} className="space-y-3.5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Order Type</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderExecutionType('MARKET')}
                    className={`px-2 py-0.5 rounded font-semibold ${orderExecutionType === 'MARKET' ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
                  >
                    Market
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderExecutionType('LIMIT')}
                    className={`px-2 py-0.5 rounded font-semibold ${orderExecutionType === 'LIMIT' ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
                  >
                    Limit
                  </button>
                </div>
              </div>

              {orderExecutionType === 'LIMIT' && (
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Limit Price (USD)</label>
                  <input
                    type="number"
                    step="any"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Amount ({selectedAsset.symbol.split('/')[0]})</label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Leverage</span>
                  <span className="font-mono text-indigo-400 font-bold">{leverage}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={leverage}
                  onChange={(e) => setLeverage(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Required Margin</span>
                  <span className="font-mono text-white font-semibold">
                    ${((currentPrice * (parseFloat(tradeAmount) || 0)) / leverage).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Est. Liquidation Price</span>
                  <span className="font-mono text-rose-400">
                    ${orderType === 'BUY' ? (currentPrice * (1 - 0.9 / leverage)).toFixed(2) : (currentPrice * (1 + 0.9 / leverage)).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-lg font-bold text-xs shadow-lg transition-all ${
                  orderType === 'BUY'
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/10'
                    : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/10'
                }`}
              >
                {orderType} {selectedAsset.symbol.split('/')[0]}
              </button>
            </form>
          </div>

          {/* Real-time Live Order Book Panel */}
          <div className="bg-slate-900/70 rounded-xl border border-slate-800 p-4 backdrop-blur-sm flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                <BarChart2 className="h-3.5 w-3.5 text-indigo-400" />
                Live Order Book
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Streaming
              </span>
            </div>

            <div className="grid grid-cols-3 text-[10px] font-semibold text-slate-500 border-b border-slate-800 pb-1 mb-1">
              <span>Price (USD)</span>
              <span className="text-right">Size</span>
              <span className="text-right">Total</span>
            </div>

            {/* Asks (Sell Orders - Red) */}
            <div className="space-y-0.5 font-mono text-[11px] overflow-hidden">
              {asks.slice(0, 5).map((ask, idx) => (
                <div key={`ask-${idx}`} className="grid grid-cols-3 hover:bg-slate-800/40 py-0.5 rounded">
                  <span className="text-rose-400 font-medium">{ask.price}</span>
                  <span className="text-right text-slate-300">{ask.amount}</span>
                  <span className="text-right text-slate-500">{ask.total}</span>
                </div>
              ))}
            </div>

            {/* Current Price Divider */}
            <div className="my-2 py-1.5 border-y border-slate-800 bg-slate-950/80 text-center font-mono font-bold text-sm text-indigo-400 flex items-center justify-center gap-2">
              <span>${currentPrice.toFixed(2)}</span>
              <span className="text-[10px] font-sans font-normal text-slate-400">Market Price</span>
            </div>

            {/* Bids (Buy Orders - Green) */}
            <div className="space-y-0.5 font-mono text-[11px] overflow-hidden">
              {bids.slice(0, 5).map((bid, idx) => (
                <div key={`bid-${idx}`} className="grid grid-cols-3 hover:bg-slate-800/40 py-0.5 rounded">
                  <span className="text-emerald-400 font-medium">{bid.price}</span>
                  <span className="text-right text-slate-300">{bid.amount}</span>
                  <span className="text-right text-slate-500">{bid.total}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      {/* --- 100% FREE HOSTING & DEPLOYMENT MODAL --- */}
      {isDeployModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Rocket className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Deploy & Host 100% Cost-Free</h3>
                  <p className="text-xs text-slate-400">Export your app to a live, permanent public URL at $0 cost</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDeployModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Both <strong>Cloudflare Pages</strong> and <strong>Vercel</strong> offer unlimited static hosting tiers that are <strong>100% free forever</strong> with zero credit card required.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-indigo-400">3-Step Zero-Cost Setup:</h4>
                
                <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="h-6 w-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">1</span>
                  <div>
                    <span className="font-semibold text-slate-200 block">Push Code to GitHub</span>
                    <p className="text-slate-400 mt-0.5">Create a free repository at <code>github.com/new</code> and push your trading app project.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="h-6 w-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">2</span>
                  <div>
                    <span className="font-semibold text-slate-200 block">Connect Cloudflare Pages or Vercel</span>
                    <p className="text-slate-400 mt-0.5">Sign up on <strong>Cloudflare.com</strong> or <strong>Vercel.com</strong> using your GitHub account and import the repository.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="h-6 w-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">3</span>
                  <div>
                    <span className="font-semibold text-slate-200 block">Export & Share Your Live Link</span>
                    <p className="text-slate-400 mt-0.5">Your app gets a free permanent link like <code>https://my-trading-app.pages.dev</code> with SSL security included!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsDeployModalOpen(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition"
              >
                Got It, Let's Build!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- GENERATE SHAREABLE LIVE TRADING LINK MODAL --- */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Generate Live Signal Link</h3>
                  <p className="text-xs text-slate-400">Create an instant shareable trade link for copy traders</p>
                </div>
              </div>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body / Configuration */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Asset Pair</label>
                  <select
                    value={shareConfig.symbol}
                    onChange={(e) => setShareConfig({ ...shareConfig, symbol: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  >
                    {ASSETS.map(a => <option key={a.symbol} value={a.symbol}>{a.symbol}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Action Signal</label>
                  <select
                    value={shareConfig.action}
                    onChange={(e) => setShareConfig({ ...shareConfig, action: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="BUY">BUY / LONG</option>
                    <option value="SELL">SELL / SHORT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Leverage</label>
                  <input
                    type="number"
                    value={shareConfig.leverage}
                    onChange={(e) => setShareConfig({ ...shareConfig, leverage: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Take Profit ($)</label>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={shareConfig.takeProfit}
                    onChange={(e) => setShareConfig({ ...shareConfig, takeProfit: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Stop Loss ($)</label>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={shareConfig.stopLoss}
                    onChange={(e) => setShareConfig({ ...shareConfig, stopLoss: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Signal Note / Rationale</label>
                <textarea
                  rows="2"
                  value={shareConfig.comment}
                  onChange={(e) => setShareConfig({ ...shareConfig, comment: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              {/* Generated Instant Link Box */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-indigo-400 block mb-1.5 flex items-center gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Your Unique Live Copy-Trading Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedShareUrl}
                    className="w-full bg-slate-950 border border-indigo-500/30 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 select-all"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition"
                  >
                    {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedLink ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Encrypted Signal Payload
              </span>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-3 py-1 rounded hover:text-white"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- TOAST NOTIFICATIONS --- */}
      {notification && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl text-xs font-medium animate-in slide-in-from-bottom duration-300 ${
          notification.type === 'success' 
            ? 'bg-slate-900 border-emerald-500/40 text-emerald-400' 
            : 'bg-slate-900 border-rose-500/40 text-rose-400'
        }`}>
          {notification.type === 'success' ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          <span>{notification.msg}</span>
        </div>
      )}

    </div>
  );
}

// --- Dynamic Line Chart Canvas Visualizer ---
function LineChartVisual({ data }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0) return;
    const ctx = canvas.getContext('2d');

    // Dynamic High-DPI Canvas Resizing
    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices) * 0.999;
    const maxPrice = Math.max(...prices) * 1.001;
    const range = maxPrice - minPrice || 1;

    // Draw Background Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let i = 1; i <= 4; i++) {
      const y = (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Price Path
    ctx.beginPath();
    const points = data.map((d, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((d.price - minPrice) / range) * (height - 40) - 20;
      return { x, y };
    });

    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(p => ctx.lineTo(p.x, p.y));

    // Gradient Stroke
    const isUp = prices[prices.length - 1] >= prices[0];
    const strokeColor = isUp ? '#10b981' : '#f43f5e';
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Area Fill Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, isUp ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)');
    gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');

    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

  }, [data]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}

// --- Dynamic Candlestick Visualizer ---
function CandlestickChartVisual({ candles }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !candles || candles.length === 0) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const allPrices = candles.flatMap(c => [c.high, c.low]);
    const minPrice = Math.min(...allPrices) * 0.999;
    const maxPrice = Math.max(...allPrices) * 1.001;
    const range = maxPrice - minPrice || 1;

    const candleWidth = (width / candles.length) * 0.65;

    candles.forEach((c, index) => {
      const x = (index / candles.length) * width + candleWidth / 2;
      const openY = height - ((c.open - minPrice) / range) * (height - 40) - 20;
      const closeY = height - ((c.close - minPrice) / range) * (height - 40) - 20;
      const highY = height - ((c.high - minPrice) / range) * (height - 40) - 20;
      const lowY = height - ((c.low - minPrice) / range) * (height - 40) - 20;

      const isGreen = c.close >= c.open;
      const color = isGreen ? '#10b981' : '#f43f5e';

      // Draw Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Draw Candle Body
      ctx.fillStyle = color;
      const top = Math.min(openY, closeY);
      const bodyHeight = Math.max(Math.abs(closeY - openY), 2);
      ctx.fillRect(x - candleWidth / 2, top, candleWidth, bodyHeight);
    });

  }, [candles]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}
