export type NavTab =
  | 'markets-today'
  | 'watchlist'
  | 'interactive-chart'
  | 'news-and-events'
  | 'community-ideas'
  | 'account-profile';

export type AssetCategory = 'all' | 'indices' | 'crypto' | 'forex' | 'commodities' | 'bonds';

export interface CandleData {
  x: number;
  open: number;
  high: number;
  low: number;
  close: number;
  isBull: boolean;
  isDoji?: boolean;
  volPct: number;
  timeLabel: string;
  priceOpen: string;
  priceHigh: string;
  priceLow: string;
  priceClose: string;
}

export interface TickerAsset {
  symbol: string;
  displaySymbol: string;
  name: string;
  badge: string;
  badgeStyle: 'primary' | 'secondary';
  exchange: string;
  category: AssetCategory;
  price: number;
  decimals: number;
  prefix: string;
  suffix?: string;
  changeAbs: number;
  changePct: number;
  high24h: string;
  low24h: string;
  vol24h: string;
  sparklinePath: string;
  miniSparklinePath: string;
  isBull: boolean;
  buyRatio: number;
  rsi: number;
  rsiStatus: string;
  resLevel: string;
  supLevel: string;
  scaleLabels: string[];
}

export interface EconomicEventItem {
  id: string;
  time: string;
  horizon: 'today' | 'tmrw' | 'week';
  countryCode: 'US' | 'EU' | 'CN' | 'JP';
  flag: string;
  countryLabel: string;
  title: string;
  subtitle: string;
  impact: 'high' | 'medium' | 'low';
  actual?: string;
  actualTag?: string;
  forecast?: string;
  prior?: string;
  statusText?: string;
  reactionText?: string;
  isSpeech?: boolean;
  speechTopic?: string;
  speechDesc?: string;
  countdown?: string;
  subscribed?: boolean;
}

export interface TradingIdea {
  id: string;
  author: string;
  authorRole: string;
  symbol: string;
  timeframe: string;
  direction: 'BULLISH' | 'BEARISH';
  title: string;
  summary: string;
  entryPrice: string;
  targetPrice: string;
  stopLoss: string;
  rrRatio: string;
  likes: number;
  liked?: boolean;
  timestamp: string;
  tags: string[];
}

export interface PriceAlert {
  id: string;
  symbol: string;
  condition: 'above' | 'below';
  targetPrice: string;
  note: string;
  active: boolean;
  createdAt: string;
}

export interface PaperPosition {
  id: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  leverage: number;
  entryPrice: number;
  sizeUsd: number;
  timestamp: string;
}

export const TOP_INDICES = [
  {
    symbol: 'SPX500',
    name: '标普 500',
    price: 5815.20,
    decimals: 2,
    prefix: '',
    changePct: '+0.42%',
    isBull: true,
    sparkline: 'M1 17L12 14L22 15L34 8L47 3',
  },
  {
    symbol: 'NDX100',
    name: '纳斯达克 100',
    price: 20380.15,
    decimals: 2,
    prefix: '',
    changePct: '+0.85%',
    isBull: true,
    sparkline: 'M1 18L10 16L20 11L32 9L47 2',
  },
  {
    symbol: 'BTCUSDT',
    name: 'BTC / USD',
    price: 67840.0,
    decimals: 1,
    prefix: '',
    changePct: '+2.15%',
    isBull: true,
    sparkline: 'M1 16L11 12L21 14L31 6L47 2',
  },
  {
    symbol: 'US10Y',
    name: '美债 10年期',
    price: 4.081,
    decimals: 3,
    prefix: '',
    suffix: '%',
    changePct: '-0.03%',
    isBull: false,
    sparkline: 'M1 4L14 7L24 6L35 14L47 18',
  },
  {
    symbol: 'XAUUSD',
    name: '现货黄金 XAU',
    price: 2721.40,
    decimals: 2,
    prefix: '',
    changePct: '+0.55%',
    isBull: true,
    sparkline: 'M1 15L13 13L24 16L33 9L47 5',
  },
];

