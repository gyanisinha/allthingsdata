import React from 'react';
import { KPI_DATA, type KPI } from '../data/mockData';
import { TrendingUp, TrendingDown } from 'lucide-react';

const colorMap = {
  green: { text: 'text-[#39ff14]', border: 'border-[#39ff14]/25', glow: 'shadow-[0_0_14px_rgba(57,255,20,0.2)]', badge: 'bg-[#39ff14]/10 text-[#39ff14]' },
  yellow: { text: 'text-[#ffd700]', border: 'border-[#ffd700]/25', glow: 'shadow-[0_0_14px_rgba(255,215,0,0.2)]', badge: 'bg-[#ffd700]/10 text-[#ffd700]' },
  red: { text: 'text-[#ff3b30]', border: 'border-[#ff3b30]/25', glow: 'shadow-[0_0_14px_rgba(255,59,48,0.2)]', badge: 'bg-[#ff3b30]/10 text-[#ff3b30]' },
};

const KPICard: React.FC<{ kpi: KPI }> = ({ kpi }) => {
  const c = colorMap[kpi.color];
  const isPositive = kpi.change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? 'text-[#39ff14]' : 'text-[#ff3b30]';

  return (
    <div className={`glass-card rounded-lg p-3 flex flex-col gap-1.5 border ${c.border} ${c.glow} transition-all hover:scale-[1.02] cursor-default`}>
      <div className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">{kpi.label}</div>
      <div className={`text-xl font-black ${c.text} leading-none`}>{kpi.value}</div>
      <div className="text-[9px] text-slate-500">{kpi.sub}</div>
      <div className={`flex items-center gap-1 text-[10px] font-bold ${trendColor}`}>
        <TrendIcon size={10} />
        <span>{isPositive ? '+' : ''}{kpi.change}{kpi.unit === '%' ? 'pp' : '%'} YoY</span>
      </div>
    </div>
  );
};

export const KPIRow: React.FC = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 px-4 py-3">
    {KPI_DATA.map(kpi => (
      <KPICard key={kpi.label} kpi={kpi} />
    ))}
  </div>
);
