import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../context/SimulationContext';
import { SeverityBadge, StatusBadge, SectionHeader, ProgressBar, KpiCard, PageHeader } from './ui';
import {
  GlobeAltIcon, ShieldExclamationIcon, MagnifyingGlassIcon,
  FunnelIcon, FireIcon, ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import type { ThreatStatus, EventSeverity } from '../types';

const TECHNIQUE_DETAILS: Record<string, { name: string; tactic: string; mitigation: string }> = {
  'AML.T0051.000': { name: 'LLM Prompt Injection', tactic: 'Initial Access', mitigation: 'Input validation, prompt hardening, output filtering' },
  'AML.T0024.001': { name: 'Infer Training Data Membership', tactic: 'Exfiltration', mitigation: 'Differential privacy, output rate limiting' },
  'AML.T0048.003': { name: 'Jailbreak ML Model', tactic: 'Defense Evasion', mitigation: 'RLHF-enhanced safety training, red-team testing' },
  'AML.T0054.002': { name: 'LLM Context Manipulation', tactic: 'Impact', mitigation: 'Context window integrity checks, session isolation' },
  'AML.T0044.001': { name: 'Backdoor ML Model', tactic: 'Persistence', mitigation: 'Model fingerprinting, adversarial training' },
  'AML.T0005.000': { name: 'Adversarial Example Crafting', tactic: 'Evasion', mitigation: 'Adversarial training, input preprocessing' },
};

const STATUS_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Investigating', value: 'investigating' },
  { label: 'Contained', value: 'contained' },
  { label: 'Resolved', value: 'resolved' },
];

const SEV_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'All', value: 'all' },
  { label: 'Critical', value: 'CRITICAL' },
  { label: 'Warning', value: 'WARNING' },
  { label: 'Info', value: 'INFO' },
];

