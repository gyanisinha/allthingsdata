import React from 'react';
import { FILTER_OPTIONS } from '../data/mockData';
import { ChevronDown, Info } from 'lucide-react';

interface FilterBarProps {
  filters: {
    plant: string;
    zone: string;
    segment: string;
    period: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

const FilterSelect: React.FC<{
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}> = ({ options, value, onChange }) => (
  <div className="relative">
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="appearance-none bg-[#0f1a30] border border-[#1e2a4a] text-slate-300 text-[10px] font-semibold px-3 py-1.5 pr-7 rounded cursor-pointer hover:border-[#39ff14]/40 focus:outline-none focus:border-[#39ff14]/60 transition-colors"
    >
      {options.map(o => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
    <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
  </div>
);

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const asOfDate = '18 Mar 2026';

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 bg-[#080d1c] border-b border-[#0f1a30]">
      {/* Title */}
      <div className="mr-2">
        <h1 className="text-base font-bold text-white tracking-wide">Executive Overview</h1>
        <div className="text-[9px] text-slate-500 tracking-widest uppercase">Performance Dashboard · FY25</div>
      </div>

      <div className="w-px h-8 bg-[#1e2a4a] mx-1 hidden sm:block" />

      {/* Filters */}
      <FilterSelect
        label="Plant"
        options={FILTER_OPTIONS.plants}
        value={filters.plant}
        onChange={v => onFilterChange('plant', v)}
      />
      <FilterSelect
        label="Zone"
        options={FILTER_OPTIONS.zones}
        value={filters.zone}
        onChange={v => onFilterChange('zone', v)}
      />
      <FilterSelect
        label="Segment"
        options={FILTER_OPTIONS.segments}
        value={filters.segment}
        onChange={v => onFilterChange('segment', v)}
      />
      <FilterSelect
        label="Period"
        options={FILTER_OPTIONS.periods}
        value={filters.period}
        onChange={v => onFilterChange('period', v)}
      />

      {/* As-of indicator */}
      <div className="ml-auto flex items-center gap-1.5 text-[10px] text-slate-500">
        <Info size={11} />
        <span>As of <span className="text-slate-300 font-semibold">{asOfDate}</span></span>
      </div>
    </div>
  );
};
