import React from 'react';
import { REGIONAL_DATA, TOP_PRODUCTS } from '../data/mockData';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const RegionalPanel: React.FC = () => (
  <div className="glass-card rounded-xl p-4 border border-[#1e2a4a] flex flex-col gap-3">
    <div className="text-[10px] text-slate-500 uppercase tracking-widest">Regional Performance</div>

    <div className="grid grid-cols-2 gap-2">
      {REGIONAL_DATA.map(r => {
        const isUp = r.growth >= 0;
        return (
          <div key={r.region} className="bg-[#0f1a30] rounded-lg p-2.5 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-300">{r.region}</span>
              <span className={`flex items-center gap-0.5 text-[9px] font-bold ${isUp ? 'text-[#39ff14]' : 'text-[#ff3b30]'}`}>
                {isUp ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
                {isUp ? '+' : ''}{r.growth}%
              </span>
            </div>
            <div className="text-base font-black text-white">{r.volume}L</div>
            <div className="text-[9px] text-slate-500">{r.share}% share</div>
            {/* Mini progress bar */}
            <div className="h-1 bg-[#1e2a4a] rounded-full mt-1">
              <div className="h-full bg-[#39ff14]/70 rounded-full" style={{ width: `${r.share}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export const TopProductsPanel: React.FC = () => (
  <div className="glass-card rounded-xl p-4 border border-[#1e2a4a] flex flex-col gap-3">
    <div className="text-[10px] text-slate-500 uppercase tracking-widest">Top Products</div>

    <div className="overflow-x-auto">
      <table className="w-full text-[10px] border-collapse">
        <thead>
          <tr className="text-[9px] text-slate-500 uppercase tracking-wide border-b border-[#1e2a4a]">
            <th className="text-left py-1.5 pr-2">Product</th>
            <th className="text-center">Seg</th>
            <th className="text-right">Vol (L)</th>
            <th className="text-right">Growth</th>
            <th className="text-right">Rev (Cr)</th>
          </tr>
        </thead>
        <tbody>
          {TOP_PRODUCTS.map((p, i) => {
            const isUp = p.growth >= 0;
            return (
              <tr key={p.name} className={`border-b border-[#0f1a30] ${i % 2 === 0 ? '' : 'bg-[#0a1122]'}`}>
                <td className="py-1.5 pr-2 font-semibold text-slate-200">{p.name}</td>
                <td className="text-center">
                  <span className="px-1 py-0.5 rounded text-[8px] font-bold bg-sky-900/40 text-sky-400">{p.segment}</span>
                </td>
                <td className="text-right text-slate-300">{p.volume}</td>
                <td className={`text-right font-bold ${isUp ? 'text-[#39ff14]' : 'text-[#ff3b30]'}`}>
                  {isUp ? '+' : ''}{p.growth}%
                </td>
                <td className="text-right text-slate-300">{p.revenue.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);
