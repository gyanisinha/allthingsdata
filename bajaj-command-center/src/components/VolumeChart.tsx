import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid,
} from 'recharts';
import { VOLUME_BY_SEGMENT } from '../data/mockData';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a0e1a] border border-[#1e2a4a] rounded px-3 py-2 text-[11px]">
      <div className="text-slate-400 mb-1">{label}</div>
      <div className="font-bold" style={{ color: payload[0].payload.color }}>
        {payload[0].value}L Units
      </div>
    </div>
  );
};

export const VolumeChart: React.FC = () => {
  const total = VOLUME_BY_SEGMENT.reduce((s, d) => s + d.volume, 0);

  return (
    <div className="glass-card rounded-xl p-4 border border-[#1e2a4a] flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">Volume by Segment</div>
          <div className="text-sm font-bold text-white mt-0.5">
            {total.toFixed(1)}L Units <span className="text-[10px] text-slate-400 font-normal">Total FY25</span>
          </div>
        </div>
        <div className="text-[10px] text-sky-400 font-semibold">Domestic + Export</div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={VOLUME_BY_SEGMENT} margin={{ top: 5, right: 5, bottom: 0, left: -20 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2a4a" vertical={false} />
          <XAxis dataKey="segment" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
            {VOLUME_BY_SEGMENT.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Segment legend dots */}
      <div className="flex flex-wrap gap-3">
        {VOLUME_BY_SEGMENT.map(seg => (
          <div key={seg.segment} className="flex items-center gap-1.5 text-[9px] text-slate-400">
            <span className="w-2 h-2 rounded-sm" style={{ background: seg.color }} />
            {seg.segment} <span className="font-bold text-slate-300">{seg.volume}L</span>
          </div>
        ))}
      </div>
    </div>
  );
};
