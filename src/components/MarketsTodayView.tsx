import React, { useState, useEffect } from 'react';
import {
  AssetCategory,
  TickerAsset,
  TOP_INDICES,
  SECTOR_DETAILS,
} from '../data/marketData';

interface MarketsTodayViewProps {
  tickers: TickerAsset[];
  flashingSymbols: Record<string, 'up' | 'down' | undefined>;
  onSelectSymbol: (symbol: string) => void;
  onNavigateTab: (tab: 'news-and-events' | 'interactive-chart') => void;
}

export const MarketsTodayView: React.FC<MarketsTodayViewProps> = ({
  tickers,
  flashingSymbols,
  onSelectSymbol,
  onNavigateTab,
}) => {
  const [activeCategory, setActiveCategory] = useState<AssetCategory>('all');
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [nfpSeconds, setNfpSeconds] = useState(3 * 3600 + 42 * 60 + 15);
  const [fomcSeconds, setFomcSeconds] = useState(6 * 3600 + 15 * 60);
  const [ecbSeconds, setEcbSeconds] = useState(9 * 3600);

  useEffect(() => {
    const timer = setInterval(() => {
      setNfpSeconds((s) => (s > 0 ? s - 1 : 0));
      setFomcSeconds((s) => (s > 0 ? s - 1 : 0));
      setEcbSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
  };

  // Default 5 core rows matching the reference screenshot when 'all' is selected,
  // or filtered by category when a specific tab is clicked
  const displayedTickers =
    activeCategory === 'all'
      ? tickers.filter((t) =>
          ['NVDA', 'AAPL', 'TSLA', 'SOLUSD', 'EURUSD'].includes(t.symbol)
        )
      : tickers.filter((t) => t.category === activeCategory);

  const selectedSector = SECTOR_DETAILS.find((s) => s.id === selectedSectorId);

  const formatPrice = (t: TickerAsset) => {
    if (t.decimals === 5) {
      return `${t.prefix}${t.price.toFixed(5)}${t.suffix || ''}`;
    }
    if (t.decimals === 3) {
      return `${t.prefix}${t.price.toFixed(3)}${t.suffix || ''}`;
    }
    return `${t.prefix}${t.price.toLocaleString('en-US', {
      minimumFractionDigits: t.decimals,
      maximumFractionDigits: t.decimals,
    })}${t.suffix || ''}`;
  };

  const formatChangeAbs = (t: TickerAsset) => {
    const sign = t.changeAbs >= 0 ? '+' : '-';
    const absVal = Math.abs(t.changeAbs);
    if (t.decimals === 5) {
      return `${sign}${absVal.toFixed(4)}`;
    }
    if (t.decimals === 3) {
      return `${sign}${absVal.toFixed(3)}`;
    }
    return `${sign}${t.prefix}${absVal.toFixed(2)}`;
  };

  return (
    <div className="flex flex-col w-full gap-y-space-md p-space-md pb-6 select-none">
      {/* 1. Market Sentiment Pulse & Marquee Tickers */}
      <div className="w-full flex flex-col gap-y-space-sm bg-surface-container-low rounded-xl p-space-md shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="w-2 h-2 rounded-full bg-secondary animate-ping"></div>
            <span className="font-title-section text-title-section text-on-surface">
              全球宏观脉搏
            </span>
            <span className="bg-surface-container-high text-secondary font-badge-mono text-badge-mono px-space-xs py-0.5 rounded">
              实时同步
            </span>
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-1 rounded">
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              情绪指数
            </span>
            <span className="font-data-mono-sm text-data-mono-sm text-secondary font-semibold">
              贪婪 68
            </span>
            <span className="font-badge-mono text-badge-mono text-outline">
              /100
            </span>
          </div>
        </div>

        {/* Sentiment Meter Bar */}
        <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden flex">
          <div className="h-full bg-tertiary-container w-[15%]"></div>
          <div className="h-full bg-error-container w-[15%]"></div>
          <div className="h-full bg-outline-variant w-[20%]"></div>
          <div className="h-full bg-secondary-container w-[35%]"></div>
          <div className="h-full bg-secondary w-[15%]"></div>
        </div>

        {/* Top Index Horizontal Scroller */}
        <div className="flex items-center gap-space-sm overflow-x-auto no-scrollbar pt-space-xs -mx-space-xs px-space-xs">
          {TOP_INDICES.map((idx) => {
            const liveTicker = tickers.find((t) => t.symbol === idx.symbol);
            const displayVal = liveTicker
              ? liveTicker.price.toLocaleString('en-US', {
                  minimumFractionDigits: idx.decimals,
                  maximumFractionDigits: idx.decimals,
                }) + (idx.suffix || '')
              : idx.price.toLocaleString('en-US', {
                  minimumFractionDigits: idx.decimals,
                  maximumFractionDigits: idx.decimals,
                }) + (idx.suffix || '');

            return (
              <div
                key={idx.symbol}
                onClick={() => onSelectSymbol(idx.symbol)}
                className="min-w-[155px] bg-surface-container rounded-lg p-space-sm flex flex-col justify-between shadow-sm cursor-pointer active:scale-95 transition-transform hover:bg-surface-container-high"
              >
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">
                    {idx.name}
                  </span>
                  <span
                    className={`font-badge-mono text-badge-mono ${
                      idx.isBull ? 'text-secondary' : 'text-tertiary'
                    }`}
                  >
                    {idx.changePct}
                  </span>
                </div>
                <div className="flex items-end justify-between mt-1">
                  <span className="font-data-mono-md text-data-mono-md text-on-surface">
                    {displayVal}
                  </span>
                  <svg
                    className={`w-12 h-5 ${
                      idx.isBull ? 'text-secondary' : 'text-tertiary'
                    }`}
                    fill="none"
                    viewBox="0 0 48 20"
                  >
                    <path
                      d={idx.sparkline}
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="1.5"
                    ></path>
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Asset Category Filter Chips */}
      <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar py-0.5">
        {(
          [
            { id: 'all', label: '全部标的' },
            { id: 'indices', label: '股指期货' },
            { id: 'crypto', label: '加密资产' },
            { id: 'forex', label: '外汇汇率' },
            { id: 'commodities', label: '大宗商品' },
            { id: 'bonds', label: '国债利率' },
          ] as { id: AssetCategory; label: string }[]
        ).map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-space-md py-1 rounded-lg font-title-section text-title-section shrink-0 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 3. Featured Market Sector Heatmap */}
      <div className="w-full flex flex-col gap-space-sm bg-surface-container-low rounded-xl p-space-md shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[18px]">
              grid_view
            </span>
            <span className="font-title-section text-title-section text-on-surface">
              标普核心板块热图
            </span>
          </div>
          <button
            onClick={() => setSelectedSectorId('tech')}
            className="flex items-center gap-space-xs text-outline hover:text-on-surface font-label-caps text-label-caps cursor-pointer transition-colors"
          >
            <span>加权市值图谱</span>
            <span className="material-symbols-outlined text-[14px]">
              chevron_right
            </span>
          </button>
        </div>

        {/* Dynamic 2x2 Dense Bento Grid */}
        <div className="grid grid-cols-12 gap-space-xs">
          {/* Tech (Weight 40%) */}
          <div
            onClick={() => setSelectedSectorId('tech')}
            className="col-span-7 bg-surface-container-high rounded p-space-sm flex flex-col justify-between relative overflow-hidden active:bg-surface-bright hover:ring-1 hover:ring-secondary/40 transition-all cursor-pointer min-h-[72px]"
          >
            <div className="absolute inset-0 bg-secondary/10 pointer-events-none"></div>
            <div className="flex items-center justify-between z-10">
              <span className="font-headline-panel text-headline-panel text-on-surface">
                信息科技
              </span>
              <span className="font-badge-mono text-badge-mono bg-secondary-container text-on-secondary px-1 py-0.5 rounded font-bold">
                +1.80%
              </span>
            </div>
            <div className="flex items-center justify-between z-10 text-on-surface-variant font-data-mono-sm text-data-mono-sm">
              <span>AAPL · MSFT · GOOGL</span>
              <span className="text-secondary font-medium">领涨</span>
            </div>
          </div>

          {/* Semiconductors (Weight 25%) */}
          <div
            onClick={() => setSelectedSectorId('semi')}
            className="col-span-5 bg-surface-container-high rounded p-space-sm flex flex-col justify-between relative overflow-hidden active:bg-surface-bright hover:ring-1 hover:ring-secondary/40 transition-all cursor-pointer min-h-[72px]"
          >
            <div className="absolute inset-0 bg-secondary/20 pointer-events-none"></div>
            <div className="flex items-center justify-between z-10">
              <span className="font-headline-panel text-headline-panel text-on-surface">
                半导体
              </span>
              <span className="font-badge-mono text-badge-mono bg-secondary-container text-on-secondary px-1 py-0.5 rounded font-bold">
                +2.92%
              </span>
            </div>
            <div className="flex items-center justify-between z-10 text-on-surface-variant font-data-mono-sm text-data-mono-sm">
              <span>NVDA · TSM</span>
              <span className="text-secondary font-medium">爆发</span>
            </div>
          </div>

          {/* Financials (Weight 20%) */}
          <div
            onClick={() => setSelectedSectorId('fin')}
            className="col-span-6 bg-surface-container-high rounded p-space-sm flex flex-col justify-between relative overflow-hidden active:bg-surface-bright hover:ring-1 hover:ring-secondary/30 transition-all cursor-pointer min-h-[64px]"
          >
            <div className="absolute inset-0 bg-secondary/5 pointer-events-none"></div>
            <div className="flex items-center justify-between z-10">
              <span className="font-title-section text-title-section text-on-surface">
                金融银行业
              </span>
              <span className="font-badge-mono text-badge-mono bg-surface-container-highest text-secondary px-1 py-0.5 rounded font-bold">
                +0.40%
              </span>
            </div>
            <div className="flex items-center justify-between z-10 text-on-surface-variant font-data-mono-sm text-data-mono-sm">
              <span>JPM · BAC · GS</span>
              <span className="text-on-surface-variant">温和</span>
            </div>
          </div>

          {/* Energy (Weight 15%) */}
          <div
            onClick={() => setSelectedSectorId('energy')}
            className="col-span-6 bg-surface-container-high rounded p-space-sm flex flex-col justify-between relative overflow-hidden active:bg-surface-bright hover:ring-1 hover:ring-tertiary/40 transition-all cursor-pointer min-h-[64px]"
          >
            <div className="absolute inset-0 bg-tertiary-container/15 pointer-events-none"></div>
            <div className="flex items-center justify-between z-10">
              <span className="font-title-section text-title-section text-on-surface">
                传统能源
              </span>
              <span className="font-badge-mono text-badge-mono bg-tertiary-container text-on-tertiary px-1 py-0.5 rounded font-bold">
                -0.82%
              </span>
            </div>
            <div className="flex items-center justify-between z-10 text-on-surface-variant font-data-mono-sm text-data-mono-sm">
              <span>XOM · CVX</span>
              <span className="text-tertiary font-medium">承压</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sector Details Modal / Drawer when clicked */}
      {selectedSector && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedSectorId(null)}
        >
          <div
            className="w-full max-w-md bg-surface-container-high rounded-t-2xl sm:rounded-2xl p-4 shadow-2xl flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-headline-panel text-headline-panel text-on-surface">
                  {selectedSector.name} · 板块图谱
                </span>
                <span className="font-badge-mono text-badge-mono px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">
                  权重 {selectedSector.weight}
                </span>
              </div>
              <button
                onClick={() => setSelectedSectorId(null)}
                className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>
            <p className="font-body-compact text-body-compact text-on-surface-variant">
              {selectedSector.summary}
            </p>
            <div className="flex flex-col gap-1.5">
              {selectedSector.leaders.map((leader) => (
                <div
                  key={leader.symbol}
                  onClick={() => {
                    setSelectedSectorId(null);
                    const exists = tickers.some(
                      (t) => t.symbol === leader.symbol
                    );
                    onSelectSymbol(exists ? leader.symbol : 'NVDA');
                  }}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-lowest cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-data-mono-md text-data-mono-md font-bold text-on-surface">
                      {leader.symbol}
                    </span>
                    <span className="font-body-compact text-body-compact text-outline">
                      {leader.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-data-mono-md text-data-mono-md text-on-surface">
                      {leader.price}
                    </span>
                    <span
                      className={`font-badge-mono text-badge-mono px-1.5 py-0.5 rounded ${
                        leader.change.startsWith('+')
                          ? 'bg-secondary-container text-on-secondary'
                          : 'bg-tertiary-container text-on-tertiary'
                      }`}
                    >
                      {leader.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Live Quotation Heat & Top Gainers/Movers */}
      <div className="w-full flex flex-col bg-surface-container-low rounded-xl overflow-hidden shadow-md">
        {/* Section Sub-Header */}
        <div className="px-space-md py-space-sm bg-surface-container flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[18px]">
              equalizer
            </span>
            <span className="font-title-section text-title-section text-on-surface">
              今日报价风向标 (实时订单流)
            </span>
          </div>
          <div className="flex items-center gap-space-xs">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              自动刷新: 1S
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
          </div>
        </div>

        {/* Table Header Line */}
        <div className="grid grid-cols-12 px-space-md py-1.5 bg-surface-container-lowest text-outline font-label-caps text-label-caps">
          <div className="col-span-4">标的 / 资产代码</div>
          <div className="col-span-3 text-center">24H 趋势</div>
          <div className="col-span-3 text-right">最新价</div>
          <div className="col-span-2 text-right">涨跌幅</div>
        </div>

        {/* Ticker Rows */}
        {displayedTickers.map((t, index) => {
          const flash = flashingSymbols[t.symbol];
          const rowBg =
            index % 2 === 0
              ? 'bg-surface-container-low'
              : 'bg-surface-container';

          return (
            <div
              key={t.symbol}
              onClick={() => onSelectSymbol(t.symbol)}
              className={`ticker-row grid grid-cols-12 items-center px-space-md py-space-sm hover:bg-surface-container-high active:bg-surface-container-highest transition-colors cursor-pointer ${rowBg}`}
            >
              <div className="col-span-4 flex flex-col min-w-0 pr-1">
                <div className="flex items-center gap-1">
                  <span className="font-data-mono-md text-data-mono-md text-on-surface font-bold truncate">
                    {t.displaySymbol}
                  </span>
                  <span
                    className={`font-badge-mono text-badge-mono px-1 rounded shrink-0 ${
                      t.badgeStyle === 'secondary'
                        ? 'bg-secondary text-on-secondary-container'
                        : 'bg-surface-container-highest text-primary'
                    }`}
                  >
                    {t.badge}
                  </span>
                </div>
                <span className="font-body-compact text-body-compact text-outline truncate">
                  {t.name}
                </span>
              </div>

              <div className="col-span-3 flex justify-center">
                <svg
                  className={`w-16 h-6 ${
                    t.isBull ? 'text-secondary' : 'text-tertiary'
                  }`}
                  fill="none"
                  viewBox="0 0 64 24"
                >
                  <path
                    d={t.sparklinePath}
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.5"
                  ></path>
                </svg>
              </div>

              <div className="col-span-3 flex flex-col items-end">
                <span
                  className={`font-data-mono-md text-data-mono-md font-medium transition-colors ${
                    flash === 'up'
                      ? 'text-secondary'
                      : flash === 'down'
                      ? 'text-tertiary'
                      : 'text-on-surface'
                  }`}
                >
                  {formatPrice(t)}
                </span>
                <span
                  className={`font-badge-mono text-badge-mono ${
                    t.isBull ? 'text-secondary' : 'text-tertiary'
                  }`}
                >
                  {formatChangeAbs(t)}
                </span>
              </div>

              <div className="col-span-2 flex justify-end">
                <div
                  className={`px-space-xs py-1 rounded font-badge-mono text-badge-mono font-bold tracking-tight text-center min-w-[54px] ${
                    t.isBull
                      ? 'bg-secondary-container text-on-secondary'
                      : 'bg-tertiary-container text-on-tertiary'
                  }`}
                >
                  {t.changePct >= 0 ? `+${t.changePct.toFixed(2)}%` : `${t.changePct.toFixed(2)}%`}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. High-Impact Events Today (财经大事与催化剂) */}
      <div className="w-full flex flex-col gap-space-sm bg-surface-container-low rounded-xl p-space-md shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-tertiary-container text-[18px]">
              campaign
            </span>
            <span className="font-title-section text-title-section text-on-surface">
              今日重要事件预告
            </span>
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-0.5 rounded">
            <span className="font-badge-mono text-badge-mono text-tertiary font-bold">
              4 个高敏感
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-space-xs">
          {/* Event 1: US NFP */}
          <div
            onClick={() => onNavigateTab('news-and-events')}
            className="flex flex-col p-space-sm bg-surface-container rounded-lg gap-space-xs hover:bg-surface-container-high active:bg-surface-container-highest transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="px-1.5 py-0.5 rounded bg-surface-container-highest font-badge-mono text-badge-mono text-on-surface">
                  🇺🇸 美元
                </span>
                <span className="font-headline-panel text-headline-panel text-on-surface">
                  美国 9月非农就业人口 (NFP)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                <span className="font-badge-mono text-badge-mono text-tertiary">
                  高影响
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant font-data-mono-sm text-data-mono-sm">
              <div className="flex items-center gap-space-md">
                <span>
                  预期: <strong className="text-on-surface">14.0 万</strong>
                </span>
                <span>
                  前值: <strong className="text-outline">14.2 万</strong>
                </span>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined text-[14px]">
                  timer
                </span>
                <span className="font-badge-mono text-badge-mono">
                  {formatCountdown(nfpSeconds)} 后公布
                </span>
              </div>
            </div>
          </div>

          {/* Event 2: FOMC Speech */}
          <div
            onClick={() => onNavigateTab('news-and-events')}
            className="flex flex-col p-space-sm bg-surface-container rounded-lg gap-space-xs hover:bg-surface-container-high active:bg-surface-container-highest transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="px-1.5 py-0.5 rounded bg-surface-container-highest font-badge-mono text-badge-mono text-on-surface">
                  🇺🇸 美联储
                </span>
                <span className="font-headline-panel text-headline-panel text-on-surface">
                  美联储主席鲍威尔发表讲话
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                <span className="font-badge-mono text-badge-mono text-tertiary">
                  高影响
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant font-data-mono-sm text-data-mono-sm">
              <span>华盛顿宏观经济研讨会主旨演讲</span>
              <div className="flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined text-[14px]">
                  timer
                </span>
                <span className="font-badge-mono text-badge-mono">
                  {formatCountdown(fomcSeconds)} 后开始
                </span>
              </div>
            </div>
          </div>

          {/* Event 3: ECB Rate Decision */}
          <div
            onClick={() => onNavigateTab('news-and-events')}
            className="flex flex-col p-space-sm bg-surface-container rounded-lg gap-space-xs hover:bg-surface-container-high active:bg-surface-container-highest transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="px-1.5 py-0.5 rounded bg-surface-container-highest font-badge-mono text-badge-mono text-on-surface">
                  🇪🇺 欧洲
                </span>
                <span className="font-headline-panel text-headline-panel text-on-surface">
                  欧洲央行主要再融资利率决议
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                <span className="font-badge-mono text-badge-mono text-tertiary">
                  高影响
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant font-data-mono-sm text-data-mono-sm">
              <div className="flex items-center gap-space-md">
                <span>
                  预期: <strong className="text-on-surface">3.40%</strong>
                </span>
                <span>
                  前值: <strong className="text-outline">3.65%</strong>
                </span>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined text-[14px]">
                  timer
                </span>
                <span className="font-badge-mono text-badge-mono">
                  {formatCountdown(ecbSeconds)} 后公布
                </span>
              </div>
            </div>
          </div>

          {/* Event 4: Tesla Q3 Earnings */}
          <div
            onClick={() => onSelectSymbol('TSLA')}
            className="flex flex-col p-space-sm bg-surface-container rounded-lg gap-space-xs hover:bg-surface-container-high active:bg-surface-container-highest transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="px-1.5 py-0.5 rounded bg-surface-container-highest font-badge-mono text-badge-mono text-on-surface">
                  🏢 财报
                </span>
                <span className="font-headline-panel text-headline-panel text-on-surface">
                  特斯拉 (TSLA) Q3 财报电话会
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                <span className="font-badge-mono text-badge-mono text-secondary">
                  中高影响
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant font-data-mono-sm text-data-mono-sm">
              <div className="flex items-center gap-space-md">
                <span>
                  预期 EPS: <strong className="text-on-surface">$0.60</strong>
                </span>
                <span>
                  营收预期: <strong className="text-on-surface">$25.4B</strong>
                </span>
              </div>
              <div className="flex items-center gap-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px]">
                  event
                </span>
                <span className="font-badge-mono text-badge-mono">
                  美股盘后公布
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
