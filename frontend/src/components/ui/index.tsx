import React from 'react';
import { motion } from 'framer-motion';

// ===== Animated Number =====
export const AnimatedNumber = ({ value, decimals = 1 }: { value: number; decimals?: number }) => (
  <motion.span
    key={value.toFixed(decimals)}
    initial={{ opacity: 0, y: -12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="inline-block tabular-nums"
  >
    {value.toFixed(decimals)}
  </motion.span>
);

// ===== Page Header =====
export const PageHeader = ({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
    <div>
      <h1 className="text-4xl font-black text-white mb-2 tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

// ===== KPI Card =====
interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  color?: 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const KpiCard = ({
  label,
  value,
  unit,
  trend,
  trendLabel,
  color = 'indigo',
  icon,
  size = 'md',
  className = '',
}: KpiCardProps) => {
  const colorMap = {
    indigo: { text: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    rose: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    slate: { text: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-700/50' },
  };
  const { text, bg, border } = colorMap[color];
  const valueSize = size === 'lg' ? 'text-5xl' : size === 'md' ? 'text-3xl' : 'text-xl';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`glass-card p-6 relative border ${border} flex flex-col justify-between min-h-[140px] ${className}`}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[24px] pointer-events-none">
        <div className={`absolute -top-12 -right-12 w-32 h-32 ${bg} rounded-full blur-2xl`} />
      </div>
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-start justify-between mb-4">
          <span className="text-sm font-bold tracking-wide text-slate-400">{label}</span>
          {icon && <span className={`${text} opacity-70`}>{icon}</span>}
        </div>
        
        <div className="mt-auto">
          <div className="font-black text-5xl text-white tracking-tight flex items-baseline gap-1.5 mb-2">
            {typeof value === 'number' ? <AnimatedNumber value={value} decimals={Number.isInteger(value) ? 0 : 1} /> : value}
            {unit && <span className={`text-lg font-medium ${text}`}>{unit}</span>}
          </div>
          
          <div className={`text-sm font-medium ${trend ? (trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-slate-500') : 'text-transparent select-none'}`}>
            {trend ? (trend === 'up' ? '↑ ' : trend === 'down' ? '↓ ' : '→ ') + trendLabel : '-'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ===== Severity Badge =====
export const SeverityBadge = ({ type }: { type: 'INFO' | 'WARNING' | 'CRITICAL' }) => {
  const map = {
    INFO: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
    WARNING: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    CRITICAL: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
  };
  return (
    <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border ${map[type]}`}>
      {type}
    </span>
  );
};

// ===== Status Badge =====
export const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    active: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    investigating: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    contained: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
    resolved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    draft: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
    published: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    archived: 'bg-slate-700/50 text-slate-500 border-slate-700/50',
  };
  return (
    <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border ${map[status] ?? map.draft}`}>
      {status}
    </span>
  );
};

// ===== Progress Bar =====
export const ProgressBar = ({
  value,
  max = 100,
  color = 'indigo',
  label,
  showValue = true,
}: {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
}) => {
  const percent = Math.min(100, (value / max) * 100);
  const gradients: Record<string, string> = {
    indigo: 'from-indigo-600 to-indigo-400',
    emerald: 'from-emerald-600 to-emerald-400',
    rose: 'from-rose-600 to-rose-400',
    amber: 'from-amber-600 to-amber-400',
    cyan: 'from-cyan-600 to-cyan-400',
    violet: 'from-violet-600 to-violet-400',
  };
  const grad = gradients[color] ?? gradients.indigo;

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-slate-400">{label}</span>}
          {showValue && <span className="text-xs font-mono text-slate-300">{value.toFixed(1)}{max === 100 ? '%' : ''}</span>}
        </div>
      )}
      <div className="progress-bar">
        <motion.div
          className={`progress-fill bg-gradient-to-r ${grad}`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// ===== Section Header =====
export const SectionHeader = ({
  title,
  subtitle,
  icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div className="flex items-start justify-between mb-4">
    <div>
      <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
        {icon && <span className="text-indigo-400">{icon}</span>}
        {title}
      </h2>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);

// ===== Live Indicator =====
export const LiveIndicator = ({ paused }: { paused: boolean }) => (
  <div className="flex items-center gap-2">
    <div className="relative flex items-center justify-center">
      <span className={`status-dot ${paused ? 'status-dot-yellow' : 'status-dot-green'}`} />
      {!paused && (
        <span className="absolute w-3 h-3 rounded-full bg-emerald-500 opacity-30 animate-ping" />
      )}
    </div>
    <span className={`text-xs font-semibold ${paused ? 'text-amber-400' : 'text-emerald-400'}`}>
      {paused ? 'PAUSED' : 'LIVE'}
    </span>
  </div>
);

// ===== Chip =====
export const Chip = ({ label, color = 'slate' }: { label: string; color?: string }) => {
  const colors: Record<string, string> = {
    slate: 'bg-slate-800/60 text-slate-400 border-slate-700/50',
    indigo: 'bg-indigo-900/30 text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-900/30 text-emerald-400 border-emerald-500/20',
    rose: 'bg-rose-900/30 text-rose-400 border-rose-500/20',
    amber: 'bg-amber-900/30 text-amber-400 border-amber-500/20',
    violet: 'bg-violet-900/30 text-violet-400 border-violet-500/20',
  };
  return (
    <span className={`text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full border ${colors[color] ?? colors.slate}`}>
      {label}
    </span>
  );
};

// ===== Score Ring =====
export const ScoreRing = ({ value, max = 100, size = 80, strokeWidth = 6, color = '#6366f1' }: {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / max) * circumference;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="#1e293b" strokeWidth={strokeWidth} fill="none" />
      <motion.circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke={color} strokeWidth={strokeWidth} fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  );
};

// ===== Divider =====
export const Divider = () => (
  <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-4" />
);

// ===== Card Components =====
export const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-slate-900/40 border border-slate-800/60 rounded-xl overflow-hidden backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle, className = '' }: { title: string; subtitle?: string; className?: string }) => (
  <div className={`px-5 py-4 border-b border-slate-800/60 ${className}`}>
    <h3 className="font-bold text-slate-100">{title}</h3>
    {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
  </div>
);

export const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-5 ${className}`}>
    {children}
  </div>
);
