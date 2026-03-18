import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts';
import { PRODUCTION_DATA, PLANT_UTILISATION } from '../data/mockData';
import { Factory } from 'lucide-react';

export const ProductionPanel: React.FC = () => (
  <div className="glass-card rounded-xl p-4 border border-[#1e2a4a] flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-[10px] text-slate-500 uppercase tracking-widest">Production & Dispatch</div>
        <div className="text-sm font-bold text-white mt-0.5">Last 6 Months</div>
      </div>
      <Factory size={16} className="text-slate-500" />
    </div>

    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={PRODUCTION_DATA} margin={{ top: 5, right: 5, bottom: 0, left: -20 }} barCategoryGap="25%">
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2a4a" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#0a0e1a', border: '1px solid #1e2a4a', borderRadius: 6, fontSize: 11 }}
          labelStyle={{ color: '#94a3b8' }}
        />
        <Legend wrapperStyle={{ fontSize: 9, color: '#64748b' }} />
        <Bar dataKey="production" fill="#00d4ff" fillOpacity={0.8} radius={[3, 3, 0, 0]} name="Production" />
        <Bar dataKey="dispatch" fill="#39ff14" fillOpacity={0.8} radius={[3, 3, 0, 0]} name="Dispatch" />
      </BarChart>
    </ResponsiveContainer>

    {/* Plant utilisation bars */}
    <div>
      <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-2">Plant Utilisation</div>
      <div className="flex flex-col gap-2">
        {PLANT_UTILISATION.map(p => {
          const color = p.utilisation >= 90 ? '#39ff14' : p.utilisation >= 80 ? '#ffd700' : '#ff3b30';
          return (
            <div key={p.plant} className="flex items-center gap-2">
              <span className="text-[9px] text-slate-400 w-16 shrink-0">{p.plant}</span>
              <div className="flex-1 h-1.5 bg-[#1e2a4a] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${p.utilisation}%`, background: color }}
                />
              </div>
              <span className="text-[9px] font-bold w-8 text-right" style={{ color }}>{p.utilisation}%</span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);
