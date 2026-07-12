import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSimulation } from '../context/SimulationContext';
import { SeverityBadge, StatusBadge, SectionHeader, KpiCard, ProgressBar, PageHeader } from './ui';
import {
  DocumentTextIcon, DocumentArrowDownIcon, CalendarDaysIcon,
  CheckBadgeIcon, ClipboardDocumentListIcon, MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import type { ReportSummary } from '../types';

const REPORTS: ReportSummary[] = [
  { id: 'r1', title: 'Q2 2026 AI Security Posture Assessment', generatedAt: '2026-07-01 20:45', severity: 'WARNING', findings: 14, status: 'published' },
  { id: 'r2', title: 'Prompt Injection Incident: Session 0x8F2', generatedAt: '2026-07-01 18:30', severity: 'CRITICAL', findings: 5, status: 'published' },
  { id: 'r3', title: 'Model Drift Analysis — June 2026', generatedAt: '2026-07-01 09:15', severity: 'INFO', findings: 22, status: 'published' },
  { id: 'r4', title: 'Weekly Compliance Snapshot — W26', generatedAt: '2026-06-30 17:00', severity: 'INFO', findings: 8, status: 'archived' },
  { id: 'r5', title: 'Adversarial Robustness Evaluation — Batch 3', generatedAt: '2026-06-29 11:00', severity: 'WARNING', findings: 11, status: 'draft' },
  { id: 'r6', title: 'LLM Jailbreak Containment Report', generatedAt: '2026-06-28 14:22', severity: 'CRITICAL', findings: 3, status: 'archived' },
];

const COMPLIANCE_FRAMEWORKS = [
  { name: 'NIST AI RMF', score: 91.2, status: 'Passing', controls: 42, passed: 38 },
  { name: 'EU AI Act', score: 87.5, status: 'Passing', controls: 28, passed: 24 },
  { name: 'ISO/IEC 42001', score: 94.1, status: 'Passing', controls: 55, passed: 52 },
  { name: 'MITRE ATLAS', score: 78.3, status: 'Review', controls: 30, passed: 23 },
];

const FINDING_CATEGORIES = [
  { name: 'Behavioral Drift', count: 8, color: 'rose' },
  { name: 'Policy Violation', count: 5, color: 'amber' },
  { name: 'Prompt Injection', count: 4, color: 'rose' },
  { name: 'Hallucination', count: 6, color: 'amber' },
  { name: 'Data Leakage', count: 2, color: 'indigo' },
  { name: 'Context Manipulation', count: 3, color: 'indigo' },
];

export default function ReportsPage() {
  const { state } = useSimulation();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = REPORTS.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalFindings = REPORTS.reduce((sum, r) => sum + r.findings, 0);
  const criticalReports = REPORTS.filter(r => r.severity === 'CRITICAL').length;
  const publishedReports = REPORTS.filter(r => r.status === 'published').length;

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <PageHeader
        title="Reports & Compliance"
        subtitle="Security assessment reports, compliance scores, and audit-ready exports"
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        <KpiCard label="Total Reports" value={REPORTS.length} color="slate" icon={<DocumentTextIcon className="w-5 h-5" />} />
        <KpiCard label="Total Findings" value={totalFindings} color="amber" icon={<ClipboardDocumentListIcon className="w-5 h-5" />} />
        <KpiCard label="Critical Reports" value={criticalReports} color="rose" icon={<DocumentTextIcon className="w-5 h-5 opacity-0" />} />
        <KpiCard label="Published" value={publishedReports} color="emerald" icon={<CheckBadgeIcon className="w-5 h-5" />} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* Report List */}
        <div className="lg:col-span-8 glass-card p-6 flex flex-col gap-4">
          <SectionHeader title="Report Archive" icon={<DocumentTextIcon className="w-5 h-5" />} />

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-2">
            <div className="relative flex-1 min-w-[200px]">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search reports…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition"
              />
            </div>
            {['all', 'published', 'draft', 'archived'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-wide transition-all ${
                  statusFilter === s ? 'bg-indigo-600 text-white' : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2 mt-2">
            {filtered.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group p-5 rounded-xl border border-slate-800/60 bg-slate-900/30 hover:border-slate-700/60 hover:bg-slate-900/60 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-slate-100 leading-snug mb-3">{report.title}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <SeverityBadge type={report.severity} />
                      <StatusBadge status={report.status} />
                      <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5 ml-2">
                        <CalendarDaysIcon className="w-4 h-4" />
                        {report.generatedAt}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1.5 ml-2">
                        <ClipboardDocumentListIcon className="w-4 h-4" />
                        {report.findings} findings
                      </span>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2.5 rounded-lg border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
                    <DocumentArrowDownIcon className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-500 text-sm">No reports match your search</div>
            )}
          </div>
        </div>

        {/* Compliance Scores + Finding Categories */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Compliance Frameworks */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 flex flex-col min-h-[240px]"
          >
            <SectionHeader title="Framework Compliance" icon={<CheckBadgeIcon className="w-5 h-5" />} />
            <div className="space-y-5">
              {COMPLIANCE_FRAMEWORKS.map(fw => (
                <div key={fw.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-300">{fw.name}</span>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={fw.status.toLowerCase()} />
                      <span className="text-sm font-mono font-bold text-white">{fw.score}%</span>
                    </div>
                  </div>
                  <ProgressBar
                    value={fw.score}
                    color={fw.score >= 90 ? 'emerald' : fw.score >= 80 ? 'indigo' : 'amber'}
                    showValue={false}
                  />
                  <div className="text-xs text-slate-500 mt-1">{fw.passed} / {fw.controls} controls passing</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Finding Categories */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 flex-1 flex flex-col min-h-[220px]"
          >
            <SectionHeader title="Finding Categories" />
            <div className="space-y-3 mt-1">
              {FINDING_CATEGORIES.map(cat => (
                <div key={cat.name} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      cat.color === 'rose' ? 'bg-rose-500' : cat.color === 'amber' ? 'bg-amber-500' : 'bg-indigo-500'
                    }`} />
                    <span className="text-sm text-slate-400 truncate">{cat.name}</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-white shrink-0">{cat.count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Generate Report Button */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card-highlight p-6 text-center"
          >
            <ClipboardDocumentListIcon className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-200 mb-1.5">Generate New Report</p>
            <p className="text-xs text-slate-500 mb-4 px-4">Compile current simulation state into an audit-ready PDF</p>
            <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-600/20">
              Generate Report
            </button>
          </motion.div>

        </div>
      </div>

      {/* Live Simulation Snapshot */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <SectionHeader title="Current Simulation Snapshot" subtitle={`Round ${state.round} · Real-time metrics`} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-2">
          {[
            { label: 'Security Score', value: `${state.securityScore.toFixed(1)}`, unit: '/ 100' },
            { label: 'Compliance', value: `${state.complianceScore.toFixed(1)}`, unit: '%' },
            { label: 'Drift Score', value: `${(state.driftScore * 100).toFixed(1)}`, unit: '%' },
            { label: 'Consistency', value: `${state.consistencyScore.toFixed(1)}`, unit: '%' },
            { label: 'Hallucination', value: `${(state.hallucinationRisk * 100).toFixed(1)}`, unit: '%' },
            { label: 'Model Latency', value: `${state.modelLatencyMs}`, unit: 'ms' },
          ].map(item => (
            <div key={item.label} className="bg-slate-950/50 rounded-xl border border-slate-800 p-4 text-center">
              <div className="text-[11px] uppercase tracking-widest text-slate-500 mb-2 font-bold">{item.label}</div>
              <div className="text-2xl font-black text-white">{item.value}<span className="text-sm text-slate-500 font-medium ml-1">{item.unit}</span></div>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
