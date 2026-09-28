import React, { useState, useEffect } from 'react';
import { ECONOMIC_EVENTS } from '../data/marketData';

interface NewsAndEventsViewProps {
  onSelectSymbol: (symbol: string) => void;
}

export const NewsAndEventsView: React.FC<NewsAndEventsViewProps> = ({
  onSelectSymbol,
}) => {
  const [horizon, setHorizon] = useState<'today' | 'tmrw' | 'week'>('today');
  const [highImpactOnly, setHighImpactOnly] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<
    'ALL' | 'US' | 'EU' | 'CN' | 'JP'
  >('ALL');
  const [cpiSeconds, setCpiSeconds] = useState(2 * 3600 + 45 * 60 + 15);
  const [catalystFollowed, setCatalystFollowed] = useState(false);
  const [audioBooked, setAudioBooked] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpiSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
  };

  const filteredEvents = ECONOMIC_EVENTS.filter((evt) => {
    if (horizon !== 'today' && evt.horizon !== horizon) return false;
    if (horizon === 'today' && evt.horizon !== 'today') return false;
    if (highImpactOnly && evt.impact !== 'high') return false;
    if (selectedCountry !== 'ALL' && evt.countryCode !== selectedCountry)
      return false;
    return true;
  });

  return (
    <div className="flex flex-col w-full select-none">
      {/* Horizontal Quick Filter Toolbar */}
      <div className="flex flex-col bg-surface-container-low px-space-md py-space-sm gap-space-sm shadow-sm">
        {/* Row 1: Time Horizon & Impact Switch */}
        <div className="flex items-center justify-between gap-space-sm overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-space-xs shrink-0">
            {(
              [
                { id: 'today', label: '今日' },
                { id: 'tmrw', label: '明日' },
                { id: 'week', label: '本周' },
              ] as const
            ).map((btn) => {
              const isAct = horizon === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => setHorizon(btn.id)}
                  className={`px-space-md h-7 rounded font-data-mono-sm text-data-mono-sm transition-all active:scale-95 cursor-pointer ${
                    isAct
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
          <div className="h-4 w-[1px] bg-outline-variant/40 shrink-0"></div>
          {/* High Impact Only Toggle */}
          <button
            onClick={() => setHighImpactOnly((v) => !v)}
            className={`flex items-center gap-space-xs px-space-sm h-7 rounded font-label-caps text-label-caps shrink-0 active:scale-95 transition-all cursor-pointer ${
              highImpactOnly
                ? 'bg-tertiary-container text-white shadow-sm'
                : 'bg-tertiary-container/20 text-tertiary'
            }`}
          >
            <span className="flex h-2 w-2 rounded-full bg-tertiary-container animate-ping"></span>
            <span>高影响 ★★★</span>
          </button>
        </div>

        {/* Row 2: Economy & Asset Country Filters */}
        <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar pt-space-xs">
          <button
            onClick={() => setSelectedCountry('ALL')}
            className={`flex items-center gap-1 px-space-sm h-6 rounded font-label-caps text-label-caps shrink-0 cursor-pointer transition-colors ${
              selectedCountry === 'ALL'
                ? 'bg-surface-container-high text-on-surface'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="text-xs">🌐</span> 全部国家
          </button>
          <button
            onClick={() =>
              setSelectedCountry(selectedCountry === 'US' ? 'ALL' : 'US')
            }
            className={`flex items-center gap-1 px-space-sm h-6 rounded font-label-caps text-label-caps shrink-0 cursor-pointer transition-colors ${
              selectedCountry === 'US' || selectedCountry === 'ALL'
                ? 'bg-surface-container-highest text-primary'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>🇺🇸</span> 美国{' '}
            <span className="bg-primary/20 text-primary px-1 rounded-sm text-[9px] font-badge-mono">
              4
            </span>
          </button>
          <button
            onClick={() =>
              setSelectedCountry(selectedCountry === 'EU' ? 'ALL' : 'EU')
            }
            className={`flex items-center gap-1 px-space-sm h-6 rounded font-label-caps text-label-caps shrink-0 cursor-pointer transition-colors ${
              selectedCountry === 'EU'
                ? 'bg-surface-container-highest text-primary'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>🇪🇺</span> 欧元区{' '}
            <span className="bg-surface-bright text-on-surface-variant px-1 rounded-sm text-[9px] font-badge-mono">
              1
            </span>
          </button>
          <button
            onClick={() =>
              setSelectedCountry(selectedCountry === 'CN' ? 'ALL' : 'CN')
            }
            className={`flex items-center gap-1 px-space-sm h-6 rounded font-label-caps text-label-caps shrink-0 cursor-pointer transition-colors ${
              selectedCountry === 'CN'
                ? 'bg-surface-container-highest text-primary'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>🇨🇳</span> 中国{' '}
            <span className="bg-surface-bright text-on-surface-variant px-1 rounded-sm text-[9px] font-badge-mono">
              0
            </span>
          </button>
          <button
            onClick={() =>
              setSelectedCountry(selectedCountry === 'JP' ? 'ALL' : 'JP')
            }
            className={`flex items-center gap-1 px-space-sm h-6 rounded font-label-caps text-label-caps shrink-0 cursor-pointer transition-colors ${
              selectedCountry === 'JP'
                ? 'bg-surface-container-highest text-primary'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>🇯🇵</span> 日本{' '}
            <span className="bg-surface-bright text-on-surface-variant px-1 rounded-sm text-[9px] font-badge-mono">
              2
            </span>
          </button>
        </div>
      </div>

      {/* Catalyst Countdown Banner (Floor 2 Elevation) */}
      <div className="px-space-md pt-space-md">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-tertiary-container/30 via-surface-container-high to-surface-container p-space-md shadow-md">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-tertiary-container/10 blur-xl pointer-events-none"></div>
          <div className="flex items-start justify-between gap-space-md relative z-10">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-space-xs">
                <span className="flex items-center justify-center px-1.5 py-0.5 rounded bg-tertiary-container text-on-tertiary font-label-caps text-label-caps">
                  CATALYST ALERT
                </span>
                <span className="text-tertiary font-label-caps text-label-caps flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">
                    warning
                  </span>{' '}
                  高波动预警
                </span>
              </div>
              <h2 className="font-headline-panel text-headline-panel text-on-surface font-semibold truncate">
                🇺🇸 美国 9月 未季调CPI年率 (YoY)
              </h2>
              <div className="flex items-center gap-space-sm font-data-mono-sm text-data-mono-sm text-on-surface-variant">
                <span>
                  预期:{' '}
                  <strong className="text-on-surface font-medium">3.6%</strong>
                </span>
                <span className="text-outline-variant">•</span>
                <span>
                  前值:{' '}
                  <strong className="text-on-surface font-medium">3.7%</strong>
                </span>
              </div>
            </div>
            {/* Timer Matrix Display */}
            <div className="flex flex-col items-end shrink-0">
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                距公布倒计时
              </span>
              <div className="flex items-center font-display-price-mobile text-display-price-mobile text-tertiary font-bold tracking-tight">
                {formatCountdown(cpiSeconds)}
              </div>
              <span className="font-badge-mono text-badge-mono text-secondary tracking-widest uppercase">
                EST 08:30:00
              </span>
            </div>
          </div>
          {/* Volatility Impact Indicator */}
          <div className="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-data-mono-sm text-data-mono-sm">
            <span className="flex items-center gap-1 text-on-surface">
              <span className="material-symbols-outlined text-[15px] text-primary">
                bolt
              </span>{' '}
              预期关联资产: SPX500, DXY, BTCUSDT
            </span>
            <button
              onClick={() => setCatalystFollowed((f) => !f)}
              className="flex items-center text-primary hover:text-primary-fixed-dim transition-colors font-title-section text-title-section cursor-pointer"
            >
              {catalystFollowed ? '已关注事件 ✓' : '关注事件'}{' '}
              {!catalystFollowed && (
                <span className="material-symbols-outlined text-[14px]">
                  chevron_right
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Section Header: Chronological Events */}
      <div className="px-space-md pt-space-xl pb-space-sm flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-primary text-[18px]">
            schedule
          </span>
          <h3 className="font-title-section text-title-section text-on-surface uppercase tracking-wider">
            今日财经事件日程 (北京时间)
          </h3>
        </div>
        <span className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">
          UTC+8
        </span>
      </div>

      {/* Events Timeline Stream */}
      <div className="flex flex-col px-space-md gap-space-sm">
        {filteredEvents.length === 0 ? (
          <div className="rounded-lg bg-surface-container p-6 text-center text-on-surface-variant font-body-default text-body-default">
            当前筛选条件下暂无财经事件日程，点击「全部国家」或切换时间范围查看。
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className={`rounded-lg ${
                evt.impact === 'low'
                  ? 'bg-surface-container/60'
                  : 'bg-surface-container'
              } p-space-md shadow-sm transition-all hover:bg-surface-container-high`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-space-sm">
                  <span
                    className={`font-data-mono-lg text-data-mono-lg font-bold ${
                      evt.isSpeech
                        ? 'text-primary'
                        : evt.impact === 'low'
                        ? 'text-outline'
                        : 'text-on-surface'
                    }`}
                  >
                    {evt.time}
                  </span>
                  <span className="text-base">{evt.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-title-section text-title-section text-on-surface font-medium">
                      {evt.title}
                    </span>
                    <span className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">
                      {evt.subtitle}
                    </span>
                  </div>
                </div>

                {/* Impact Dots */}
                {evt.impact === 'high' && (
                  <div
                    className="flex items-center gap-1 shrink-0"
                    title="高影响事件"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                  </div>
                )}
                {evt.impact === 'medium' && (
                  <div
                    className="flex items-center gap-1 shrink-0"
                    title="中度影响"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-surface-highest"></span>
                  </div>
                )}
                {evt.impact === 'low' && (
                  <div
                    className="flex items-center gap-1 shrink-0"
                    title="低度影响"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-surface-highest"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-surface-highest"></span>
                  </div>
                )}
              </div>

              {/* Speech Card Variant */}
              {evt.isSpeech ? (
                <>
                  <div className="mt-space-sm bg-surface-container-low rounded p-space-sm flex flex-col gap-1">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[15px]">
                        mic
                      </span>
                      <span className="font-title-section text-title-section text-on-surface font-medium">
                        {evt.speechTopic}
                      </span>
                    </div>
                    <p className="font-body-compact text-body-compact text-on-surface-variant">
                      {evt.speechDesc}
                    </p>
                  </div>
                  <div className="mt-space-xs flex items-center justify-between pt-space-xs">
                    <span className="px-space-sm py-0.5 rounded bg-primary-container/20 text-primary font-badge-mono text-badge-mono uppercase">
                      LIVE AUDIO BROADCAST
                    </span>
                    <button
                      onClick={() => setAudioBooked((b) => !b)}
                      className="flex items-center gap-0.5 text-primary hover:text-primary-fixed-dim font-data-mono-sm text-data-mono-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        campaign
                      </span>{' '}
                      {audioBooked ? '已预约同传 ✓' : '预约语音同传'}
                    </button>
                  </div>
                </>
              ) : evt.impact === 'low' ? (
                <div className="mt-space-sm flex items-center justify-between text-on-surface-variant font-data-mono-sm text-data-mono-sm">
                  <span>前值: {evt.prior}</span>
                  <span className="text-outline font-badge-mono text-badge-mono">
                    {evt.statusText}
                  </span>
                </div>
              ) : (
                <>
                  <div className="mt-space-md grid grid-cols-3 gap-space-xs bg-surface-container-lowest rounded p-space-sm font-data-mono-sm text-data-mono-sm">
                    <div className="flex flex-col">
                      <span className="text-on-surface-variant font-label-caps text-label-caps">
                        {evt.actual === '--' ? '今值' : '今值 (ACTUAL)'}
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className={`font-data-mono-lg text-data-mono-lg font-bold ${
                            evt.actual === '--'
                              ? 'text-outline-variant'
                              : 'text-secondary'
                          }`}
                        >
                          {evt.actual}
                        </span>
                        {evt.actualTag && (
                          <span className="px-1 py-0.2 rounded bg-secondary-container/30 text-secondary text-[10px] font-badge-mono">
                            {evt.actualTag}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-on-surface-variant font-label-caps text-label-caps">
                        预测 (FORECAST)
                      </span>
                      <span className="font-data-mono-md text-data-mono-md text-on-surface mt-0.5">
                        {evt.forecast}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-on-surface-variant font-label-caps text-label-caps">
                        前值 (PRIOR)
                      </span>
                      <span className="font-data-mono-md text-data-mono-md text-on-surface-variant mt-0.5">
                        {evt.prior}
                      </span>
                    </div>
                  </div>
                  {evt.reactionText && (
                    <div className="mt-space-xs flex items-center justify-between text-on-surface-variant font-data-mono-sm text-data-mono-sm pt-space-xs">
                      <div className="flex items-center gap-1 text-secondary">
                        <span className="material-symbols-outlined text-[14px]">
                          trending_up
                        </span>
                        <span>{evt.reactionText}</span>
                      </div>
                      <span className="text-outline font-badge-mono text-badge-mono">
                        {evt.statusText}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Earnings Season Spotlight Section */}
      <div className="px-space-md pt-space-xl pb-space-sm flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-secondary text-[18px]">
            query_stats
          </span>
          <h3 className="font-title-section text-title-section text-on-surface uppercase tracking-wider">
            今日财报焦点 · 美股盘后
          </h3>
        </div>
        <span className="font-label-caps text-label-caps text-secondary font-bold">
          AFTER MARKET CLOSE
        </span>
      </div>

      {/* Earnings Cards List */}
      <div className="flex flex-col px-space-md gap-space-sm">
        {/* Card 1: NVDA */}
        <div
          onClick={() => onSelectSymbol('NVDA')}
          className="rounded-xl bg-surface-container p-space-md shadow-md relative overflow-hidden hover:bg-surface-container-high transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded bg-[#76b900]/20 flex items-center justify-center font-badge-mono font-bold text-[#76b900]">
                NVDA
              </div>
              <div className="flex flex-col">
                <span className="font-headline-panel text-headline-panel font-semibold text-on-surface">
                  英伟达 NVIDIA
                </span>
                <span className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">
                  NASDAQ · 半导体 / 生成式AI
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-badge-mono text-badge-mono text-primary font-bold bg-primary-container/20 px-1.5 py-0.5 rounded">
                期权隐含震荡 ±7.8%
              </span>
              <span className="font-data-mono-sm text-data-mono-sm text-on-surface-variant mt-0.5">
                盘后 04:20 披露
              </span>
            </div>
          </div>
          {/* Financial Target Projections */}
          <div className="mt-space-md grid grid-cols-2 gap-space-sm bg-surface-container-low rounded p-space-sm font-data-mono-sm text-data-mono-sm">
            <div className="flex flex-col">
              <span className="text-on-surface-variant font-label-caps text-label-caps">
                预期每股收益 (EST EPS)
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-data-mono-lg text-data-mono-lg font-bold text-on-surface">
                  $0.75
                </span>
                <span className="text-on-surface-variant text-[10px]">
                  同期前值: $0.40
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-on-surface-variant font-label-caps text-label-caps">
                预期营收 (EST REVENUE)
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-data-mono-lg text-data-mono-lg font-bold text-on-surface">
                  $32.80B
                </span>
                <span className="text-secondary text-[10px] font-medium">
                  +112% YoY
                </span>
              </div>
            </div>
          </div>
          {/* Key Narrative Tags */}
          <div className="mt-space-sm flex items-center gap-space-xs flex-wrap">
            <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-data-mono-sm text-data-mono-sm">
              Blackwell 芯片出货指引
            </span>
            <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-data-mono-sm text-data-mono-sm">
              数据中心毛利预期 75%
            </span>
          </div>
        </div>

        {/* Card 2: TSLA */}
        <div
          onClick={() => onSelectSymbol('TSLA')}
          className="rounded-xl bg-surface-container p-space-md shadow-md relative overflow-hidden hover:bg-surface-container-high transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded bg-[#e82127]/20 flex items-center justify-center font-badge-mono font-bold text-[#e82127]">
                TSLA
              </div>
              <div className="flex flex-col">
                <span className="font-headline-panel text-headline-panel font-semibold text-on-surface">
                  特斯拉 Tesla
                </span>
                <span className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">
                  NASDAQ · 电动汽车 / 储能
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-badge-mono text-badge-mono text-tertiary font-bold bg-tertiary-container/20 px-1.5 py-0.5 rounded">
                期权隐含震荡 ±6.2%
              </span>
              <span className="font-data-mono-sm text-data-mono-sm text-on-surface-variant mt-0.5">
                电话会 05:30
              </span>
            </div>
          </div>
          {/* Financial Target Projections */}
          <div className="mt-space-md grid grid-cols-2 gap-space-sm bg-surface-container-low rounded p-space-sm font-data-mono-sm text-data-mono-sm">
            <div className="flex flex-col">
              <span className="text-on-surface-variant font-label-caps text-label-caps">
                预期每股收益 (EST EPS)
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-data-mono-lg text-data-mono-lg font-bold text-on-surface">
                  $0.59
                </span>
                <span className="text-on-surface-variant text-[10px]">
                  前值: $0.53
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-on-surface-variant font-label-caps text-label-caps">
                核心关注焦点
              </span>
              <span className="font-data-mono-md text-data-mono-md text-on-surface font-medium mt-0.5 truncate">
                Robotaxi 商业化时间表
              </span>
            </div>
          </div>
          <div className="mt-space-sm flex items-center gap-space-xs flex-wrap">
            <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-data-mono-sm text-data-mono-sm">
              单车汽车毛利率 (Auto Gross Margin)
            </span>
            <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-data-mono-sm text-data-mono-sm">
              储能 Megapack 交付
            </span>
          </div>
        </div>
      </div>

      {/* AI Macro Digest & Strategic Overview Card */}
      <div className="px-space-md pt-space-xl pb-space-xl">
        <div className="rounded-xl bg-gradient-to-b from-surface-container-high to-surface-container p-space-md shadow-md flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary text-[20px]">
                smart_toy
              </span>
              <span className="font-headline-panel text-headline-panel text-on-surface font-semibold">
                机构级宏观推演摘要 (TV AI)
              </span>
            </div>
            <span className="font-badge-mono text-badge-mono text-secondary px-1.5 py-0.5 rounded bg-secondary-container/20">
              实时同步
            </span>
          </div>
          <p className="font-body-default text-body-default text-on-surface-variant leading-relaxed">
            今日市场核心定价锚点完全系于{' '}
            <strong className="text-on-surface">CPI与科技巨头财报</strong>{' '}
            的共振效应。若通胀增速超预期下行至3.5%区间，10年期美债收益率（US10Y）或将重新下测3.95%关口，为流动性敏感的{' '}
            <span className="text-primary font-medium">标普500成长板块</span> 与{' '}
            <span className="text-secondary font-medium">比特币现货</span>{' '}
            提供强势支撑；反之，若英伟达芯片指引受产能瓶颈抑制，科技权重板块需警惕期权波动率均值回归带来的Gamma压制风险。
          </p>
          {/* Asset Sentiment Mini Radar */}
          <div className="grid grid-cols-3 gap-space-xs pt-space-xs font-data-mono-sm text-data-mono-sm">
            <div
              onClick={() => onSelectSymbol('SPX500')}
              className="p-space-sm rounded bg-surface-container-low hover:bg-surface-container-highest transition-colors cursor-pointer flex flex-col items-center"
            >
              <span className="text-on-surface-variant font-label-caps text-label-caps">
                美股指期货 (ES)
              </span>
              <span className="text-secondary font-bold font-data-mono-md text-data-mono-md mt-1">
                +0.42% 偏多
              </span>
            </div>
            <div
              onClick={() => onSelectSymbol('US10Y')}
              className="p-space-sm rounded bg-surface-container-low hover:bg-surface-container-highest transition-colors cursor-pointer flex flex-col items-center"
            >
              <span className="text-on-surface-variant font-label-caps text-label-caps">
                10年期美债 (US10Y)
              </span>
              <span className="text-on-surface font-bold font-data-mono-md text-data-mono-md mt-1">
                4.015% 震荡
              </span>
            </div>
            <div
              onClick={() => onSelectSymbol('BTCUSDT')}
              className="p-space-sm rounded bg-surface-container-low hover:bg-surface-container-highest transition-colors cursor-pointer flex flex-col items-center"
            >
              <span className="text-on-surface-variant font-label-caps text-label-caps">
                加密资产 (BTC)
              </span>
              <span className="text-secondary font-bold font-data-mono-md text-data-mono-md mt-1">
                突破 $67.5K
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
