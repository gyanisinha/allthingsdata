// ── Mock data for Bajaj Auto Command Center ──────────────────────────────────

export const NAV_TABS = [
  'Executive',
  'B2B Sales',
  'Retail',
  'Dealer Net',
  'Supply Chain',
  'Production',
  'Products & EV',
  'Finance',
  'International',
  'People & ESG',
];

export const FILTER_OPTIONS = {
  plants: ['All Plants', 'Chakan', 'Waluj', 'Pantnagar', 'Akurdi'],
  zones: ['All Zones', 'North', 'South', 'East', 'West', 'International'],
  segments: ['All Segments', '2W', '3W', 'EV', 'Exports'],
  periods: ['FY25 YTD', 'FY24 YTD', 'Q4 FY25', 'Q3 FY25', 'MTD'],
};

export interface KPI {
  label: string;
  value: string;
  sub: string;
  change: number; // % YoY
  unit: string;
  color: 'green' | 'yellow' | 'red';
}

export const KPI_DATA: KPI[] = [
  { label: 'Total Revenue', value: '₹48,230', sub: 'Cr YTD', change: 12.4, unit: 'Cr', color: 'green' },
  { label: 'EBITDA Margin', value: '19.8%', sub: 'vs 18.2% LY', change: 1.6, unit: '%', color: 'green' },
  { label: 'Total Volume', value: '54.2L', sub: 'Units Sold', change: 8.7, unit: 'units', color: 'green' },
  { label: 'EV Share', value: '14.3%', sub: 'of Domestic Mix', change: 4.2, unit: '%', color: 'yellow' },
  { label: 'Export Volume', value: '21.8L', sub: 'Units Exported', change: 6.1, unit: 'units', color: 'green' },
  { label: 'Market Share', value: '32.4%', sub: '2W + 3W Dom.', change: -0.8, unit: '%', color: 'red' },
  { label: 'Dealer RONW', value: '22.1%', sub: 'Avg Dealer', change: 2.3, unit: '%', color: 'green' },
  { label: 'Inventory Days', value: '18.4', sub: 'Days Stock', change: -2.1, unit: 'days', color: 'green' },
];

// ── Revenue trend (monthly) ───────────────────────────────────────────────────
export const REVENUE_TREND = [
  { month: 'Apr', revenue: 3820, target: 3700 },
  { month: 'May', revenue: 4050, target: 3900 },
  { month: 'Jun', revenue: 3940, target: 4000 },
  { month: 'Jul', revenue: 4210, target: 4100 },
  { month: 'Aug', revenue: 4480, target: 4300 },
  { month: 'Sep', revenue: 4620, target: 4500 },
  { month: 'Oct', revenue: 4810, target: 4700 },
  { month: 'Nov', revenue: 4390, target: 4600 },
  { month: 'Dec', revenue: 3980, target: 4200 },
  { month: 'Jan', revenue: 4550, target: 4400 },
  { month: 'Feb', revenue: 4730, target: 4650 },
  { month: 'Mar', revenue: 4850, target: 4800 },
];

// ── Volume by segment ─────────────────────────────────────────────────────────
export const VOLUME_BY_SEGMENT = [
  { segment: '2W Dom', volume: 22.4, color: '#39ff14' },
  { segment: '3W Dom', volume: 8.2, color: '#ffd700' },
  { segment: 'EV', volume: 7.8, color: '#00d4ff' },
  { segment: '2W Exp', volume: 9.6, color: '#ff6b35' },
  { segment: '3W Exp', volume: 6.2, color: '#bf5af2' },
];

// ── Production vs dispatch ────────────────────────────────────────────────────
export const PRODUCTION_DATA = [
  { month: 'Oct', production: 5200, dispatch: 4980 },
  { month: 'Nov', production: 4800, dispatch: 4650 },
  { month: 'Dec', production: 4400, dispatch: 4200 },
  { month: 'Jan', production: 5100, dispatch: 4900 },
  { month: 'Feb', production: 5350, dispatch: 5180 },
  { month: 'Mar', production: 5600, dispatch: 5420 },
];

// ── Regional performance ──────────────────────────────────────────────────────
export interface RegionData {
  region: string;
  volume: number;
  growth: number;
  share: number;
}

export const REGIONAL_DATA: RegionData[] = [
  { region: 'North', volume: 14.2, growth: 9.3, share: 26.2 },
  { region: 'West', volume: 16.8, growth: 11.4, share: 31.0 },
  { region: 'South', volume: 13.6, growth: 7.8, share: 25.1 },
  { region: 'East', volume: 9.6, growth: 6.2, share: 17.7 },
];

// ── Top products ──────────────────────────────────────────────────────────────
export interface Product {
  name: string;
  segment: string;
  volume: number;
  growth: number;
  revenue: number;
}

export const TOP_PRODUCTS: Product[] = [
  { name: 'Pulsar 125', segment: '2W', volume: 8.4, growth: 15.2, revenue: 4820 },
  { name: 'CT 110', segment: '2W', volume: 7.2, growth: 6.8, revenue: 2950 },
  { name: 'Chetak EV', segment: 'EV', volume: 5.6, growth: 142.3, revenue: 5430 },
  { name: 'RE CNG', segment: '3W', volume: 4.8, growth: 12.1, revenue: 3610 },
  { name: 'Dominar 400', segment: '2W', volume: 3.2, growth: 22.4, revenue: 4240 },
  { name: 'Qute', segment: '3W', volume: 2.8, growth: -4.2, revenue: 1980 },
];

// ── Supply chain health ───────────────────────────────────────────────────────
export const SUPPLY_CHAIN_METRICS = [
  { label: 'On-Time Delivery', value: 94.2, target: 95, unit: '%' },
  { label: 'Supplier OTIF', value: 91.8, target: 93, unit: '%' },
  { label: 'Raw Material Cover', value: 28, target: 30, unit: 'days' },
  { label: 'WIP Turns', value: 18.4, target: 20, unit: 'x' },
];

// ── Plant utilisation ─────────────────────────────────────────────────────────
export const PLANT_UTILISATION = [
  { plant: 'Chakan', utilisation: 94, capacity: 2400 },
  { plant: 'Waluj', utilisation: 88, capacity: 1800 },
  { plant: 'Pantnagar', utilisation: 76, capacity: 1200 },
  { plant: 'Akurdi', utilisation: 82, capacity: 600 },
];

// ── Finance snapshot ──────────────────────────────────────────────────────────
export const FINANCE_SNAPSHOT = [
  { label: 'Free Cash Flow', value: '₹8,420 Cr', trend: 'up' },
  { label: 'Net Debt / Equity', value: '0.12x', trend: 'down' },
  { label: 'ROCE', value: '28.4%', trend: 'up' },
  { label: 'EPS (diluted)', value: '₹312', trend: 'up' },
];

// ── Alerts ────────────────────────────────────────────────────────────────────
export const ALERTS = [
  { id: 1, severity: 'red', message: 'Waluj plant line-3 downtime > 4 hrs', time: '07:18' },
  { id: 2, severity: 'yellow', message: 'Chetak EV – dealer stock < 5 days in West zone', time: '06:45' },
  { id: 3, severity: 'yellow', message: 'RE CNG: Export dispatch delayed – Mumbai port congestion', time: '05:30' },
  { id: 4, severity: 'green', message: 'Pulsar 125: Monthly dispatch target achieved (100.4%)', time: '04:12' },
  { id: 5, severity: 'green', message: 'Q4 Revenue on track – 98.6% of plan through Feb', time: '03:00' },
];