export const INITIAL_TICKERS: TickerAsset[] = [
  {
    symbol: 'BTCUSDT',
    displaySymbol: 'BTC/USDT',
    name: '比特币现货',
    badge: '加密',
    badgeStyle: 'secondary',
    exchange: 'BINANCE',
    category: 'crypto',
    price: 67842.50,
    decimals: 2,
    prefix: '$',
    changeAbs: 1420.00,
    changePct: 2.14,
    high24h: '$68,200.00',
    low24h: '$66,150.00',
    vol24h: '38,421 BTC',
    sparklinePath: 'M1 20L15 16L28 17L44 8L63 2',
    miniSparklinePath: 'M1 16L11 12L21 14L31 6L47 2',
    isBull: true,
    buyRatio: 64.2,
    rsi: 62.40,
    rsiStatus: 'NEUTRAL-BULLISH',
    resLevel: 'RES $68,000',
    supLevel: 'SUP $65,500',
    scaleLabels: ['68,400', '68,000', '67,200', '66,500', '65,500', '65,000'],
  },
  {
    symbol: 'NVDA',
    displaySymbol: 'NVDA',
    name: '英伟达',
    badge: '美股',
    badgeStyle: 'primary',
    exchange: 'NASDAQ',
    category: 'indices',
    price: 138.25,
    decimals: 2,
    prefix: '$',
    changeAbs: 4.18,
    changePct: 3.12,
    high24h: '$139.80',
    low24h: '$133.60',
    vol24h: '64.2M 股',
    sparklinePath: 'M1 20L15 16L28 17L44 8L63 2',
    miniSparklinePath: 'M1 17L12 14L22 15L34 8L47 3',
    isBull: true,
    buyRatio: 71.5,
    rsi: 68.10,
    rsiStatus: 'BULLISH IMPULSE',
    resLevel: 'RES $140.00',
    supLevel: 'SUP $132.50',
    scaleLabels: ['142.00', '140.00', '136.50', '134.00', '132.50', '130.00'],
  },
  {
    symbol: 'AAPL',
    displaySymbol: 'AAPL',
    name: '苹果公司',
    badge: '美股',
    badgeStyle: 'primary',
    exchange: 'NASDAQ',
    category: 'indices',
    price: 231.40,
    decimals: 2,
    prefix: '$',
    changeAbs: 1.50,
    changePct: 0.65,
    high24h: '$233.10',
    low24h: '$229.20',
    vol24h: '38.9M 股',
    sparklinePath: 'M1 18L18 17L30 14L46 11L63 6',
    miniSparklinePath: 'M1 18L10 16L20 11L32 9L47 2',
    isBull: true,
    buyRatio: 58.4,
    rsi: 56.80,
    rsiStatus: 'NEUTRAL-BULLISH',
    resLevel: 'RES $235.00',
    supLevel: 'SUP $226.00',
    scaleLabels: ['236.00', '235.00', '230.00', '228.00', '226.00', '224.00'],
  },
  {
    symbol: 'TSLA',
    displaySymbol: 'TSLA',
    name: '特斯拉汽车',
    badge: '美股',
    badgeStyle: 'primary',
    exchange: 'NASDAQ',
    category: 'indices',
    price: 218.80,
    decimals: 2,
    prefix: '$',
    changeAbs: -4.12,
    changePct: -1.85,
    high24h: '$224.50',
    low24h: '$216.90',
    vol24h: '72.5M 股',
    sparklinePath: 'M1 5L16 6L28 15L45 14L63 21',
    miniSparklinePath: 'M1 4L14 7L24 6L35 14L47 18',
    isBull: false,
    buyRatio: 43.2,
    rsi: 41.50,
    rsiStatus: 'BEARISH PRESSURE',
    resLevel: 'RES $228.00',
    supLevel: 'SUP $215.00',
    scaleLabels: ['230.00', '228.00', '222.00', '218.00', '215.00', '210.00'],
  },
  {
    symbol: 'SOLUSD',
    displaySymbol: 'SOL / USD',
    name: 'Solana 网络',
    badge: '加密',
    badgeStyle: 'secondary',
    exchange: 'COINBASE',
    category: 'crypto',
    price: 168.40,
    decimals: 2,
    prefix: '$',
    changeAbs: 8.30,
    changePct: 5.20,
    high24h: '$170.50',
    low24h: '$159.10',
    vol24h: '4.12M SOL',
    sparklinePath: 'M1 22L14 18L27 19L42 9L63 2',
    miniSparklinePath: 'M1 16L11 12L21 14L31 6L47 2',
    isBull: true,
    buyRatio: 69.8,
    rsi: 71.20,
    rsiStatus: 'STRONG BREAKOUT',
    resLevel: 'RES $172.00',
    supLevel: 'SUP $158.00',
    scaleLabels: ['175.00', '172.00', '165.00', '161.00', '158.00', '155.00'],
  },
  {
    symbol: 'EURUSD',
    displaySymbol: 'EUR / USD',
    name: '欧元 / 美元',
    badge: '外汇',
    badgeStyle: 'primary',
    exchange: 'FX SPOT',
    category: 'forex',
    price: 1.08620,
    decimals: 5,
    prefix: '',
    changeAbs: -0.0016,
    changePct: -0.15,
    high24h: '1.08940',
    low24h: '1.08450',
    vol24h: '142.8B EUR',
    sparklinePath: 'M1 9L18 8L31 14L46 16L63 19',
    miniSparklinePath: 'M1 4L14 7L24 6L35 14L47 18',
    isBull: false,
    buyRatio: 47.6,
    rsi: 44.90,
    rsiStatus: 'NEUTRAL-WEAK',
    resLevel: 'RES 1.0920',
    supLevel: 'SUP 1.0820',
    scaleLabels: ['1.0950', '1.0920', '1.0880', '1.0850', '1.0820', '1.0790'],
  },
  {
    symbol: 'XAUUSD',
    displaySymbol: 'XAU / USD',
    name: '现货黄金',
    badge: '商品',
    badgeStyle: 'primary',
    exchange: 'COMEX',
    category: 'commodities',
    price: 2721.40,
    decimals: 2,
    prefix: '$',
    changeAbs: 14.80,
    changePct: 0.55,
    high24h: '$2,732.00',
    low24h: '$2,704.50',
    vol24h: '285K 手',
    sparklinePath: 'M1 19L16 15L29 16L45 9L63 4',
    miniSparklinePath: 'M1 15L13 13L24 16L33 9L47 5',
    isBull: true,
    buyRatio: 61.5,
    rsi: 64.30,
    rsiStatus: 'BULLISH TREND',
    resLevel: 'RES $2,750',
    supLevel: 'SUP $2,685',
    scaleLabels: ['2,760', '2,750', '2,715', '2,700', '2,685', '2,670'],
  },
  {
    symbol: 'US10Y',
    displaySymbol: 'US10Y',
    name: '美国10年期国债收益率',
    badge: '国债',
    badgeStyle: 'primary',
    exchange: 'CBOT',
    category: 'bonds',
    price: 4.081,
    decimals: 3,
    prefix: '',
    suffix: '%',
    changeAbs: -0.012,
    changePct: -0.03,
    high24h: '4.115%',
    low24h: '4.060%',
    vol24h: '912K 手',
    sparklinePath: 'M1 6L15 9L28 8L44 15L63 19',
    miniSparklinePath: 'M1 4L14 7L24 6L35 14L47 18',
    isBull: false,
    buyRatio: 52.0,
    rsi: 48.20,
    rsiStatus: 'RANGE BOUND',
    resLevel: 'RES 4.150%',
    supLevel: 'SUP 3.950%',
    scaleLabels: ['4.200%', '4.150%', '4.050%', '4.000%', '3.950%', '3.900%'],
  },
  {
    symbol: 'SPX500',
    displaySymbol: 'SPX 500',
    name: '标普500指数期货',
    badge: '股指',
    badgeStyle: 'primary',
    exchange: 'CME',
    category: 'indices',
    price: 5815.20,
    decimals: 2,
    prefix: '',
    changeAbs: 24.30,
    changePct: 0.42,
    high24h: '5,830.00',
    low24h: '5,788.50',
    vol24h: '1.42M 手',
    sparklinePath: 'M1 19L15 15L29 16L45 9L63 4',
    miniSparklinePath: 'M1 17L12 14L22 15L34 8L47 3',
    isBull: true,
    buyRatio: 60.8,
    rsi: 61.10,
    rsiStatus: 'NEUTRAL-BULLISH',
    resLevel: 'RES 5,850',
    supLevel: 'SUP 5,760',
    scaleLabels: ['5,880', '5,850', '5,800', '5,780', '5,760', '5,740'],
  },
];

