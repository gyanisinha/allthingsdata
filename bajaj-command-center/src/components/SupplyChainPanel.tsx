import React from 'react';
import { SUPPLY_CHAIN_METRICS, FINANCE_SNAPSHOT } from '../data/mockData';
import { DollarSign, Truck } from 'lucide-react';

export const SupplyChainPanel: React.FC = () => (
  <div className="glass-card rounded-xl p-4 border border-[#1e2a4a] flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <div className="text-[10px] text-slate-500 uppercase tracking-widest">Supply Chain Health</div>
      <Truck size={14} className="text-slate-500" />
    </div>

    <div className="grid grid-cols-2 gap-2">
      {SUPPLY_CHAIN_METRICS.map(m => {
        const pct = (m.value / m.target) * 100;
        const color = pct >= 99 ? '#39ff14' : pct >= 95 ? '#ffd700' : '#ff3b30';
        return (
          <div key={m.label} className="bg-[#0f1a30] rounded-lg p-2.5">
            <div className="text-[9px] text-slate-400 mb-1">{m.label}</div>
            <div className="flex items-end gap-1">
              <span className="text-base font-black" style={{ color }}>{m.value}</span>
              <span className="text-[9px] text-slate-500 mb-0.5">{m.unit}</span>
            </div>
            <div className="h-1 bg-[#1e2a4a] rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(pct, 100)}%`, background: color }}
              />
            </div>
            <div className="flex justify-between text-[8px] text-slate-500 mt-0.5">
              <span>Tgt: {m.target}{m.unit}</span>
              <span style={{ color }}>{pct.toFixed(1)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export const FinancePanel: React.FC = () => (
  <div className="glass-card rounded-xl p-4 border border-[#1e2a4a] flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <div className="text-[10px] text-slate-500 uppercase tracking-widest">Finance Snapshot</div>
      <DollarSign size={14} className="text-slate-500" />
    </div>

    <div className="grid grid-cols-2 gap-2">
      {FINANCE_SNAPSHOT.map(f => (
        <div key={f.label} className="bg-[#0f1a30] rounded-lg p-2.5">
          <div className="text-[9px] text-slate-400 mb-1">{f.label}</div>
          <div className="text-sm font-black text-white">{f.value}</div>
          <div className={`text-[9px] font-bold mt-1 ${f.trend === 'up' ? 'text-[#39ff14]' : 'text-[#ff3b30]'}`}>
            {f.trend === 'up' ? '▲' : '▼'} vs LY
          </div>
        </div>
      ))}
    </div>
  </div>
);
