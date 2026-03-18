import React, { useState } from 'react';
import { NAV_TABS } from '../data/mockData';
import { useClock } from '../hooks/useClock';
import { Zap, RefreshCw } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { timeStr, dateStr } = useClock();
  const [autoRefresh, setAutoRefresh] = useState(true);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050810] border-b border-[#1e2a4a]">
      {/* Top row */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#0f1a30]">
        {/* Branding */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-black tracking-[0.25em] text-[#39ff14] uppercase">
              Bajaj Auto
            </span>
            <span className="text-[9px] tracking-[0.4em] text-slate-400 uppercase">
              Command Center
            </span>
          </div>
          <div className="w-px h-8 bg-[#1e2a4a]" />
          <div className="hidden sm:block">
            <div className="text-[8px] text-slate-500 uppercase tracking-widest">FY25 YTD Performance</div>
            <div className="text-[10px] text-slate-300 font-semibold">Executive Overview</div>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          {/* LIVE badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#39ff14]/30 bg-[#39ff14]/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] live-pulse" />
            <span className="text-[10px] font-bold text-[#39ff14] tracking-widest">LIVE</span>
          </div>

          {/* Clock */}
          <div className="hidden sm:flex flex-col items-end leading-none">
            <span className="text-xs font-mono text-[#39ff14] font-bold">{timeStr}</span>
            <span className="text-[9px] text-slate-500 mt-0.5">{dateStr} IST</span>
          </div>

          {/* Auto refresh toggle */}
          <button
            onClick={() => setAutoRefresh(v => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold tracking-widest border transition-all ${
              autoRefresh
                ? 'bg-sky-900/40 border-sky-500/50 text-sky-400'
                : 'bg-slate-800/40 border-slate-600/50 text-slate-500'
            }`}
          >
            <RefreshCw size={10} className={autoRefresh ? 'animate-spin' : ''} style={{ animationDuration: '3s' }} />
            AUTO
          </button>

          {/* User avatar placeholder */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#39ff14]/30 to-sky-500/30 border border-[#39ff14]/40 flex items-center justify-center">
            <Zap size={12} className="text-[#39ff14]" />
          </div>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="flex items-center overflow-x-auto scrollbar-hide px-4 gap-0.5 h-9">
        {NAV_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`whitespace-nowrap px-3 h-full text-[10px] font-semibold tracking-wide transition-all border-b-2 ${
              activeTab === tab
                ? 'text-[#39ff14] border-[#39ff14] bg-[#39ff14]/5'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </header>
  );
};