export const SECTOR_DETAILS = [
  {
    id: 'tech',
    name: '信息科技',
    weight: '40%',
    change: '+1.80%',
    isBull: true,
    status: '领涨',
    leaders: [
      { symbol: 'AAPL', name: '苹果公司', price: '$231.40', change: '+0.65%' },
      { symbol: 'MSFT', name: '微软公司', price: '$428.50', change: '+1.92%' },
      { symbol: 'GOOGL', name: 'Alphabet', price: '$168.90', change: '+2.14%' },
    ],
    summary: '云基础设施资本开支与企业级AI订阅收入双双超预期，大型科技股获机构买盘持续净流入。',
  },
  {
    id: 'semi',
    name: '半导体',
    weight: '25%',
    change: '+2.92%',
    isBull: true,
    status: '爆发',
    leaders: [
      { symbol: 'NVDA', name: '英伟达', price: '$138.25', change: '+3.12%' },
      { symbol: 'TSM', name: '台积电', price: '$192.40', change: '+2.85%' },
      { symbol: 'AVGO', name: '博通', price: '$181.20', change: '+2.40%' },
    ],
    summary: 'Blackwell架构机柜排产满载叠加CoWoS先进封装产能扩张，费城半导体指数领涨全市场。',
  },
  {
    id: 'fin',
    name: '金融银行业',
    weight: '20%',
    change: '+0.40%',
    isBull: true,
    status: '温和',
    leaders: [
      { symbol: 'JPM', name: '摩根大通', price: '$224.10', change: '+0.55%' },
      { symbol: 'BAC', name: '美国银行', price: '$41.80', change: '+0.32%' },
      { symbol: 'GS', name: '高盛集团', price: '$518.60', change: '+0.48%' },
    ],
    summary: '收益率曲线陡峭化改善净息差预期，投行并购与二级市场交易佣金维持稳健复苏。',
  },
  {
    id: 'energy',
    name: '传统能源',
    weight: '15%',
    change: '-0.82%',
    isBull: false,
    status: '承压',
    leaders: [
      { symbol: 'XOM', name: '埃克森美孚', price: '$119.40', change: '-0.75%' },
      { symbol: 'CVX', name: '雪佛龙', price: '$148.20', change: '-0.91%' },
      { symbol: 'SLB', name: '斯伦贝谢', price: '$42.60', change: '-1.10%' },
    ],
    summary: '受全球制造业PMI波动及非OPEC+供给预期影响，WTI原油短线回测支撑位，能源板块小幅回调。',
  },
];

