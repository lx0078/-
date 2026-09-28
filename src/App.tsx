import React, { useState, useEffect } from 'react';
import {
  NavTab,
  INITIAL_TICKERS,
  INITIAL_IDEAS,
  TickerAsset,
  TradingIdea,
  PriceAlert,
  PaperPosition,
} from './data/marketData';
import { MarketsTodayView } from './components/MarketsTodayView';
import { InteractiveChartView } from './components/InteractiveChartView';
import { NewsAndEventsView } from './components/NewsAndEventsView';
import {
  WatchlistView,
  CommunityIdeasView,
  AccountProfileView,
} from './components/SecondaryViews';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('markets-today');
  const [tickers, setTickers] = useState<TickerAsset[]>(INITIAL_TICKERS);
  const [flashingSymbols, setFlashingSymbols] = useState<
    Record<string, 'up' | 'down' | undefined>
  >({});
  const [activeChartSymbol, setActiveChartSymbol] = useState<string>('BTCUSDT');

  const [watchlist, setWatchlist] = useState<string[]>([
    'BTCUSDT',
    'NVDA',
    'AAPL',
    'SOLUSD',
    'XAUUSD',
  ]);

  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: 'al-1',
      symbol: 'BTC/USDT',
      condition: 'above',
      targetPrice: '$68,000.00',
      note: '4H级别关键阻力位放量突破提醒',
      active: true,
      createdAt: '14:20',
    },
    {
      id: 'al-2',
      symbol: 'NVDA',
      condition: 'above',
      targetPrice: '$140.00',
      note: '盘后财报披露前整数关口预警',
      active: true,
      createdAt: '15:05',
    },
  ]);

  const [ideas, setIdeas] = useState<TradingIdea[]>(INITIAL_IDEAS);

  const [positions, setPositions] = useState<PaperPosition[]>([
    {
      id: 'pos-1',
      symbol: 'BTC/USDT',
      side: 'LONG',
      leverage: 20,
      entryPrice: 67120.0,
      sizeUsd: 25000,
      timestamp: '13:45',
    },
    {
      id: 'pos-2',
      symbol: 'NVDA',
      side: 'LONG',
      leverage: 10,
      entryPrice: 135.4,
      sizeUsd: 15000,
      timestamp: '14:10',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // 1-second real-time order flow tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTickers((prev) => {
        const nextFlashes: Record<string, 'up' | 'down' | undefined> = {};
        const updated = prev.map((t) => {
          // Randomly pick 2-3 symbols to tick each second
          if (Math.random() > 0.45) return t;
          const direction = Math.random() > 0.47 ? 1 : -1;
          const pctMove = direction * (Math.random() * 0.0012);
          const rawNewPrice = Math.max(0.0001, t.price * (1 + pctMove));
          const newPrice = Number(rawNewPrice.toFixed(t.decimals));
          if (newPrice !== t.price) {
            nextFlashes[t.symbol] = newPrice > t.price ? 'up' : 'down';
          }
          return {
            ...t,
            price: newPrice,
          };
        });
        if (Object.keys(nextFlashes).length > 0) {
          setFlashingSymbols(nextFlashes);
          setTimeout(() => setFlashingSymbols({}), 450);
        }
        return updated;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const handleSelectSymbolForChart = (symbol: string) => {
    const matched = tickers.find(
      (t) =>
        t.symbol.toUpperCase() === symbol.toUpperCase() ||
        t.displaySymbol.replace(/\s|\//g, '').toUpperCase() ===
          symbol.replace(/\s|\//g, '').toUpperCase()
    );
    setActiveChartSymbol(matched ? matched.symbol : 'BTCUSDT');
    setActiveTab('interactive-chart');
    setShowSearchDropdown(false);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  const handleAddAlert = (newAlert: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    setAlerts((prev) => [
      {
        ...newAlert,
        id: `al-${Date.now()}`,
        createdAt: timeStr,
      },
      ...prev,
    ]);
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handlePublishIdea = (
    newIdea: Omit<TradingIdea, 'id' | 'likes' | 'timestamp'>
  ) => {
    setIdeas((prev) => [
      {
        ...newIdea,
        id: `idea-${Date.now()}`,
        likes: 1,
        liked: true,
        timestamp: '刚刚',
      },
      ...prev,
    ]);
  };

  const handleToggleIdeaLike = (id: string) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === id
          ? {
              ...idea,
              liked: !idea.liked,
              likes: idea.liked ? idea.likes - 1 : idea.likes + 1,
            }
          : idea
      )
    );
  };

  const handleExecuteOrder = (pos: Omit<PaperPosition, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    setPositions((prev) => [
      {
        ...pos,
        id: `pos-${Date.now()}`,
        timestamp: timeStr,
      },
      ...prev,
    ]);
  };

  const handleClosePosition = (id: string) => {
    setPositions((prev) => prev.filter((p) => p.id !== id));
  };

  const activeTicker =
    tickers.find((t) => t.symbol === activeChartSymbol) || tickers[0];

  const searchResults = tickers.filter(
    (t) =>
      t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.displaySymbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topTabs: { id: NavTab; label: string }[] = [
    { id: 'markets-today', label: '今日市场' },
    { id: 'watchlist', label: '自选' },
    { id: 'interactive-chart', label: '图表' },
    { id: 'news-and-events', label: '日历与事件' },
    { id: 'community-ideas', label: '观点' },
  ];

  const bottomTabs: { id: NavTab; label: string; icon: string }[] = [
    { id: 'markets-today', label: '市场', icon: 'query_stats' },
    { id: 'interactive-chart', label: '图表', icon: 'candlestick_chart' },
    { id: 'watchlist', label: '自选', icon: 'format_list_bulleted' },
    { id: 'news-and-events', label: '资讯/日历', icon: 'newspaper' },
    { id: 'account-profile', label: '我的', icon: 'account_circle' },
  ];

  return (
    <div className="bg-surface font-body-default text-body-default text-on-surface antialiased flex flex-col min-h-screen max-w-2xl mx-auto w-full relative">
      {/* Fixed Top Navigation Header matching Reference HTML */}
      <header className="fixed top-0 left-0 right-0 z-50 pt-safe bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.45)]">
        <div className="max-w-2xl mx-auto h-28 flex flex-col justify-between px-space-md py-space-sm relative">
          {/* Top Row: Search Bar + Market Open + 68% Bull + Notifications + Avatar */}
          <div className="flex items-center gap-space-sm h-11">
            <div className="flex-1 flex items-center h-10 bg-surface-container rounded-lg px-space-md gap-space-sm relative">
              <span className="material-symbols-outlined text-outline text-[18px]">
                search
              </span>
              <input
                className="w-full bg-transparent text-on-surface placeholder-outline font-data-mono-sm text-data-mono-sm outline-none"
                placeholder="搜索品种代码/市场 (如 BTCUSDT, NVDA)..."
                type="text"
                value={searchQuery}
                onFocus={() => setShowSearchDropdown(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
              />
              {searchQuery ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchDropdown(false);
                  }}
                  className="text-outline hover:text-on-surface cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    close
                  </span>
                </button>
              ) : (
                <div className="flex items-center gap-space-xs">
                  <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
                  <span className="font-badge-mono text-badge-mono text-secondary tracking-wider uppercase whitespace-nowrap">
                    MARKET OPEN
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-space-xs">
              <button
                onClick={() => setActiveTab('markets-today')}
                className="h-9 px-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest flex items-center gap-space-xs transition-colors cursor-pointer"
                title="市场多头情绪指数 68%"
              >
                <span className="material-symbols-outlined text-secondary text-[16px]">
                  trending_up
                </span>
                <span className="font-badge-mono text-badge-mono text-secondary font-bold uppercase whitespace-nowrap">
                  68% BULL
                </span>
              </button>

              <button
                onClick={() => setShowNotifications((v) => !v)}
                className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors relative cursor-pointer"
                title="高波动预警与价格警报"
              >
                <span className="material-symbols-outlined text-[20px]">
                  notifications
                </span>
                {alerts.length > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-tertiary-container"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('account-profile')}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                title="账户与模拟持仓"
              >
                <span className="material-symbols-outlined text-on-primary text-[18px]">
                  person
                </span>
              </button>
            </div>
          </div>

          {/* Search Dropdown Overlay */}
          {showSearchDropdown && (
            <div className="absolute top-13 left-2 right-2 z-50 bg-surface-container-high rounded-xl p-2 shadow-2xl border border-outline-variant/30 flex flex-col gap-1 max-h-72 overflow-y-auto">
              <div className="flex items-center justify-between px-2 py-1 text-outline font-label-caps text-label-caps">
                <span>快速跳转K线工作台</span>
                <button
                  onClick={() => setShowSearchDropdown(false)}
                  className="text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  关闭
                </button>
              </div>
              {searchResults.map((item) => (
                <div
                  key={item.symbol}
                  onClick={() => handleSelectSymbolForChart(item.symbol)}
                  className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-surface-container-highest cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-data-mono-md text-data-mono-md font-bold text-on-surface">
                      {item.displaySymbol}
                    </span>
                    <span className="px-1 py-0.5 rounded bg-surface-container font-badge-mono text-badge-mono text-primary">
                      {item.exchange}
                    </span>
                    <span className="font-body-compact text-body-compact text-outline">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-data-mono-sm text-data-mono-sm text-on-surface">
                      {item.prefix}
                      {item.price.toLocaleString('en-US', {
                        minimumFractionDigits: item.decimals,
                        maximumFractionDigits: item.decimals,
                      })}
                    </span>
                    <span
                      className={`font-badge-mono text-badge-mono px-1.5 py-0.5 rounded ${
                        item.isBull
                          ? 'bg-secondary-container text-on-secondary'
                          : 'bg-tertiary-container text-on-tertiary'
                      }`}
                    >
                      {item.changePct >= 0
                        ? `+${item.changePct.toFixed(2)}%`
                        : `${item.changePct.toFixed(2)}%`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Notifications Popover */}
          {showNotifications && (
            <div className="absolute top-13 right-2 z-50 w-72 bg-surface-container-high rounded-xl p-3 shadow-2xl border border-outline-variant/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-title-section text-title-section text-on-surface">
                  实时终端提醒 ({alerts.length + 1})
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-outline hover:text-on-surface font-data-mono-sm text-data-mono-sm cursor-pointer"
                >
                  关闭
                </button>
              </div>
              <div
                onClick={() => {
                  setShowNotifications(false);
                  setActiveTab('news-and-events');
                }}
                className="p-2 rounded-lg bg-tertiary-container/20 text-on-surface flex flex-col gap-0.5 cursor-pointer"
              >
                <span className="font-badge-mono text-badge-mono text-tertiary font-bold">
                  CATALYST ALERT · 高波动预警
                </span>
                <span className="font-body-compact text-body-compact">
                  美国 9月 未季调CPI年率即将公布，注意SPX500与BTC波动。
                </span>
              </div>
              {alerts.slice(0, 3).map((al) => (
                <div
                  key={al.id}
                  onClick={() => {
                    setShowNotifications(false);
                    handleSelectSymbolForChart(al.symbol);
                  }}
                  className="p-2 rounded-lg bg-surface-container flex flex-col gap-0.5 cursor-pointer hover:bg-surface-container-highest"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-data-mono-sm text-data-mono-sm font-bold text-primary">
                      {al.symbol}
                    </span>
                    <span className="font-badge-mono text-badge-mono text-secondary">
                      监控中: {al.targetPrice}
                    </span>
                  </div>
                  <span className="font-body-compact text-body-compact text-on-surface-variant">
                    {al.note}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Row inside Header: 5 Horizontal Section Tabs */}
          <div className="flex items-center gap-space-sm overflow-x-auto h-9 no-scrollbar">
            {topTabs.map((tab) => {
              const isAct = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowSearchDropdown(false);
                    setShowNotifications(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center px-space-md h-7 rounded font-title-section text-title-section whitespace-nowrap transition-colors cursor-pointer ${
                    isAct
                      ? 'bg-surface-container-highest text-primary'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Stage */}
      <main
        className="flex flex-col relative w-full pt-28 pb-20 bg-surface min-h-screen"
        onClick={() => {
          if (showSearchDropdown) setShowSearchDropdown(false);
          if (showNotifications) setShowNotifications(false);
        }}
      >
        {activeTab === 'markets-today' && (
          <MarketsTodayView
            tickers={tickers}
            flashingSymbols={flashingSymbols}
            onSelectSymbol={handleSelectSymbolForChart}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'interactive-chart' && (
          <InteractiveChartView
            activeTicker={activeTicker}
            allTickers={tickers}
            onSelectSymbol={(sym) => setActiveChartSymbol(sym)}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onAddAlert={handleAddAlert}
            onPublishIdea={handlePublishIdea}
            onExecuteOrder={handleExecuteOrder}
          />
        )}

        {activeTab === 'news-and-events' && (
          <NewsAndEventsView onSelectSymbol={handleSelectSymbolForChart} />
        )}

        {activeTab === 'watchlist' && (
          <WatchlistView
            tickers={tickers}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onSelectSymbol={handleSelectSymbolForChart}
            alerts={alerts}
            onDeleteAlert={handleDeleteAlert}
          />
        )}

        {activeTab === 'community-ideas' && (
          <CommunityIdeasView
            ideas={ideas}
            onToggleLike={handleToggleIdeaLike}
            onSelectSymbol={handleSelectSymbolForChart}
          />
        )}

        {activeTab === 'account-profile' && (
          <AccountProfileView
            positions={positions}
            onClosePosition={handleClosePosition}
            alerts={alerts}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation Bar matching Reference HTML */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_-1px_12px_rgba(0,0,0,0.5)]">
        <div className="max-w-2xl mx-auto h-14 px-space-sm grid grid-cols-5 items-center">
          {bottomTabs.map((item) => {
            const isAct = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setShowSearchDropdown(false);
                  setShowNotifications(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                aria-current={isAct ? 'page' : undefined}
                className={`flex flex-col items-center justify-center gap-space-xs min-h-[44px] transition-colors cursor-pointer ${
                  isAct
                    ? 'text-primary-container font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                <span className="font-label-caps text-label-caps">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
