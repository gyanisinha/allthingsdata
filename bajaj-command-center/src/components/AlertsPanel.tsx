import React from 'react';
import { ALERTS } from '../data/mockData';
import { AlertTriangle, CheckCircle, XCircle, Bell } from 'lucide-react';

const iconMap = {
  red: <XCircle size={12} className="text-[#ff3b30] shrink-0 mt-0.5" />,
  yellow: <AlertTriangle size={12} className="text-[#ffd700] shrink-0 mt-0.5" />,
  green: <CheckCircle size={12} className="text-[#39ff14] shrink-0 mt-0.5" />,
};

const borderMap = {
  red: 'border-l-[#ff3b30]',
  yellow: 'border-l-[#ffd700]',
  green: 'border-l-[#39ff14]',
};

const bgMap = {
  red: 'bg-[#ff3b30]/5',
  yellow: 'bg-[#ffd700]/5',
  green: 'bg-[#39ff14]/5',
};

export const AlertsPanel: React.FC = () => (
  <div className="glass-card rounded-xl p-4 border border-[#1e2a4a] flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <div className="text-[10px] text-slate-500 uppercase tracking-widest">Live Alerts</div>
      <Bell size={13} className="text-slate-500" />
    </div>

    <div className="flex flex-col gap-1.5">
      {ALERTS.map(alert => (
        <div
          key={alert.id}
          className={`flex items-start gap-2 p-2 rounded border-l-2 ${borderMap[alert.severity as keyof typeof borderMap]} ${bgMap[alert.severity as keyof typeof bgMap]}`}
        >
          {iconMap[alert.severity as keyof typeof iconMap]}
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-slate-200 leading-snug">{alert.message}</div>
          </div>
          <div className="text-[9px] text-slate-500 shrink-0 font-mono">{alert.time}</div>
        </div>
      ))}
    </div>
  </div>
);