export const CANDLESTICK_SERIES: CandleData[] = [
  { x: 20, open: 172, high: 165, low: 198, close: 190, isBull: false, volPct: 45, timeLabel: '09-25 04:00', priceOpen: '66,120.00', priceHigh: '66,350.00', priceLow: '65,680.00', priceClose: '65,890.00' },
  { x: 38, open: 182, high: 160, low: 190, close: 166, isBull: true, volPct: 60, timeLabel: '09-25 08:00', priceOpen: '65,890.00', priceHigh: '66,420.00', priceLow: '65,810.00', priceClose: '66,280.00' },
  { x: 56, open: 170, high: 148, low: 175, close: 152, isBull: true, volPct: 75, timeLabel: '09-25 12:00', priceOpen: '66,280.00', priceHigh: '66,680.00', priceLow: '66,190.00', priceClose: '66,540.00' },
  { x: 74, open: 150, high: 145, low: 172, close: 164, isBull: false, volPct: 30, timeLabel: '09-25 16:00', priceOpen: '66,540.00', priceHigh: '66,710.00', priceLow: '66,210.00', priceClose: '66,360.00' },
  { x: 92, open: 146, high: 135, low: 162, close: 149, isBull: true, isDoji: true, volPct: 15, timeLabel: '09-25 20:00', priceOpen: '66,360.00', priceHigh: '66,850.00', priceLow: '66,310.00', priceClose: '66,410.00' },
  { x: 110, open: 148, high: 118, low: 152, close: 122, isBull: true, volPct: 95, timeLabel: '09-26 00:00', priceOpen: '66,410.00', priceHigh: '67,120.00', priceLow: '66,390.00', priceClose: '66,980.00' },
  { x: 128, open: 132, high: 110, low: 138, close: 114, isBull: true, volPct: 80, timeLabel: '09-26 04:00', priceOpen: '66,980.00', priceHigh: '67,290.00', priceLow: '66,880.00', priceClose: '67,180.00' },
  { x: 146, open: 116, high: 112, low: 135, close: 128, isBull: false, volPct: 40, timeLabel: '09-26 08:00', priceOpen: '67,180.00', priceHigh: '67,250.00', priceLow: '66,920.00', priceClose: '67,010.00' },
  { x: 164, open: 118, high: 105, low: 136, close: 130, isBull: false, volPct: 35, timeLabel: '09-26 12:00', priceOpen: '67,010.00', priceHigh: '67,380.00', priceLow: '66,890.00', priceClose: '66,950.00' },
  { x: 182, open: 112, high: 95, low: 132, close: 98, isBull: true, volPct: 65, timeLabel: '09-26 16:00', priceOpen: '66,950.00', priceHigh: '67,490.00', priceLow: '66,910.00', priceClose: '67,410.00' },
  { x: 200, open: 104, high: 80, low: 108, close: 84, isBull: true, volPct: 85, timeLabel: '09-26 20:00', priceOpen: '67,410.00', priceHigh: '67,720.00', priceLow: '67,350.00', priceClose: '67,650.00' },
  { x: 218, open: 78, high: 70, low: 102, close: 94, isBull: false, volPct: 50, timeLabel: '09-27 00:00', priceOpen: '67,650.00', priceHigh: '67,880.00', priceLow: '67,420.00', priceClose: '67,510.00' },
  { x: 236, open: 88, high: 72, low: 96, close: 76, isBull: true, volPct: 60, timeLabel: '09-27 04:00', priceOpen: '67,510.00', priceHigh: '67,810.00', priceLow: '67,480.00', priceClose: '67,740.00' },
  { x: 254, open: 81, high: 58, low: 86, close: 62, isBull: true, volPct: 90, timeLabel: '09-27 08:00', priceOpen: '67,740.00', priceHigh: '67,980.00', priceLow: '67,690.00', priceClose: '67,910.00' },
  { x: 272, open: 60, high: 56, low: 78, close: 70, isBull: false, volPct: 25, timeLabel: '09-27 12:00', priceOpen: '67,910.00', priceHigh: '67,990.00', priceLow: '67,680.00', priceClose: '67,120.00' },
  { x: 290, open: 68, high: 46, low: 72, close: 48, isBull: true, volPct: 85, timeLabel: '09-27 16:00', priceOpen: '67,120.00', priceHigh: '67,950.00', priceLow: '67,050.00', priceClose: '67,842.50' },
];

