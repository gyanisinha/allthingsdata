import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid,
} from 'recharts';
import { REVENUE_TREND } from '../data/mockData';
import { TrendingUp } from 'lucide-react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a0e1a] border border-[#1e2a4a] rounded px-3 py-2 text-[11px]">
      <div className="text-slate-400 mb-1 font-semibold">{label} FY25</div>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-300 capitalize">{p.name}:</span>
          <span className="font-bold" style={{ color: p.color }}>₹{p.value} Cr</span>
        </div>
      ))}
    </div>
  );
};

export const RevenueChart: React.FC = () => {
  const total = REVENUE_TREND.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="glass-card rounded-xl p-4 border border-[#1e2a4a] flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">Monthly Revenue</div>
          <div className="text-sm font-bold text-white mt-0.5">
            ₹{total.toLocaleString()} Cr <span className="text-[10px] text-slate-400 font-normal">YTD FY25</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-[#39ff14] font-semibold">
          <TrendingUp size={12} />
          +12.4% vs LY
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[9px] text-slate-400">
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-[#39ff14] inline-block" />Actual</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-[#ffd700] inline-block border-dashed" />Target</span>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={REVENUE_TREND} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#39ff14" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#39ff14" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="tgtGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffd700" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#ffd700" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2a4a" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={4500} stroke="#ffd700" strokeDasharray="4 4" strokeOpacity={0.4} />
          <Area type="monotone" dataKey="target" stroke="#ffd700" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#tgtGrad)" dot={false} name="Target" />
          <Area type="monotone" dataKey="revenue" stroke="#39ff14" strokeWidth={2} fill="url(#revGrad)" dot={{ r: 3, fill: '#39ff14', strokeWidth: 0 }} activeDot={{ r: 5 }} name="Revenue" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
