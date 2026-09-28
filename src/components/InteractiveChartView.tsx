import React, { useState } from 'react';
import {
  TickerAsset,
  CANDLESTICK_SERIES,
  PriceAlert,
  TradingIdea,
  PaperPosition,
} from '../data/marketData';

interface InteractiveChartViewProps {
  activeTicker: TickerAsset;
  allTickers: TickerAsset[];
  onSelectSymbol: (symbol: string) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  onAddAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
  onPublishIdea: (idea: Omit<TradingIdea, 'id' | 'likes' | 'timestamp'>) => void;
  onExecuteOrder: (pos: Omit<PaperPosition, 'id' | 'timestamp'>) => void;
}

type DrawingTool =
  | 'crosshair'
  | 'trendline'
  | 'fib'
  | 'rr'
  | 'ruler';

export const InteractiveChartView: React.FC<InteractiveChartViewProps> = ({
  activeTicker,
  allTickers,
  onSelectSymbol,
  watchlist,
  onToggleWatchlist,
  onAddAlert,
  onPublishIdea,
  onExecuteOrder,
}) => {
  const [timeframe, setTimeframe] = useState<'15m' | '1H' | '4H' | '1D' | '1W'>('4H');
  const [showEma20, setShowEma20] = useState(true);
  const [showEma50, setShowEma50] = useState(true);
  const [showLevels, setShowLevels] = useState(true);
  const [showFxMenu, setShowFxMenu] = useState(false);
  const [showSymbolPicker, setShowSymbolPicker] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [activeTool, setActiveTool] = useState<DrawingTool>('crosshair');
  const [magnetEnabled, setMagnetEnabled] = useState(true);
  const [activeOverlays, setActiveOverlays] = useState<DrawingTool[]>([]);
  const [hoveredCandleIdx, setHoveredCandleIdx] = useState<number>(15);

  const [leverage, setLeverage] = useState<number>(20);
  const [orderModalSide, setOrderModalSide] = useState<'LONG' | 'SHORT' | null>(null);
  const [orderSizeUsd, setOrderSizeUsd] = useState<string>('10000');
  const [orderFeedback, setOrderFeedback] = useState<string | null>(null);

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertPrice, setAlertPrice] = useState<string>('');
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above');
  const [alertNote, setAlertNote] = useState<string>('关键阻力位突破提醒');

  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [ideaDirection, setIdeaDirection] = useState<'BULLISH' | 'BEARISH'>('BULLISH');
  const [ideaTitle, setIdeaTitle] = useState<string>('');
  const [ideaSummary, setIdeaSummary] = useState<string>('');
  const [ideaTarget, setIdeaTarget] = useState<string>('');
  const [ideaStop, setIdeaStop] = useState<string>('');

  const isFavorited = watchlist.includes(activeTicker.symbol);
  const activeCandle = CANDLESTICK_SERIES[hoveredCandleIdx] || CANDLESTICK_SERIES[15];

  const handleSelectTool = (tool: DrawingTool) => {
    setActiveTool(tool);
    if (tool !== 'crosshair' && !activeOverlays.includes(tool)) {
      setActiveOverlays((prev) => [...prev, tool]);
    }
  };

  const handleClearDrawings = () => {
    setActiveOverlays([]);
    setActiveTool('crosshair');
  };

  const formatPrice = (val: number) => {
    if (activeTicker.decimals === 5) return val.toFixed(5);
    if (activeTicker.decimals === 3) return val.toFixed(3);
    return (
      activeTicker.prefix +
      val.toLocaleString('en-US', {
        minimumFractionDigits: activeTicker.decimals,
        maximumFractionDigits: activeTicker.decimals,
      }) +
      (activeTicker.suffix || '')
    );
  };

  const buyPriceNum =
    activeTicker.symbol === 'BTCUSDT'
      ? Math.max(0, activeTicker.price - 2.5)
      : activeTicker.price;
  const sellPriceNum =
    activeTicker.symbol === 'BTCUSDT'
      ? Math.max(0, activeTicker.price - 4.5)
      : activeTicker.price * 0.9995;

  const handleChartPointerMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * 320;
    let closestIdx = 15;
    let minDist = Infinity;
    CANDLESTICK_SERIES.forEach((c, idx) => {
      const dist = Math.abs(c.x - relX);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = idx;
      }
    });
    setHoveredCandleIdx(closestIdx);
  };

  const cycleLeverage = () => {
    const steps = [5, 10, 20, 50, 100];
    const next = steps[(steps.indexOf(leverage) + 1) % steps.length];
    setLeverage(next);
  };

  const triggerToast = (msg: string) => {
    setOrderFeedback(msg);
    setTimeout(() => setOrderFeedback(null), 2600);
  };

  return (
    <div className="flex flex-col w-full text-on-surface select-none pb-2">
      {/* Feedback Toast Banner */}
      {orderFeedback && (
        <div className="fixed top-29 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-lg bg-secondary-container text-white font-data-mono-sm text-data-mono-sm font-semibold shadow-lg flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">
            check_circle
          </span>
          <span>{orderFeedback}</span>
        </div>
      )}

      {/* Asset Header & Realtime Market Barometer */}
      <section className="flex flex-col bg-surface-container-low px-space-md py-space-sm gap-space-xs shadow-sm relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <button
              onClick={() => setShowSymbolPicker((v) => !v)}
              className="flex items-center gap-1.5 hover:bg-surface-container px-1 py-0.5 -ml-1 rounded transition-colors cursor-pointer"
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  activeTicker.isBull
                    ? 'bg-secondary shadow-[0_0_8px_rgba(102,218,191,0.6)]'
                    : 'bg-tertiary shadow-[0_0_8px_rgba(255,179,176,0.6)]'
                }`}
              ></span>
              <span className="font-headline-panel text-headline-panel text-on-surface font-bold tracking-tight">
                {activeTicker.displaySymbol}
              </span>
              <span className="material-symbols-outlined text-[15px] text-outline">
                expand_more
              </span>
            </button>
            <span className="px-1.5 py-0.5 rounded bg-surface-container-highest font-badge-mono text-badge-mono text-on-surface-variant font-semibold">
              {activeTicker.exchange}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-surface-container-high font-badge-mono text-badge-mono text-primary font-bold">
              {timeframe}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleWatchlist(activeTicker.symbol)}
              className={`p-1 rounded hover:bg-surface-container-highest transition-colors cursor-pointer ${
                isFavorited ? 'text-secondary' : 'text-outline'
              }`}
              title="自选关注"
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{
                  fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                star
              </span>
            </button>
            <button
              onClick={() => setIsFullscreen((f) => !f)}
              className="p-1 rounded hover:bg-surface-container-highest text-on-surface-variant transition-colors cursor-pointer"
              title="全屏透视"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
              </span>
            </button>
          </div>
        </div>

        {/* Symbol Picker Popover */}
        {showSymbolPicker && (
          <div className="absolute top-10 left-2 z-40 w-64 bg-surface-container-high rounded-xl p-2 shadow-2xl border border-outline-variant/30 flex flex-col gap-1">
            <div className="px-2 py-1 flex items-center justify-between text-outline font-label-caps text-label-caps">
              <span>切换交易标的</span>
              <span>最新价</span>
            </div>
            {allTickers.map((item) => (
              <button
                key={item.symbol}
                onClick={() => {
                  onSelectSymbol(item.symbol);
                  setShowSymbolPicker(false);
                }}
                className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                  item.symbol === activeTicker.symbol
                    ? 'bg-primary-container/25 text-primary'
                    : 'hover:bg-surface-container-highest text-on-surface'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-data-mono-sm text-data-mono-sm font-bold">
                    {item.displaySymbol}
                  </span>
                  <span className="font-body-compact text-body-compact text-outline">
                    {item.name}
                  </span>
                </div>
                <span
                  className={`font-data-mono-sm text-data-mono-sm ${
                    item.isBull ? 'text-secondary' : 'text-tertiary'
                  }`}
                >
                  {item.prefix}
                  {item.price.toLocaleString('en-US', {
                    minimumFractionDigits: item.decimals,
                    maximumFractionDigits: item.decimals,
                  })}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Pricing Row with High-Precision Tick Telemetry */}
        <div className="flex items-baseline justify-between mt-0.5">
          <div className="flex items-baseline gap-space-sm">
            <span
              className={`font-display-price-mobile text-display-price-mobile font-bold tracking-tight ${
                activeTicker.isBull ? 'text-secondary' : 'text-tertiary'
              }`}
            >
              {formatPrice(activeTicker.price)}
            </span>
            <div
              className={`flex items-center gap-1 font-data-mono-sm text-data-mono-sm ${
                activeTicker.isBull ? 'text-secondary' : 'text-tertiary'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {activeTicker.isBull ? 'arrow_drop_up' : 'arrow_drop_down'}
              </span>
              <span className="font-semibold">
                {activeTicker.changeAbs >= 0 ? '+' : ''}
                {activeTicker.changeAbs.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span>
                ({activeTicker.changePct >= 0 ? '+' : ''}
                {activeTicker.changePct.toFixed(2)}%)
              </span>
            </div>
          </div>
          <span className="font-badge-mono text-badge-mono text-outline uppercase tracking-wider">
            INDEX: SPOT
          </span>
        </div>

        {/* 24h High/Low/Vol Multi-Metric Capsule */}
        <div className="grid grid-cols-3 gap-2 pt-1 pb-0.5 px-2 bg-surface-container rounded-lg">
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-outline uppercase">
              24H 高点
            </span>
            <span className="font-data-mono-sm text-data-mono-sm text-on-surface font-medium">
              {activeTicker.high24h}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-label-caps text-label-caps text-outline uppercase">
              24H 低点
            </span>
            <span className="font-data-mono-sm text-data-mono-sm text-on-surface font-medium">
              {activeTicker.low24h}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-label-caps text-label-caps text-outline uppercase">
              24H 成交量
            </span>
            <span className="font-data-mono-sm text-data-mono-sm text-primary font-medium">
              {activeTicker.vol24h}
            </span>
          </div>
        </div>
      </section>

      {/* High-Density Chart Controls: Timeframes & Technical Indicators Strip */}
      <div className="flex items-center justify-between px-space-md py-1 bg-surface-container-lowest gap-1 overflow-x-auto no-scrollbar relative">
        <div className="flex items-center gap-1 shrink-0">
          {(['15m', '1H', '4H', '1D', '1W'] as const).map((tf) => {
            const isAct = timeframe === tf;
            return (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 rounded font-data-mono-sm text-data-mono-sm transition-colors cursor-pointer ${
                  isAct
                    ? 'bg-primary-container text-on-primary-container font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                {tf}
              </button>
            );
          })}
          <button
            onClick={() => setShowFxMenu((v) => !v)}
            className="p-1 rounded text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              more_horiz
            </span>
          </button>
        </div>

        <div className="h-3 w-px bg-surface-container-highest shrink-0 mx-1"></div>

        {/* Active Indicators Badges with Quick Toggles */}
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setShowEma20((v) => !v)}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded font-badge-mono text-badge-mono transition-opacity cursor-pointer ${
              showEma20
                ? 'bg-surface-container text-primary opacity-100'
                : 'bg-surface-container/50 text-outline opacity-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
            <span>EMA(20)</span>
          </button>
          <button
            onClick={() => setShowEma50((v) => !v)}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded font-badge-mono text-badge-mono transition-opacity cursor-pointer ${
              showEma50
                ? 'bg-surface-container text-tertiary opacity-100'
                : 'bg-surface-container/50 text-outline opacity-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
            <span>EMA(50)</span>
          </button>
          <button
            onClick={() => setShowFxMenu((v) => !v)}
            className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-title-section text-title-section hover:bg-surface-container-highest transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px] text-primary">
              functions
            </span>
            <span className="font-data-mono-sm text-data-mono-sm">指标 (fx)</span>
          </button>
        </div>
      </div>

      {/* Indicator Settings Drawer if opened */}
      {showFxMenu && (
        <div className="px-space-md py-1.5 bg-surface-container flex items-center justify-between gap-2 text-data-mono-sm font-data-mono-sm">
          <span className="text-outline">图层开关:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEma20((v) => !v)}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                showEma20
                  ? 'bg-primary-container text-white'
                  : 'bg-surface-container-highest text-outline'
              }`}
            >
              EMA 20
            </button>
            <button
              onClick={() => setShowEma50((v) => !v)}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                showEma50
                  ? 'bg-tertiary-container text-white'
                  : 'bg-surface-container-highest text-outline'
              }`}
            >
              EMA 50
            </button>
            <button
              onClick={() => setShowLevels((v) => !v)}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                showLevels
                  ? 'bg-secondary-container text-white'
                  : 'bg-surface-container-highest text-outline'
              }`}
            >
              支撑/阻力带
            </button>
          </div>
        </div>
      )}

      {/* Interactive Terminal Chart Workstation Canvas */}
      <div
        className={`relative w-full ${
          isFullscreen ? 'h-[480px]' : 'h-[375px]'
        } bg-surface-container-lowest flex overflow-hidden transition-all`}
      >
        {/* Precision Drawing & Quantitative Geometry Sidebar */}
        <div className="w-10 bg-surface-container-low flex flex-col items-center py-2 gap-2 z-20 shrink-0 shadow-md">
          <button
            onClick={() => handleSelectTool('crosshair')}
            className={`w-7 h-7 rounded flex items-center justify-center transition-colors cursor-pointer ${
              activeTool === 'crosshair'
                ? 'text-primary bg-surface-container-highest'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
            }`}
            title="十字光标"
          >
            <span className="material-symbols-outlined text-[17px]">
              control_camera
            </span>
          </button>
          <button
            onClick={() => handleSelectTool('trendline')}
            className={`w-7 h-7 rounded flex items-center justify-center transition-colors cursor-pointer ${
              activeOverlays.includes('trendline')
                ? 'text-primary bg-surface-container-highest'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
            }`}
            title="趋势线"
          >
            <span className="material-symbols-outlined text-[17px]">
              timeline
            </span>
          </button>
          <button
            onClick={() => handleSelectTool('fib')}
            className={`w-7 h-7 rounded flex items-center justify-center transition-colors cursor-pointer ${
              activeOverlays.includes('fib')
                ? 'text-primary bg-surface-container-highest'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
            }`}
            title="斐波那契回撤"
          >
            <span className="material-symbols-outlined text-[17px]">
              reorder
            </span>
          </button>
          <button
            onClick={() => handleSelectTool('rr')}
            className={`w-7 h-7 rounded flex items-center justify-center transition-colors cursor-pointer ${
              activeOverlays.includes('rr')
                ? 'text-primary bg-surface-container-highest'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
            }`}
            title="多空盈亏比预测"
          >
            <span className="material-symbols-outlined text-[17px]">
              swap_vert
            </span>
          </button>
          <button
            onClick={() => setMagnetEnabled((m) => !m)}
            className={`w-7 h-7 rounded flex items-center justify-center transition-colors cursor-pointer ${
              magnetEnabled
                ? 'text-secondary bg-surface-container-highest/60'
                : 'text-on-surface-variant hover:bg-surface-container-highest'
            }`}
            title="磁铁吸附模式"
          >
            <span className="material-symbols-outlined text-[17px]">bolt</span>
          </button>
          <button
            onClick={() => handleSelectTool('ruler')}
            className={`w-7 h-7 rounded flex items-center justify-center transition-colors cursor-pointer ${
              activeOverlays.includes('ruler')
                ? 'text-primary bg-surface-container-highest'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
            }`}
            title="测量标尺"
          >
            <span className="material-symbols-outlined text-[17px]">
              straighten
            </span>
          </button>
          <div className="mt-auto">
            <button
              onClick={handleClearDrawings}
              className="w-7 h-7 rounded flex items-center justify-center text-on-surface-variant hover:text-error transition-colors cursor-pointer"
              title="清除画线"
            >
              <span className="material-symbols-outlined text-[17px]">
                delete_sweep
              </span>
            </button>
          </div>
        </div>

        {/* Main Dynamic SVG Chart Stage */}
        <div className="relative flex-1 h-full overflow-hidden flex flex-col justify-between">
          {/* Realtime Candlestick OHLC HUD Float */}
          <div className="absolute top-2 left-2 z-10 flex flex-wrap items-center gap-x-2 gap-y-0.5 px-2 py-1 rounded bg-surface/85 backdrop-blur-md font-badge-mono text-badge-mono text-outline pointer-events-none">
            <span className="text-on-surface font-semibold">
              {activeTicker.symbol}
            </span>
            <span>
              O:
              <span className="text-on-surface ml-0.5">
                {hoveredCandleIdx === 15 && activeTicker.symbol === 'BTCUSDT'
                  ? '67,120.00'
                  : activeCandle.priceOpen}
              </span>
            </span>
            <span>
              H:
              <span className="text-secondary ml-0.5">
                {hoveredCandleIdx === 15 && activeTicker.symbol === 'BTCUSDT'
                  ? '67,950.00'
                  : activeCandle.priceHigh}
              </span>
            </span>
            <span>
              L:
              <span className="text-tertiary ml-0.5">
                {hoveredCandleIdx === 15 && activeTicker.symbol === 'BTCUSDT'
                  ? '67,050.00'
                  : activeCandle.priceLow}
              </span>
            </span>
            <span>
              C:
              <span className="text-secondary ml-0.5 font-bold">
                {hoveredCandleIdx === 15
                  ? activeTicker.price.toLocaleString('en-US', {
                      minimumFractionDigits: activeTicker.decimals,
                      maximumFractionDigits: activeTicker.decimals,
                    })
                  : activeCandle.priceClose}
              </span>
            </span>
            <span className="text-secondary">+722.50 (+1.08%)</span>
          </div>

          {/* Native Ultra-Fidelity SVG Render Engine (Candlesticks, EMAs, Support & Resistance) */}
          <svg
            onMouseMove={handleChartPointerMove}
            onMouseLeave={() => setHoveredCandleIdx(15)}
            className="w-full h-[275px] block overflow-visible cursor-crosshair"
            preserveAspectRatio="none"
            viewBox="0 0 320 275"
          >
            <defs>
              <linearGradient id="bull-glow" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#66dabf" stopOpacity="0.25"></stop>
                <stop offset="100%" stopColor="#66dabf" stopOpacity="0.0"></stop>
              </linearGradient>
              <linearGradient id="bear-glow" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#da2237" stopOpacity="0.2"></stop>
                <stop offset="100%" stopColor="#da2237" stopOpacity="0.0"></stop>
              </linearGradient>
              <pattern
                height="35"
                id="grid"
                patternUnits="userSpaceOnUse"
                width="40"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#262a35"
                  strokeDasharray="2,2"
                  strokeWidth="0.75"
                ></path>
              </pattern>
            </defs>

            {/* Technical Background Grid */}
            <rect fill="url(#grid)" height="100%" width="100%"></rect>

            {/* Key Resistance & Support Zones */}
            {showLevels && (
              <>
                <g id="resistance-level">
                  <line
                    opacity="0.85"
                    stroke="#da2237"
                    strokeDasharray="4,4"
                    strokeWidth="1.2"
                    x1="0"
                    x2="320"
                    y1="52"
                    y2="52"
                  ></line>
                  <rect
                    fill="#da2237"
                    height="15"
                    rx="2"
                    width="78"
                    x="238"
                    y="44"
                  ></rect>
                  <text
                    fill="#ffffff"
                    fontFamily="JetBrains Mono"
                    fontSize="8.5"
                    fontWeight="700"
                    x="242"
                    y="55"
                  >
                    {activeTicker.resLevel}
                  </text>
                </g>

                <g id="support-level">
                  <line
                    opacity="0.85"
                    stroke="#20a28a"
                    strokeDasharray="4,4"
                    strokeWidth="1.2"
                    x1="0"
                    x2="320"
                    y1="218"
                    y2="218"
                  ></line>
                  <rect
                    fill="#20a28a"
                    height="15"
                    rx="2"
                    width="78"
                    x="238"
                    y="210"
                  ></rect>
                  <text
                    fill="#ffffff"
                    fontFamily="JetBrains Mono"
                    fontSize="8.5"
                    fontWeight="700"
                    x="242"
                    y="221"
                  >
                    {activeTicker.supLevel}
                  </text>
                </g>
              </>
            )}

            {/* Interactive Quantitative Overlays when user clicks left toolbar */}
            {activeOverlays.includes('fib') && (
              <g opacity="0.75">
                <line
                  x1="30"
                  y1="80"
                  x2="295"
                  y2="80"
                  stroke="#b6c4ff"
                  strokeDasharray="2,2"
                  strokeWidth="0.9"
                />
                <text
                  x="34"
                  y="77"
                  fill="#b6c4ff"
                  fontFamily="JetBrains Mono"
                  fontSize="7.5"
                >
                  FIB 0.236
                </text>
                <line
                  x1="30"
                  y1="115"
                  x2="295"
                  y2="115"
                  stroke="#66dabf"
                  strokeDasharray="2,2"
                  strokeWidth="0.9"
                />
                <text
                  x="34"
                  y="112"
                  fill="#66dabf"
                  fontFamily="JetBrains Mono"
                  fontSize="7.5"
                >
                  FIB 0.500 (GOLDEN)
                </text>
                <line
                  x1="30"
                  y1="150"
                  x2="295"
                  y2="150"
                  stroke="#ffb3b0"
                  strokeDasharray="2,2"
                  strokeWidth="0.9"
                />
                <text
                  x="34"
                  y="147"
                  fill="#ffb3b0"
                  fontFamily="JetBrains Mono"
                  fontSize="7.5"
                >
                  FIB 0.618
                </text>
              </g>
            )}

            {activeOverlays.includes('trendline') && (
              <g>
                <line
                  x1="20"
                  y1="192"
                  x2="295"
                  y2="68"
                  stroke="#66dabf"
                  strokeWidth="1.5"
                />
                <circle cx="20" cy="192" r="3" fill="#66dabf" />
                <circle cx="295" cy="68" r="3" fill="#66dabf" />
              </g>
            )}

            {activeOverlays.includes('rr') && (
              <g opacity="0.85">
                <rect
                  x="195"
                  y="22"
                  width="98"
                  height="36"
                  fill="#20a28a"
                  fillOpacity="0.22"
                  stroke="#20a28a"
                  strokeWidth="0.8"
                />
                <rect
                  x="195"
                  y="58"
                  width="98"
                  height="22"
                  fill="#da2237"
                  fillOpacity="0.22"
                  stroke="#da2237"
                  strokeWidth="0.8"
                />
                <text
                  x="200"
                  y="34"
                  fill="#66dabf"
                  fontFamily="JetBrains Mono"
                  fontSize="7.5"
                  fontWeight="700"
                >
                  TP +3.2% (R:R 2.4)
                </text>
              </g>
            )}

            {activeOverlays.includes('ruler') && (
              <g>
                <rect
                  x="110"
                  y="48"
                  width="180"
                  height="98"
                  fill="#2962ff"
                  fillOpacity="0.12"
                  stroke="#2962ff"
                  strokeDasharray="3,3"
                  strokeWidth="1"
                />
                <text
                  x="155"
                  y="96"
                  fill="#b6c4ff"
                  fontFamily="JetBrains Mono"
                  fontSize="8.5"
                  fontWeight="700"
                >
                  +$1,722.50 (+2.60%) · 10 Bars
                </text>
              </g>
            )}

            {/* EMA 50 Curve (Warm Orange Trendline) */}
            {showEma50 && (
              <path
                d="M 10 195 C 40 185, 70 175, 100 162 C 140 148, 175 142, 210 128 C 245 116, 280 102, 310 92"
                fill="none"
                opacity="0.85"
                stroke="#ffb3b0"
                strokeLinecap="round"
                strokeWidth="1.6"
              ></path>
            )}

            {/* EMA 20 Curve (Aggressive Primary Blue Trendline) */}
            {showEma20 && (
              <path
                d="M 10 180 C 45 160, 80 152, 110 135 C 150 115, 180 118, 220 95 C 255 78, 285 70, 310 64"
                fill="none"
                stroke="#2962ff"
                strokeLinecap="round"
                strokeWidth="1.8"
              ></path>
            )}

            {/* Candlesticks Array (Exact coordinates matching reference HTML) */}
            {/* Candle 1: Red */}
            <line stroke="#da2237" strokeWidth="1" x1="20" x2="20" y1="165" y2="198"></line>
            <rect fill="#da2237" height="18" rx="0.5" width="8" x="16" y="172"></rect>
            {/* Candle 2: Green */}
            <line stroke="#20a28a" strokeWidth="1" x1="38" x2="38" y1="160" y2="190"></line>
            <rect fill="#20a28a" height="16" rx="0.5" width="8" x="34" y="166"></rect>
            {/* Candle 3: Green */}
            <line stroke="#20a28a" strokeWidth="1" x1="56" x2="56" y1="148" y2="175"></line>
            <rect fill="#20a28a" height="18" rx="0.5" width="8" x="52" y="152"></rect>
            {/* Candle 4: Red Pullback */}
            <line stroke="#da2237" strokeWidth="1" x1="74" x2="74" y1="145" y2="172"></line>
            <rect fill="#da2237" height="14" rx="0.5" width="8" x="70" y="150"></rect>
            {/* Candle 5: Doji indecision */}
            <line stroke="#dfe2f2" strokeWidth="1" x1="92" x2="92" y1="135" y2="162"></line>
            <rect fill="#dfe2f2" height="3" rx="0.5" width="8" x="88" y="146"></rect>
            {/* Candle 6: Strong Bullish Impulse */}
            <line stroke="#20a28a" strokeWidth="1" x1="110" x2="110" y1="118" y2="152"></line>
            <rect fill="#20a28a" height="26" rx="0.5" width="8" x="106" y="122"></rect>
            {/* Candle 7: Continuation Green */}
            <line stroke="#20a28a" strokeWidth="1" x1="128" x2="128" y1="110" y2="138"></line>
            <rect fill="#20a28a" height="18" rx="0.5" width="8" x="124" y="114"></rect>
            {/* Candle 8: Healthy Consolidation Red */}
            <line stroke="#da2237" strokeWidth="1" x1="146" x2="146" y1="112" y2="135"></line>
            <rect fill="#da2237" height="12" rx="0.5" width="8" x="142" y="116"></rect>
            {/* Candle 9: Red Wick Rejection */}
            <line stroke="#da2237" strokeWidth="1" x1="164" x2="164" y1="105" y2="136"></line>
            <rect fill="#da2237" height="12" rx="0.5" width="8" x="160" y="118"></rect>
            {/* Candle 10: Bullish Hammer */}
            <line stroke="#20a28a" strokeWidth="1" x1="182" x2="182" y1="95" y2="132"></line>
            <rect fill="#20a28a" height="14" rx="0.5" width="8" x="178" y="98"></rect>
            {/* Candle 11: Breakout Green */}
            <line stroke="#20a28a" strokeWidth="1" x1="200" x2="200" y1="80" y2="108"></line>
            <rect fill="#20a28a" height="20" rx="0.5" width="8" x="196" y="84"></rect>
            {/* Candle 12: High Wick Test Red */}
            <line stroke="#da2237" strokeWidth="1" x1="218" x2="218" y1="70" y2="102"></line>
            <rect fill="#da2237" height="16" rx="0.5" width="8" x="214" y="78"></rect>
            {/* Candle 13: Consolidation Inside Bar */}
            <line stroke="#20a28a" strokeWidth="1" x1="236" x2="236" y1="72" y2="96"></line>
            <rect fill="#20a28a" height="12" rx="0.5" width="8" x="232" y="76"></rect>
            {/* Candle 14: Strong Bullish Push */}
            <line stroke="#20a28a" strokeWidth="1" x1="254" x2="254" y1="58" y2="86"></line>
            <rect fill="#20a28a" height="19" rx="0.5" width="8" x="250" y="62"></rect>
            {/* Candle 15: Small Red Dipper */}
            <line stroke="#da2237" strokeWidth="1" x1="272" x2="272" y1="56" y2="78"></line>
            <rect fill="#da2237" height="10" rx="0.5" width="8" x="268" y="60"></rect>
            {/* Candle 16 (Current Active Realtime Tick): Green Marubozu Surge */}
            <line stroke="#20a28a" strokeWidth="1" x1="290" x2="290" y1="46" y2="72"></line>
            <rect
              className="animate-pulse"
              fill="#20a28a"
              height="20"
              rx="0.5"
              width="8"
              x="286"
              y="48"
            ></rect>

            {/* Interactive Crosshair Intersection Point */}
            <g id="crosshair-system">
              <line
                opacity="0.6"
                stroke="#8d90a2"
                strokeDasharray="2,2"
                strokeWidth="0.8"
                x1="0"
                x2="320"
                y1={hoveredCandleIdx === 15 ? 58 : activeCandle.close}
                y2={hoveredCandleIdx === 15 ? 58 : activeCandle.close}
              ></line>
              <line
                opacity="0.6"
                stroke="#8d90a2"
                strokeDasharray="2,2"
                strokeWidth="0.8"
                x1={activeCandle.x}
                x2={activeCandle.x}
                y1="0"
                y2="275"
              ></line>
              {/* Precise Marker Pulsing Ring */}
              <circle
                cx={activeCandle.x}
                cy={hoveredCandleIdx === 15 ? 58 : activeCandle.close}
                fill="#2962ff"
                r="4"
                stroke="#ffffff"
                strokeWidth="1.5"
              ></circle>
              <circle
                className="animate-ping"
                cx={activeCandle.x}
                cy={hoveredCandleIdx === 15 ? 58 : activeCandle.close}
                fill="#2962ff"
                opacity="0.25"
                r="8"
              ></circle>
            </g>
          </svg>

          {/* Persistent Right-Hand Tactical Price Scale */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-surface-container-low/90 flex flex-col justify-between py-2 text-right pr-1 pointer-events-none">
            <span className="font-data-mono-sm text-data-mono-sm text-outline">
              {activeTicker.scaleLabels[0]}
            </span>
            <span className="font-data-mono-sm text-data-mono-sm text-tertiary font-semibold">
              {activeTicker.scaleLabels[1]}
            </span>
            {/* Current Tick Price Badge */}
            <div className="bg-secondary px-1 py-0.5 rounded shadow-sm text-on-secondary font-bold font-data-mono-sm text-data-mono-sm inline-block self-end mr-0.5 animate-pulse">
              {activeTicker.symbol === 'BTCUSDT'
                ? Math.round(activeTicker.price).toLocaleString('en-US')
                : activeTicker.price.toFixed(
                    activeTicker.decimals > 2 ? 3 : 2
                  )}
            </div>
            <span className="font-data-mono-sm text-data-mono-sm text-outline">
              {activeTicker.scaleLabels[2]}
            </span>
            <span className="font-data-mono-sm text-data-mono-sm text-outline">
              {activeTicker.scaleLabels[3]}
            </span>
            <span className="font-data-mono-sm text-data-mono-sm text-secondary font-semibold">
              {activeTicker.scaleLabels[4]}
            </span>
            <span className="font-data-mono-sm text-data-mono-sm text-outline">
              {activeTicker.scaleLabels[5]}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Chart Analytical Panes: Realtime Volume & Oscillating RSI (14) */}
      <div className="w-full bg-surface-container-lowest grid grid-cols-1 gap-1 px-space-md py-1.5">
        {/* Volume Pane with Buy/Sell Depth Color Distinctions */}
        <div className="h-16 flex flex-col justify-between bg-surface-container-low rounded p-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-outline">
            <span className="font-badge-mono text-badge-mono uppercase font-bold text-on-surface-variant flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>{' '}
              VOL (20):{' '}
              <span className="text-secondary font-mono">1.84K BTC</span>
            </span>
            <span className="font-data-mono-sm text-data-mono-sm text-outline">
              SMA 9: 1.22K
            </span>
          </div>
          {/* Normalized Volume Histogram Bars */}
          <div className="h-9 w-full flex items-end justify-between gap-1 pt-1">
            <div className="w-2.5 bg-tertiary-container/80 rounded-t-xs h-[45%]"></div>
            <div className="w-2.5 bg-secondary-container/80 rounded-t-xs h-[60%]"></div>
            <div className="w-2.5 bg-secondary-container/80 rounded-t-xs h-[75%]"></div>
            <div className="w-2.5 bg-tertiary-container/80 rounded-t-xs h-[30%]"></div>
            <div className="w-2.5 bg-outline-variant/60 rounded-t-xs h-[15%]"></div>
            <div className="w-2.5 bg-secondary-container/80 rounded-t-xs h-[95%]"></div>
            <div className="w-2.5 bg-secondary-container/80 rounded-t-xs h-[80%]"></div>
            <div className="w-2.5 bg-tertiary-container/80 rounded-t-xs h-[40%]"></div>
            <div className="w-2.5 bg-tertiary-container/80 rounded-t-xs h-[35%]"></div>
            <div className="w-2.5 bg-secondary-container/80 rounded-t-xs h-[65%]"></div>
            <div className="w-2.5 bg-secondary-container/80 rounded-t-xs h-[85%]"></div>
            <div className="w-2.5 bg-tertiary-container/80 rounded-t-xs h-[50%]"></div>
            <div className="w-2.5 bg-secondary-container/80 rounded-t-xs h-[60%]"></div>
            <div className="w-2.5 bg-secondary-container/80 rounded-t-xs h-[90%]"></div>
            <div className="w-2.5 bg-tertiary-container/80 rounded-t-xs h-[25%]"></div>
            <div className="w-2.5 bg-secondary-container rounded-t-xs h-[85%] shadow-[0_0_8px_rgba(32,162,138,0.5)]"></div>
          </div>
        </div>

        {/* RSI Sub-Pane with Threshold Zones (70 Overbought, 30 Oversold) */}
        <div className="h-16 flex flex-col justify-between bg-surface-container-low rounded p-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-outline">
            <span className="font-badge-mono text-badge-mono uppercase font-bold text-on-surface-variant flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> RSI
              (14):{' '}
              <span className="text-primary font-mono font-bold">
                {activeTicker.rsi.toFixed(2)}
              </span>
            </span>
            <span className="font-badge-mono text-badge-mono px-1 rounded bg-secondary-container/20 text-secondary uppercase font-semibold">
              {activeTicker.rsiStatus}
            </span>
          </div>
          {/* RSI Sparkline Track with Dynamic Upper/Lower Threshold Reference */}
          <div className="h-8 w-full relative flex items-center">
            <div className="absolute top-1 left-0 right-0 h-px bg-surface-container-highest"></div>
            <div className="absolute bottom-1 left-0 right-0 h-px bg-surface-container-highest"></div>
            <svg
              className="w-full h-full block"
              preserveAspectRatio="none"
              viewBox="0 0 280 32"
            >
              <rect
                fill="#262a35"
                height="22"
                opacity="0.3"
                width="280"
                x="0"
                y="5"
              ></rect>
              <path
                d="M 0 24 Q 25 26, 50 18 T 100 12 T 150 20 T 200 15 T 250 8 L 280 10"
                fill="none"
                stroke="#b6c4ff"
                strokeLinecap="round"
                strokeWidth="1.8"
              ></path>
              <circle cx="280" cy="10" fill="#2962ff" r="2.5"></circle>
            </svg>
          </div>
        </div>
      </div>

      {/* Terminal Order Flow Quick Blotter & Market Sentiment Snapshot */}
      <section className="mx-space-md my-1.5 p-2 rounded-xl bg-surface-container flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[18px]">speed</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-outline uppercase">
              实时多空挂单比 (OB Imbalance)
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-data-mono-sm text-data-mono-sm text-secondary font-bold">
                买盘 {activeTicker.buyRatio.toFixed(1)}%
              </span>
              <span className="text-outline text-body-compact">/</span>
              <span className="font-data-mono-sm text-data-mono-sm text-tertiary">
                卖盘 {(100 - activeTicker.buyRatio).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        <div className="w-24 h-2 bg-surface-container-highest rounded-full overflow-hidden flex">
          <div
            className="bg-secondary-container h-full transition-all"
            style={{ width: `${Math.round(activeTicker.buyRatio)}%` }}
          ></div>
          <div
            className="bg-tertiary-container h-full transition-all"
            style={{ width: `${100 - Math.round(activeTicker.buyRatio)}%` }}
          ></div>
        </div>
      </section>

      {/* Bottom Fast-Action Dock: Institutional Quick Execution & Community Collaboration */}
      <section className="mt-1 px-space-md grid grid-cols-2 gap-space-sm">
        {/* Quick Buy / Long Button */}
        <button
          onClick={() => setOrderModalSide('LONG')}
          className="h-11 px-3 rounded-lg bg-secondary-container active:scale-[0.98] transition-all flex items-center justify-between text-on-secondary shadow-md hover:bg-secondary cursor-pointer"
        >
          <div className="flex flex-col text-left">
            <span className="font-label-caps text-label-caps tracking-wider uppercase font-bold text-on-secondary/80">
              快速做多 (BUY)
            </span>
            <span className="font-data-mono-md text-data-mono-md font-bold text-white">
              {formatPrice(buyPriceNum)}
            </span>
          </div>
          <span className="material-symbols-outlined text-[20px] text-white">
            north_east
          </span>
        </button>

        {/* Quick Sell / Short Button */}
        <button
          onClick={() => setOrderModalSide('SHORT')}
          className="h-11 px-3 rounded-lg bg-tertiary-container active:scale-[0.98] transition-all flex items-center justify-between text-on-tertiary-container shadow-md hover:bg-tertiary-container/90 cursor-pointer"
        >
          <div className="flex flex-col text-left">
            <span className="font-label-caps text-label-caps tracking-wider uppercase font-bold text-white/80">
              快速做空 (SELL)
            </span>
            <span className="font-data-mono-md text-data-mono-md font-bold text-white">
              {formatPrice(sellPriceNum)}
            </span>
          </div>
          <span className="material-symbols-outlined text-[20px] text-white">
            south_east
          </span>
        </button>
      </section>

      {/* Secondary Tactical Bar: Add Alert & Publish Trading Idea */}
      <div className="px-space-md pt-2 grid grid-cols-2 gap-space-sm mb-1">
        <button
          onClick={() => {
            setAlertPrice(
              (activeTicker.price * 1.015).toFixed(activeTicker.decimals)
            );
            setShowAlertModal(true);
          }}
          className="h-8 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">
            add_alert
          </span>
          <span className="font-title-section text-title-section">
            添加价格警报
          </span>
        </button>
        <button
          onClick={() => {
            setIdeaTitle(
              `${activeTicker.displaySymbol} ${timeframe}级别关键结构推演`
            );
            setIdeaTarget(
              formatPrice(activeTicker.price * 1.035)
            );
            setIdeaStop(
              formatPrice(activeTicker.price * 0.982)
            );
            setShowIdeaModal(true);
          }}
          className="h-8 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-secondary">
            edit_note
          </span>
          <span className="font-title-section text-title-section">
            发布分析观点
          </span>
        </button>
      </div>

      {/* Subtle Ambient Execution Status Chip */}
      <div className="px-space-md py-1 flex items-center justify-between font-badge-mono text-badge-mono text-outline">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          WS: 12ms · 实时深度已同步
        </span>
        <button
          onClick={cycleLeverage}
          className="hover:text-on-surface transition-colors cursor-pointer"
          title="点击切换全仓杠杆倍数"
        >
          LEVERAGE: CROSS {leverage}X
        </button>
      </div>

      {/* Quick Order Execution Modal */}
      {orderModalSide && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setOrderModalSide(null)}
        >
          <div
            className="w-full max-w-md bg-surface-container-high rounded-t-2xl sm:rounded-2xl p-4 shadow-2xl flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded font-badge-mono text-badge-mono font-bold ${
                    orderModalSide === 'LONG'
                      ? 'bg-secondary-container text-white'
                      : 'bg-tertiary-container text-white'
                  }`}
                >
                  {orderModalSide === 'LONG' ? '做多 LONG' : '做空 SHORT'}
                </span>
                <span className="font-headline-panel text-headline-panel text-on-surface font-bold">
                  {activeTicker.displaySymbol} 闪电委托
                </span>
              </div>
              <button
                onClick={() => setOrderModalSide(null)}
                className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-surface-container rounded-lg p-2.5 font-data-mono-sm text-data-mono-sm">
              <div className="flex flex-col">
                <span className="text-outline">执行市价</span>
                <span className="font-data-mono-lg text-data-mono-lg text-on-surface font-bold mt-0.5">
                  {formatPrice(
                    orderModalSide === 'LONG' ? buyPriceNum : sellPriceNum
                  )}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-outline">全仓杠杆</span>
                <button
                  onClick={cycleLeverage}
                  className="font-data-mono-lg text-data-mono-lg text-primary font-bold mt-0.5"
                >
                  CROSS {leverage}X
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-caps text-label-caps text-on-surface-variant">
                委托名义仓位价值 (USDT)
              </label>
              <input
                type="number"
                value={orderSizeUsd}
                onChange={(e) => setOrderSizeUsd(e.target.value)}
                className="h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-data-mono-md text-data-mono-md outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="flex items-center gap-1.5 pt-1">
                {['5000', '10000', '25000', '50000'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setOrderSizeUsd(preset)}
                    className="px-2 py-1 rounded bg-surface-container text-on-surface-variant hover:text-on-surface font-badge-mono text-badge-mono cursor-pointer"
                  >
                    ${Number(preset).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onExecuteOrder({
                  symbol: activeTicker.displaySymbol,
                  side: orderModalSide,
                  leverage,
                  entryPrice:
                    orderModalSide === 'LONG' ? buyPriceNum : sellPriceNum,
                  sizeUsd: Number(orderSizeUsd) || 10000,
                });
                setOrderModalSide(null);
                triggerToast(
                  `已成交: ${activeTicker.displaySymbol} ${
                    orderModalSide === 'LONG' ? '做多' : '做空'
                  } $${Number(orderSizeUsd).toLocaleString()}`
                );
              }}
              className={`h-11 rounded-xl font-title-section text-title-section text-white font-bold shadow-lg cursor-pointer ${
                orderModalSide === 'LONG'
                  ? 'bg-secondary-container hover:bg-secondary'
                  : 'bg-tertiary-container hover:bg-tertiary-container/90'
              }`}
            >
              确认闪电下单 ({orderModalSide === 'LONG' ? '买入做多' : '卖出做空'})
            </button>
          </div>
        </div>
      )}

      {/* Add Price Alert Modal */}
      {showAlertModal && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowAlertModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface-container-high rounded-t-2xl sm:rounded-2xl p-4 shadow-2xl flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  add_alert
                </span>
                <span className="font-headline-panel text-headline-panel text-on-surface font-bold">
                  添加价格警报 · {activeTicker.displaySymbol}
                </span>
              </div>
              <button
                onClick={() => setShowAlertModal(false)}
                className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setAlertCondition('above')}
                className={`h-9 rounded-lg font-title-section text-title-section cursor-pointer ${
                  alertCondition === 'above'
                    ? 'bg-secondary-container text-white'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                高于目标价 (上穿)
              </button>
              <button
                onClick={() => setAlertCondition('below')}
                className={`h-9 rounded-lg font-title-section text-title-section cursor-pointer ${
                  alertCondition === 'below'
                    ? 'bg-tertiary-container text-white'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                低于目标价 (下穿)
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-caps text-label-caps text-on-surface-variant">
                触发价格 ({activeTicker.prefix || 'USD'})
              </label>
              <input
                type="text"
                value={alertPrice}
                onChange={(e) => setAlertPrice(e.target.value)}
                className="h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-data-mono-md text-data-mono-md outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-caps text-label-caps text-on-surface-variant">
                警报备注
              </label>
              <input
                type="text"
                value={alertNote}
                onChange={(e) => setAlertNote(e.target.value)}
                className="h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-default text-body-default outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              onClick={() => {
                onAddAlert({
                  symbol: activeTicker.displaySymbol,
                  condition: alertCondition,
                  targetPrice: `${activeTicker.prefix}${alertPrice}`,
                  note: alertNote || '价格异动预警',
                  active: true,
                });
                setShowAlertModal(false);
                triggerToast(
                  `已创建 ${activeTicker.displaySymbol} 价格警报`
                );
              }}
              className="h-10 rounded-xl bg-primary-container text-on-primary-container font-title-section text-title-section font-semibold shadow-md cursor-pointer"
            >
              保存价格警报
            </button>
          </div>
        </div>
      )}

      {/* Publish Trading Idea Modal */}
      {showIdeaModal && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowIdeaModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface-container-high rounded-t-2xl sm:rounded-2xl p-4 shadow-2xl flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">
                  edit_note
                </span>
                <span className="font-headline-panel text-headline-panel text-on-surface font-bold">
                  发布分析观点 · {activeTicker.displaySymbol}
                </span>
              </div>
              <button
                onClick={() => setShowIdeaModal(false)}
                className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIdeaDirection('BULLISH')}
                className={`h-9 rounded-lg font-title-section text-title-section cursor-pointer ${
                  ideaDirection === 'BULLISH'
                    ? 'bg-secondary-container text-white'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                看涨做多 (BULLISH)
              </button>
              <button
                onClick={() => setIdeaDirection('BEARISH')}
                className={`h-9 rounded-lg font-title-section text-title-section cursor-pointer ${
                  ideaDirection === 'BEARISH'
                    ? 'bg-tertiary-container text-white'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                看跌做空 (BEARISH)
              </button>
            </div>

            <input
              type="text"
              placeholder="输入交易观点标题..."
              value={ideaTitle}
              onChange={(e) => setIdeaTitle(e.target.value)}
              className="h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-default text-body-default outline-none focus:ring-1 focus:ring-primary"
            />

            <textarea
              rows={3}
              placeholder="阐述核心技术面结构、订单流依据与止盈止损逻辑..."
              value={ideaSummary}
              onChange={(e) => setIdeaSummary(e.target.value)}
              className="p-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-default text-body-default outline-none focus:ring-1 focus:ring-primary resize-none"
            />

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-outline">
                  目标止盈位 (TP)
                </span>
                <input
                  type="text"
                  value={ideaTarget}
                  onChange={(e) => setIdeaTarget(e.target.value)}
                  className="h-9 px-2.5 rounded bg-surface-container-lowest text-secondary font-data-mono-sm text-data-mono-sm outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-outline">
                  防守止损位 (SL)
                </span>
                <input
                  type="text"
                  value={ideaStop}
                  onChange={(e) => setIdeaStop(e.target.value)}
                  className="h-9 px-2.5 rounded bg-surface-container-lowest text-tertiary font-data-mono-sm text-data-mono-sm outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => {
                onPublishIdea({
                  author: 'QuantTrader_VIP',
                  authorRole: '量化终端交易员',
                  symbol: activeTicker.displaySymbol,
                  timeframe,
                  direction: ideaDirection,
                  title:
                    ideaTitle ||
                    `${activeTicker.displaySymbol} ${timeframe}级别突破跟进策略`,
                  summary:
                    ideaSummary ||
                    '基于EMA20动态趋势线与盘口多空挂单比共振，顺势博弈波段扩张行情。',
                  entryPrice: formatPrice(activeTicker.price),
                  targetPrice: ideaTarget || formatPrice(activeTicker.price * 1.03),
                  stopLoss: ideaStop || formatPrice(activeTicker.price * 0.98),
                  rrRatio: '1 : 2.35',
                  tags: ['终端实盘', `${timeframe}结构`, '量化信号'],
                });
                setShowIdeaModal(false);
                setIdeaSummary('');
                triggerToast('分析观点已发布至【观点】社区');
              }}
              className="h-10 rounded-xl bg-primary-container text-on-primary-container font-title-section text-title-section font-semibold shadow-md cursor-pointer"
            >
              立即发布观点
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
