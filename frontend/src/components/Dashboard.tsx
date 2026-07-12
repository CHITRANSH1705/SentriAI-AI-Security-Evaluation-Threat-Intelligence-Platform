import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../context/SimulationContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend,
  BarChart, Bar,
} from 'recharts';
import {
  ShieldCheckIcon, ExclamationTriangleIcon, CpuChipIcon,
  ClockIcon, SignalIcon,
} from '@heroicons/react/24/outline';
import {
  KpiCard, SeverityBadge, ProgressBar, SectionHeader, ScoreRing, AnimatedNumber, PageHeader,
} from './ui';

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-sm shadow-xl">
      <p className="text-slate-400 mb-2 font-bold">Round {label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-mono">
          {p.name}: {Number(p.value).toFixed(2)}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { state } = useSimulation();

  const radarData = [
    { subject: 'Policy', value: state.complianceScore, baseline: 100 },
    { subject: 'Consistency', value: state.consistencyScore, baseline: 100 },
    { subject: 'Safety', value: 100 - state.driftScore * 80, baseline: 100 },
    { subject: 'Hallucination', value: 100 - state.hallucinationRisk * 120, baseline: 100 },
    { subject: 'Context', value: 94.5, baseline: 100 },
  ];

  const atlasBarData = state.atlasDistribution.map(m => ({
    name: m.technique.length > 14 ? m.technique.slice(0, 13) + '…' : m.technique,
    count: m.count,
  }));

  const scoreColor = state.securityScore >= 90 ? '#10b981' : state.securityScore >= 75 ? '#f59e0b' : '#f43f5e';
  const scoreGrade = state.securityScore >= 90 ? 'A+' : state.securityScore >= 80 ? 'B' : state.securityScore >= 70 ? 'C' : 'D';

  return (
    <div className="flex flex-col gap-6">
      
      <PageHeader 
        title="SOC Overview" 
        subtitle="Real-time telemetry and defensive posturing for the language model environment"
      />

      {/* ===== Row 1: KPI Metrics ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-12 gap-6 items-stretch">
        {/* Big Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="sm:col-span-2 lg:col-span-3 xl:col-span-4 glass-card-highlight p-6 relative flex flex-col justify-between"
        >
          {/* Isolated Background Glows */}
          <div className="absolute inset-0 overflow-hidden rounded-[24px] pointer-events-none">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -left-10 w-40 h-40 bg-violet-600/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex items-start justify-between mb-6">
            <div>
              <p className="text-sm font-bold tracking-wide text-slate-400 mb-1">AI Security Score</p>
              <p className="text-slate-500 text-sm">Composite behavioural trust index</p>
            </div>
            <span className={`px-3 py-1 rounded-lg text-sm font-black border ${
              state.securityScore >= 90
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : state.securityScore >= 75
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              {scoreGrade}
            </span>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 flex-1">
            <div className="relative flex items-center justify-center shrink-0">
              <ScoreRing value={state.securityScore} size={112} strokeWidth={8} color={scoreColor} />
              <div className="absolute text-center">
                <div className="text-3xl font-black text-white leading-none">
                  <AnimatedNumber value={state.securityScore} />
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-4 w-full">
              <ProgressBar value={state.complianceScore} label="Compliance" color="emerald" />
              <ProgressBar value={state.consistencyScore} label="Consistency" color="indigo" />
              <ProgressBar value={100 - state.driftScore * 100} label="Stability" color="violet" />
            </div>
          </div>
        </motion.div>

        {/* Small KPI Cards */}
        <KpiCard
          label="Hallucination Risk"
          value={state.hallucinationRisk * 100}
          unit="%"
          color="rose"
          icon={<ExclamationTriangleIcon className="w-5 h-5" />}
          trend={state.hallucinationRisk > 0.15 ? 'down' : 'up'}
          trendLabel={state.hallucinationRisk > 0.15 ? 'Above threshold' : 'Normal range'}
          className="xl:col-span-2"
        />
        <KpiCard
          label="Model Latency"
          value={state.modelLatencyMs}
          unit="ms"
          color={state.modelLatencyMs > 600 ? 'rose' : 'emerald'}
          icon={<ClockIcon className="w-5 h-5" />}
          trend={state.modelLatencyMs > 500 ? 'down' : 'neutral'}
          trendLabel={state.modelLatencyMs > 500 ? 'Degraded' : 'Healthy'}
          className="xl:col-span-2"
        />
        <KpiCard
          label="Drift Score"
          value={state.driftScore * 100}
          unit="%"
          color={state.driftScore > 0.2 ? 'rose' : 'amber'}
          icon={<SignalIcon className="w-5 h-5" />}
          className="xl:col-span-2"
        />
        <KpiCard
          label="Tokens Analysed"
          value={Math.floor(state.tokensAnalyzed / 1000)}
          unit="K"
          color="slate"
          icon={<CpuChipIcon className="w-5 h-5" />}
          className="xl:col-span-2"
        />
      </div>

      {/* ===== Row 2: Charts ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* DNA Fingerprint Radar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6 flex flex-col lg:col-span-4 min-h-[380px]"
        >
          <SectionHeader
            title="Model DNA Fingerprint"
            subtitle="Multidimensional trust profile"
            icon={<ShieldCheckIcon className="w-5 h-5" />}
          />
          <div className="flex-1 relative w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius="72%" data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis tick={false} axisLine={false} tickLine={false} />
                <Radar name="Baseline" dataKey="baseline" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.08} />
                <Radar name="Current" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Behavioral Evolution Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 flex flex-col lg:col-span-8 min-h-[380px]"
        >
          <SectionHeader
            title="Behavioral Evolution"
            subtitle="Real-time semantic drift tracking over simulation rounds"
          />
          <div className="flex-1 relative w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={state.history} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gSecurity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gCompliance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
                <XAxis dataKey="round" stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} />
                <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} domain={[70, 105]} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="securityScore" name="Security" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#gSecurity)" dot={false} isAnimationActive={false} />
                <Area type="monotone" dataKey="complianceScore" name="Compliance" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#gCompliance)" dot={false} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ===== Row 3: Live Data ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ATLAS Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-6 flex flex-col lg:col-span-4 min-h-[380px]"
        >
          <SectionHeader title="MITRE ATLAS Distribution" subtitle="Technique detection frequency" />
          <div className="flex-1 relative w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={atlasBarData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <XAxis type="number" stroke="#334155" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke="#334155" tick={{ fill: '#94a3b8', fontSize: 12 }} width={100} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', fontSize: 14 }}
                  cursor={{ fill: 'rgba(99,102,241,0.06)' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Live Event Feed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 flex flex-col lg:col-span-8 min-h-[380px]"
        >
          <SectionHeader title="Security Event Feed" subtitle="Real-time analyst events" />
          <div className="flex-1 overflow-y-auto space-y-4 pr-3 min-h-[250px]">
            <AnimatePresence>
              {state.events.slice(0, 12).map(evt => (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, x: -16, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, scale: 0.95, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`p-4 rounded-xl border flex gap-4 items-start ${
                    evt.type === 'CRITICAL'
                      ? 'bg-rose-500/8 border-rose-500/15'
                      : evt.type === 'WARNING'
                      ? 'bg-amber-500/8 border-amber-500/15'
                      : 'bg-slate-800/30 border-slate-700/40'
                  }`}
                >
                  <div className="text-xs font-mono text-slate-500 mt-1 whitespace-nowrap">{evt.timestamp}</div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5"><SeverityBadge type={evt.type} /></div>
                    <p className="text-sm text-slate-300 leading-snug">{evt.message}</p>
                    {evt.source && <p className="text-xs text-slate-600 mt-1">{evt.source}</p>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* ===== Row 4: Explainable AI Panel ===== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-card p-6 flex flex-col"
      >
        <SectionHeader
          title="Explainable AI Diagnostics"
          subtitle="Last triggered decision with reasoning trace"
          icon={<ExclamationTriangleIcon className="w-5 h-5" />}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800">
            <div className="text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Trigger Reason</div>
            <div className="text-sm text-slate-200">Behavioural Drift Exceeded Safety Margin</div>
          </div>
          <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800">
            <div className="text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Similarity Drop</div>
            <div className="text-2xl font-black text-rose-400 font-mono">0.93 → 0.67</div>
          </div>
          <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800">
            <div className="text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Confidence</div>
            <div className="text-2xl font-black text-emerald-400 font-mono">98.2%</div>
          </div>
          <div className="bg-indigo-900/15 p-5 rounded-xl border border-indigo-500/20">
            <div className="text-xs uppercase tracking-widest text-indigo-400 mb-2 font-bold">Recommendation</div>
            <div className="text-sm text-indigo-200 leading-relaxed">Isolate conversational memory buffer — flag session <span className="font-mono">0x8F2</span> for review.</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