export const ECONOMIC_EVENTS: EconomicEventItem[] = [
  {
    id: 'evt-1',
    time: '14:30',
    horizon: 'today',
    countryCode: 'US',
    flag: '🇺🇸',
    countryLabel: '美国',
    title: '初请失业金人数 (万人)',
    subtitle: '劳工部周度报告',
    impact: 'high',
    actual: '21.8万',
    actualTag: '利多美指',
    forecast: '22.5万',
    prior: '22.0万',
    reactionText: '好于预期 (-7K) · 劳动力市场韧性',
    statusText: '已完成',
  },
  {
    id: 'evt-2',
    time: '15:45',
    horizon: 'today',
    countryCode: 'EU',
    flag: '🇪🇺',
    countryLabel: '欧元区',
    title: '欧洲央行行长拉加德发表讲话',
    subtitle: '法兰克福全球银行家论坛',
    impact: 'high',
    isSpeech: true,
    speechTopic: '核心研讨主题: 货币政策与通胀目标路径',
    speechDesc: '聚焦10月管委会对降息节奏的最新指引。市场预期欧洲央行年内或再度降息25基点，警惕EUR/USD短线波动。',
  },
  {
    id: 'evt-3',
    time: '16:30',
    horizon: 'today',
    countryCode: 'US',
    flag: '🇺🇸',
    countryLabel: '美国',
    title: 'EIA 原油库存变动 (万桶)',
    subtitle: '能源信息署 (Weekly)',
    impact: 'medium',
    actual: '--',
    forecast: '-120.0万',
    prior: '-210.0万',
  },
  {
    id: 'evt-4',
    time: '20:00',
    horizon: 'today',
    countryCode: 'US',
    flag: '🇺🇸',
    countryLabel: '美国',
    title: '联邦政府预算月率 (十亿美元)',
    subtitle: '财政部例行公示',
    impact: 'low',
    prior: '-$380.0B',
    statusText: '常规监管披露',
  },
  {
    id: 'evt-5',
    time: '07:50',
    horizon: 'tmrw',
    countryCode: 'JP',
    flag: '🇯🇵',
    countryLabel: '日本',
    title: '日本央行货币政策会议纪要',
    subtitle: '日本央行 (BOJ)',
    impact: 'high',
    isSpeech: true,
    speechTopic: '核心研讨主题: 收益率曲线控制与加息路径评估',
    speechDesc: '重点关注委员对春季薪资谈判传导机制及日元汇率波动容忍度的表态。',
  },
  {
    id: 'evt-6',
    time: '20:30',
    horizon: 'tmrw',
    countryCode: 'US',
    flag: '🇺🇸',
    countryLabel: '美国',
    title: '美国 9月 核心PCE物价指数年率',
    subtitle: '经济分析局月度通胀核心指标',
    impact: 'high',
    actual: '--',
    forecast: '2.6%',
    prior: '2.7%',
  },
  {
    id: 'evt-7',
    time: '09:30',
    horizon: 'week',
    countryCode: 'JP',
    flag: '🇯🇵',
    countryLabel: '日本',
    title: '东京核心CPI年率 (YoY)',
    subtitle: '总务省统计局',
    impact: 'medium',
    actual: '--',
    forecast: '2.0%',
    prior: '2.4%',
  },
];