export default function ThreatsPage() {
  const { state } = useSimulation();
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const threats = state.threats.filter(t => {
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchSev = severityFilter === 'all' || t.severity === severityFilter;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.technique.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSev && matchSearch;
  });

  const selectedThreat = threats.find(t => t.id === selected) ?? threats[0];
  const techniqueInfo = selectedThreat ? TECHNIQUE_DETAILS[selectedThreat.technique] : null;

  const counts = {
    total: state.threats.length,
    active: state.threats.filter(t => t.status === 'active').length,
    critical: state.threats.filter(t => t.severity === 'CRITICAL').length,
    resolved: state.threats.filter(t => t.status === 'resolved').length,
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Page Header */}
      <PageHeader
        title="Threat Intelligence"
        subtitle="MITRE ATLAS–mapped adversarial ML detections and active investigations"
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        <KpiCard label="Total Threats" value={counts.total} color="slate" icon={<GlobeAltIcon className="w-5 h-5" />} />
        <KpiCard label="Active" value={counts.active} color="rose" icon={<FireIcon className="w-5 h-5" />} />
        <KpiCard label="Critical" value={counts.critical} color="rose" icon={<ShieldExclamationIcon className="w-5 h-5" />} />
        <KpiCard label="Resolved" value={counts.resolved} color="emerald" icon={<ShieldExclamationIcon className="w-5 h-5 opacity-0" />} />
      </div>

      {/* Main content: list + detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* Threat List */}
        <div className="lg:col-span-7 glass-card p-6 flex flex-col gap-4">
          <SectionHeader title="Detected Threats" icon={<ShieldExclamationIcon className="w-5 h-5" />} />

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-2">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search threats or techniques…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition"
              />
            </div>
            {/* Status filter */}
            <div className="flex gap-1.5 items-center">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === opt.value ? 'bg-indigo-600 text-white' : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Severity filter pills */}
          <div className="flex gap-2">
            {SEV_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSeverityFilter(opt.value)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all border ${
                  severityFilter === opt.value
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    : 'bg-transparent border-slate-700/50 text-slate-500 hover:border-slate-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Threats list */}
          <div className="overflow-y-auto space-y-3 max-h-[500px] pr-2 mt-2">
            <AnimatePresence>
              {threats.map((threat, i) => (
                <motion.div
                  key={threat.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelected(threat.id)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all ${
                    (selected ?? threats[0]?.id) === threat.id
                      ? 'border-indigo-500/40 bg-indigo-500/10'
                      : 'border-slate-800/60 bg-slate-900/30 hover:border-slate-700/60 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-slate-100 leading-snug mb-2">{threat.name}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] text-slate-500">{threat.technique}</span>
                        <StatusBadge status={threat.status} />
                        <SeverityBadge type={threat.severity} />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm text-slate-500 mb-1 font-mono">{threat.detectedAt}</div>
                      <div className="text-sm font-bold text-slate-300">{threat.confidence}%</div>
                    </div>
                  </div>
                  {/* Confidence bar */}
                  <div className="mt-3">
                    <ProgressBar value={threat.confidence} label="" showValue={false} color={threat.severity === 'CRITICAL' ? 'rose' : threat.severity === 'WARNING' ? 'amber' : 'indigo'} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {threats.length === 0 && (
              <div className="text-center py-16 text-slate-500 text-sm">No threats match the current filters</div>
            )}
          </div>
        </div>

        {/* Threat Detail Panel */}
        <div className="lg:col-span-5 glass-card p-6">
          {selectedThreat ? (
            <motion.div
              key={selectedThreat.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full flex flex-col gap-6"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <SeverityBadge type={selectedThreat.severity} />
                  <StatusBadge status={selectedThreat.status} />
                </div>
                <h3 className="text-xl font-bold text-white leading-snug mb-3">{selectedThreat.name}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{selectedThreat.description}</p>
              </div>

              <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4 space-y-4">
                <div>
                  <div className="text-xs uppercase tracking-widest text-slate-600 mb-1 font-bold">ATLAS Technique</div>
                  <div className="font-mono text-sm text-indigo-400">{selectedThreat.technique}</div>
                </div>
                {techniqueInfo && (
                  <>
                    <div>
                      <div className="text-xs uppercase tracking-widest text-slate-600 mb-1 font-bold">Technique Name</div>
                      <div className="text-sm text-slate-300">{techniqueInfo.name}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest text-slate-600 mb-1 font-bold">Tactic Phase</div>
                      <div className="text-sm text-slate-300">{techniqueInfo.tactic}</div>
                    </div>
                  </>
                )}
                <div>
                  <div className="text-xs uppercase tracking-widest text-slate-600 mb-1 font-bold">Detected At</div>
                  <div className="text-sm font-mono text-slate-400">{selectedThreat.detectedAt}</div>
                </div>
              </div>

              {/* Confidence meter */}
              <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4">
                <div className="flex justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest text-slate-600 font-bold">Detection Confidence</span>
                  <span className="text-sm font-bold text-white">{selectedThreat.confidence}%</span>
                </div>
                <ProgressBar value={selectedThreat.confidence} showValue={false} color={selectedThreat.severity === 'CRITICAL' ? 'rose' : 'amber'} />
              </div>

              {/* Mitigation */}
              {techniqueInfo && (
                <div className="bg-indigo-900/15 rounded-xl border border-indigo-500/20 p-4">
                  <div className="text-xs uppercase tracking-widest text-indigo-500 mb-2 font-bold">Recommended Mitigations</div>
                  <p className="text-sm text-indigo-200 leading-relaxed">{techniqueInfo.mitigation}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-auto pt-4">
                <button className="flex-1 py-3 rounded-xl border border-rose-500/30 text-rose-400 text-sm font-semibold hover:bg-rose-500/10 transition-all">
                  Escalate Alert
                </button>
                <button className="flex-1 py-3 rounded-xl border border-emerald-500/30 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/10 transition-all">
                  Mark as Resolved
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-600 text-sm">
              Select a threat to see details
            </div>
          )}
        </div>
      </div>

      {/* ATLAS Technique Reference */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <SectionHeader title="MITRE ATLAS Technique Reference" subtitle="Mapped adversarial ML attack categories" />
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-6 items-stretch">
          {state.atlasDistribution.map((metric, i) => (
            <motion.div
              key={metric.technique}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 rounded-xl border text-center transition-all hover:scale-[1.02] cursor-default flex flex-col justify-center min-h-[120px] ${
                metric.severity === 'critical' ? 'bg-rose-500/8 border-rose-500/20' :
                metric.severity === 'high' ? 'bg-amber-500/8 border-amber-500/20' :
                metric.severity === 'medium' ? 'bg-indigo-500/8 border-indigo-500/20' :
                'bg-slate-800/30 border-slate-700/50'
              }`}
            >
              <div className="text-3xl font-black text-white mb-2">{metric.count}</div>
              <div className="text-xs font-semibold text-slate-400 leading-tight mb-1">{metric.technique}</div>
              <div className={`mt-auto text-[10px] font-bold uppercase tracking-wider ${
                metric.severity === 'critical' ? 'text-rose-400' :
                metric.severity === 'high' ? 'text-amber-400' :
                metric.severity === 'medium' ? 'text-indigo-400' : 'text-slate-500'
              }`}>{metric.severity}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
