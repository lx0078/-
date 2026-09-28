import React, { useState } from 'react';
import {
  TickerAsset,
  TradingIdea,
  PriceAlert,
  PaperPosition,
} from '../data/marketData';

interface WatchlistViewProps {
  tickers: TickerAsset[];
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  onSelectSymbol: (symbol: string) => void;
  alerts: PriceAlert[];
  onDeleteAlert: (id: string) => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  tickers,
  watchlist,
  onToggleWatchlist,
  onSelectSymbol,
  alerts,
  onDeleteAlert,
}) => {
  const [subTab, setSubTab] = useState<'favorites' | 'alerts' | 'all'>('favorites');

  const watchedTickers =
    subTab === 'all'
      ? tickers
      : tickers.filter((t) => watchlist.includes(t.symbol));

  return (
    <div className="flex flex-col w-full gap-y-space-md p-space-md pb-6 select-none">
      {/* Sub-navigation & Summary Header */}
      <div className="flex items-center justify-between bg-surface-container-low rounded-xl p-space-md shadow-md">
        <div className="flex items-center gap-space-xs">
          <button
            onClick={() => setSubTab('favorites')}
            className={`px-space-md py-1 rounded-lg font-title-section text-title-section cursor-pointer transition-colors ${
              subTab === 'favorites'
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            核心自选 ({watchlist.length})
          </button>
          <button
            onClick={() => setSubTab('alerts')}
            className={`px-space-md py-1 rounded-lg font-title-section text-title-section cursor-pointer transition-colors ${
              subTab === 'alerts'
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            价格警报 ({alerts.length})
          </button>
          <button
            onClick={() => setSubTab('all')}
            className={`px-space-md py-1 rounded-lg font-title-section text-title-section cursor-pointer transition-colors ${
              subTab === 'all'
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            标的库管理
          </button>
        </div>
      </div>

      {subTab === 'alerts' ? (
        <div className="flex flex-col gap-space-sm">
          {alerts.length === 0 ? (
            <div className="rounded-xl bg-surface-container-low p-6 text-center text-on-surface-variant">
              暂无生效中的价格警报，可在「图表」工作台点击底部「添加价格警报」创建。
            </div>
          ) : (
            alerts.map((al) => (
              <div
                key={al.id}
                className="rounded-xl bg-surface-container p-space-md flex items-center justify-between shadow-sm"
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-headline-panel text-headline-panel text-on-surface font-bold">
                      {al.symbol}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-badge-mono text-badge-mono ${
                        al.condition === 'above'
                          ? 'bg-secondary-container/30 text-secondary'
                          : 'bg-tertiary-container/30 text-tertiary'
                      }`}
                    >
                      {al.condition === 'above' ? '上穿高于' : '下穿低于'}{' '}
                      {al.targetPrice}
                    </span>
                  </div>
                  <span className="font-body-compact text-body-compact text-on-surface-variant">
                    {al.note} · 创建于 {al.createdAt}
                  </span>
                </div>
                <button
                  onClick={() => onDeleteAlert(al.id)}
                  className="p-2 rounded-lg bg-surface-container-high text-outline hover:text-error cursor-pointer"
                  title="删除警报"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    delete
                  </span>
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col bg-surface-container-low rounded-xl overflow-hidden shadow-md">
          <div className="grid grid-cols-12 px-space-md py-1.5 bg-surface-container-lowest text-outline font-label-caps text-label-caps">
            <div className="col-span-5">标的 / 交易所</div>
            <div className="col-span-3 text-right">最新价</div>
            <div className="col-span-2 text-right">24H涨跌</div>
            <div className="col-span-2 text-right">自选</div>
          </div>

          {watchedTickers.length === 0 ? (
            <div className="p-6 text-center text-on-surface-variant">
              自选列表为空，请切换至「标的库管理」点击星标添加。
            </div>
          ) : (
            watchedTickers.map((t, idx) => {
              const isFav = watchlist.includes(t.symbol);
              return (
                <div
                  key={t.symbol}
                  onClick={() => onSelectSymbol(t.symbol)}
                  className={`grid grid-cols-12 items-center px-space-md py-2.5 hover:bg-surface-container-high transition-colors cursor-pointer ${
                    idx % 2 === 0
                      ? 'bg-surface-container-low'
                      : 'bg-surface-container'
                  }`}
                >
                  <div className="col-span-5 flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-data-mono-md text-data-mono-md text-on-surface font-bold">
                        {t.displaySymbol}
                      </span>
                      <span className="font-badge-mono text-badge-mono px-1 rounded bg-surface-container-highest text-primary">
                        {t.exchange}
                      </span>
                    </div>
                    <span className="font-body-compact text-body-compact text-outline truncate">
                      {t.name} · RSI {t.rsi.toFixed(1)}
                    </span>
                  </div>

                  <div className="col-span-3 text-right font-data-mono-md text-data-mono-md text-on-surface font-medium">
                    {t.prefix}
                    {t.price.toLocaleString('en-US', {
                      minimumFractionDigits: t.decimals,
                      maximumFractionDigits: t.decimals,
                    })}
                    {t.suffix || ''}
                  </div>

                  <div className="col-span-2 flex justify-end">
                    <span
                      className={`px-1.5 py-0.5 rounded font-badge-mono text-badge-mono font-bold ${
                        t.isBull
                          ? 'bg-secondary-container text-on-secondary'
                          : 'bg-tertiary-container text-on-tertiary'
                      }`}
                    >
                      {t.changePct >= 0
                        ? `+${t.changePct.toFixed(2)}%`
                        : `${t.changePct.toFixed(2)}%`}
                    </span>
                  </div>

                  <div
                    className="col-span-2 flex justify-end"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(t.symbol);
                    }}
                  >
                    <button
                      className={`p-1 rounded hover:bg-surface-container-highest cursor-pointer ${
                        isFav ? 'text-secondary' : 'text-outline'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[19px]"
                        style={{
                          fontVariationSettings: isFav
                            ? "'FILL' 1"
                            : "'FILL' 0",
                        }}
                      >
                        star
                      </span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

interface CommunityIdeasViewProps {
  ideas: TradingIdea[];
  onToggleLike: (id: string) => void;
  onSelectSymbol: (symbol: string) => void;
}

export const CommunityIdeasView: React.FC<CommunityIdeasViewProps> = ({
  ideas,
  onToggleLike,
  onSelectSymbol,
}) => {
  const [filterDir, setFilterDir] = useState<'ALL' | 'BULLISH' | 'BEARISH'>('ALL');

  const filtered = ideas.filter((i) =>
    filterDir === 'ALL' ? true : i.direction === filterDir
  );

  return (
    <div className="flex flex-col w-full gap-y-space-md p-space-md pb-6 select-none">
      <div className="flex items-center justify-between bg-surface-container-low rounded-xl p-space-md shadow-md">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-primary text-[18px]">
            insights
          </span>
          <span className="font-title-section text-title-section text-on-surface">
            机构与量化交易员推演观点
          </span>
        </div>
        <div className="flex items-center gap-1">
          {(['ALL', 'BULLISH', 'BEARISH'] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => setFilterDir(dir)}
              className={`px-2 py-0.5 rounded font-badge-mono text-badge-mono cursor-pointer ${
                filterDir === dir
                  ? 'bg-primary-container text-white'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {dir === 'ALL' ? '全部' : dir === 'BULLISH' ? '看多' : '看空'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-space-sm">
        {filtered.map((idea) => (
          <div
            key={idea.id}
            className="rounded-xl bg-surface-container p-space-md shadow-md flex flex-col gap-space-sm"
          >
            <div className="flex items-center justify-between">
              <div
                onClick={() => {
                  const cleanSym = idea.symbol.replace(/\s|\//g, '');
                  onSelectSymbol(cleanSym);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span className="font-headline-panel text-headline-panel font-bold text-primary hover:underline">
                  {idea.symbol}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-surface-container-highest font-badge-mono text-badge-mono text-on-surface-variant">
                  {idea.timeframe}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded font-badge-mono text-badge-mono font-bold ${
                    idea.direction === 'BULLISH'
                      ? 'bg-secondary-container text-on-secondary'
                      : 'bg-tertiary-container text-on-tertiary'
                  }`}
                >
                  {idea.direction === 'BULLISH' ? 'LONG 做多' : 'SHORT 做空'}
                </span>
              </div>
              <span className="font-data-mono-sm text-data-mono-sm text-outline">
                {idea.timestamp}
              </span>
            </div>

            <h3 className="font-headline-panel text-headline-panel text-on-surface font-semibold">
              {idea.title}
            </h3>

            <p className="font-body-default text-body-default text-on-surface-variant leading-relaxed">
              {idea.summary}
            </p>

            {/* Quantitative Execution Targets */}
            <div className="grid grid-cols-4 gap-1.5 bg-surface-container-low rounded-lg p-space-sm font-data-mono-sm text-data-mono-sm">
              <div className="flex flex-col">
                <span className="text-outline font-label-caps text-label-caps">
                  入场参考
                </span>
                <span className="text-on-surface font-bold mt-0.5">
                  {idea.entryPrice}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-outline font-label-caps text-label-caps">
                  目标止盈
                </span>
                <span className="text-secondary font-bold mt-0.5">
                  {idea.targetPrice}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-outline font-label-caps text-label-caps">
                  防守止损
                </span>
                <span className="text-tertiary font-bold mt-0.5">
                  {idea.stopLoss}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-outline font-label-caps text-label-caps">
                  盈亏比 R:R
                </span>
                <span className="text-primary font-bold mt-0.5">
                  {idea.rrRatio}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-on-surface-variant font-data-mono-sm text-data-mono-sm">
                <span className="text-on-surface font-semibold">
                  {idea.author}
                </span>
                <span>·</span>
                <span>{idea.authorRole}</span>
              </div>
              <button
                onClick={() => onToggleLike(idea.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-data-mono-sm text-data-mono-sm cursor-pointer transition-colors ${
                  idea.liked
                    ? 'bg-primary-container/25 text-primary font-bold'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  thumb_up
                </span>
                <span>{idea.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface AccountProfileViewProps {
  positions: PaperPosition[];
  onClosePosition: (id: string) => void;
  alerts: PriceAlert[];
}

export const AccountProfileView: React.FC<AccountProfileViewProps> = ({
  positions,
  onClosePosition,
  alerts,
}) => {
  const totalMargin = positions.reduce((acc, p) => acc + p.sizeUsd, 0);

  return (
    <div className="flex flex-col w-full gap-y-space-md p-space-md pb-6 select-none">
      {/* Institutional Trader Profile Card */}
      <div className="rounded-xl bg-surface-container-low p-space-md shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary-container flex items-center justify-center text-white font-headline-panel font-bold">
              QP
            </div>
            <div className="flex flex-col">
              <span className="font-headline-panel text-headline-panel text-on-surface font-bold">
                AlphaPulse 机构量化席位
              </span>
              <span className="font-data-mono-sm text-data-mono-sm text-secondary">
                PRO TERMINAL · 专线延迟 12ms
              </span>
            </div>
          </div>
          <span className="px-2 py-1 rounded bg-surface-container-highest font-badge-mono text-badge-mono text-primary">
            CROSS MARGIN
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 bg-surface-container rounded-lg p-space-sm font-data-mono-sm text-data-mono-sm">
          <div className="flex flex-col">
            <span className="text-outline font-label-caps text-label-caps">
              模拟净值 (EQUITY)
            </span>
            <span className="font-data-mono-lg text-data-mono-lg text-on-surface font-bold mt-0.5">
              $254,820.00
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-outline font-label-caps text-label-caps">
              持仓名义价值
            </span>
            <span className="font-data-mono-lg text-data-mono-lg text-primary font-bold mt-0.5">
              ${totalMargin.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-outline font-label-caps text-label-caps">
              今日浮动盈亏
            </span>
            <span className="font-data-mono-lg text-data-mono-lg text-secondary font-bold mt-0.5">
              +$4,820.00
            </span>
          </div>
        </div>
      </div>

      {/* Active Paper Positions Section */}
      <div className="rounded-xl bg-surface-container-low p-space-md shadow-md flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">
              account_balance_wallet
            </span>
            <span className="font-title-section text-title-section text-on-surface">
              当前实盘模拟持仓 ({positions.length})
            </span>
          </div>
          <span className="font-badge-mono text-badge-mono text-outline">
            可在「图表」页闪电下单
          </span>
        </div>

        {positions.length === 0 ? (
          <div className="p-4 rounded-lg bg-surface-container text-center text-on-surface-variant font-body-compact text-body-compact">
            当前暂无持仓，前往「图表」点击「快速做多 / 快速做空」即可建立模拟头寸。
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {positions.map((pos) => (
              <div
                key={pos.id}
                className="p-space-sm rounded-lg bg-surface-container flex items-center justify-between"
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-1.5 py-0.5 rounded font-badge-mono text-badge-mono font-bold ${
                        pos.side === 'LONG'
                          ? 'bg-secondary-container text-on-secondary'
                          : 'bg-tertiary-container text-on-tertiary'
                      }`}
                    >
                      {pos.side} {pos.leverage}X
                    </span>
                    <span className="font-data-mono-md text-data-mono-md text-on-surface font-bold">
                      {pos.symbol}
                    </span>
                  </div>
                  <span className="font-data-mono-sm text-data-mono-sm text-outline">
                    开仓均价: ${pos.entryPrice.toLocaleString()} · 仓位: $
                    {pos.sizeUsd.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => onClosePosition(pos.id)}
                  className="px-2.5 py-1 rounded bg-surface-container-highest hover:bg-tertiary-container hover:text-white font-badge-mono text-badge-mono text-on-surface transition-colors cursor-pointer"
                >
                  市价平仓
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Terminal Diagnostics & Preferences */}
      <div className="rounded-xl bg-surface-container-low p-space-md shadow-md flex flex-col gap-2 font-data-mono-sm text-data-mono-sm">
        <span className="font-title-section text-title-section text-on-surface">
          终端行情源状态
        </span>
        <div className="flex items-center justify-between py-1 border-b border-outline-variant/20">
          <span className="text-on-surface-variant">WebSocket 极速订单流</span>
          <span className="text-secondary font-bold">已连接 (12ms)</span>
        </div>
        <div className="flex items-center justify-between py-1 border-b border-outline-variant/20">
          <span className="text-on-surface-variant">生效中价格警报</span>
          <span className="text-primary font-bold">{alerts.length} 个监控点</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-on-surface-variant">宏观日历时区同步</span>
          <span className="text-on-surface">北京时间 (UTC+8)</span>
        </div>
      </div>
    </div>
  );
};