export const INITIAL_IDEAS: TradingIdea[] = [
  {
    id: 'idea-1',
    author: 'AlphaQuant_Desk',
    authorRole: '机构宏观策略师',
    symbol: 'BTC/USDT',
    timeframe: '4H',
    direction: 'BULLISH',
    title: 'BTC 4H级别EMA20动态支撑确认，放量冲击$68,000关键阻力带',
    summary: '链上稳定币净流入叠加美债收益率回落，BTC在$66,150完成多头清算回踩后形成看涨吞没结构。若4H收盘站稳$68,000上方，上方空间将打开至$70,400流动性池。',
    entryPrice: '$67,500',
    targetPrice: '$70,400',
    stopLoss: '$66,100',
    rrRatio: '1 : 2.07',
    likes: 128,
    liked: true,
    timestamp: '18分钟前',
    tags: ['订单流共振', 'EMA趋势', '宏观流动性'],
  },
  {
    id: 'idea-2',
    author: 'SemiConductor_Pro',
    authorRole: 'TMT买方研究员',
    symbol: 'NVDA',
    timeframe: '1D',
    direction: 'BULLISH',
    title: '英伟达财报前瞻：期权隐含波动率±7.8%，Blackwell出货指引成胜负手',
    summary: '当前数据中心毛利率市场一致预期为75%，北美四大云厂商CapEx指引均呈上修态势。日线级别突破$136颈线位，建议关注回调分批布局机会。',
    entryPrice: '$136.80',
    targetPrice: '$152.00',
    stopLoss: '$131.50',
    rrRatio: '1 : 2.86',
    likes: 94,
    liked: false,
    timestamp: '45分钟前',
    tags: ['财报催化剂', 'Gamma挤压', 'AI算力'],
  },
  {
    id: 'idea-3',
    author: 'FX_Macro_Flow',
    authorRole: 'G10外汇交易员',
    symbol: 'EUR/USD',
    timeframe: '1H',
    direction: 'BEARISH',
    title: '拉加德讲话前夕欧美利差走阔，EUR/USD受制于1.0900上方卖盘压制',
    summary: '欧元区制造业PMI持续位于荣枯线下方，市场定价10月降息概率升至80%以上，而美国初请失业金人数21.8万彰显韧性，短线偏空对待。',
    entryPrice: '1.08750',
    targetPrice: '1.07800',
    stopLoss: '1.09200',
    rrRatio: '1 : 2.11',
    likes: 61,
    liked: false,
    timestamp: '2小时前',
    tags: ['央行利差', '欧央行讲话', '阻力做空'],
  },
];
