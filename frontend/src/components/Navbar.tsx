import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../context/SimulationContext';
import { LiveIndicator } from './ui';
import {
  ShieldCheckIcon,
  PlayIcon,
  PauseIcon,
  BellAlertIcon,
  ChartBarIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  Squares2X2Icon,
  Bars3Icon,
  XMarkIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';

const NAV_LINKS = [
  { to: '/', label: 'Dashboard', icon: <Squares2X2Icon className="w-4 h-4" /> },
  { to: '/evaluate', label: 'Evaluate', icon: <PlayIcon className="w-4 h-4" /> },
  { to: '/compare', label: 'Compare', icon: <ChartBarIcon className="w-4 h-4" /> },
  { to: '/behavior', label: 'Behavior', icon: <ChartBarIcon className="w-4 h-4" /> },
  { to: '/threats', label: 'Threat Intel', icon: <GlobeAltIcon className="w-4 h-4" /> },
  { to: '/reports', label: 'Reports', icon: <DocumentTextIcon className="w-4 h-4" /> },
  { to: '/settings', label: 'Settings', icon: <CpuChipIcon className="w-4 h-4" /> },
];

export default function Navbar() {
  const { state, togglePause, setMode } = useSimulation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full">
      {/* Backdrop blur bar */}
      <div className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60">
        <div className="w-full px-3 md:px-5 h-14 flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative">
              <CpuChipIcon className="w-7 h-7 text-indigo-500" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-sm tracking-tight text-white">AI SOC</span>
              <span className="text-indigo-400 font-black text-sm"> Platform</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-indigo-300 bg-indigo-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                {icon}
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right Cluster */}
          <div className="flex items-center gap-3 shrink-0">

            {/* Mode Toggle */}
            <div className="hidden md:flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setMode('simulation')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  state.mode === 'simulation'
                    ? 'bg-indigo-500 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SIMULATION
              </button>
              <button
                onClick={() => setMode('live')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  state.mode === 'live'
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                LIVE
              </button>
            </div>

            {/* Live Indicator (shows if simulation is ticking) */}
            <LiveIndicator paused={state.isPaused || state.mode === 'live'} />

            {/* Alert badge */}
            <div className="relative">
              <BellAlertIcon className="w-5 h-5 text-slate-400" />
              {state.activeAlerts > 0 && (
                <motion.span
                  key={state.activeAlerts}
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-black text-white flex items-center justify-center"
                >
                  {state.activeAlerts > 9 ? '9+' : state.activeAlerts}
                </motion.span>
              )}
            </div>

            {/* Round counter */}
            <div className="hidden sm:flex flex-col items-end leading-none">
              <span className="text-[9px] font-semibold tracking-widest text-slate-600 uppercase">Round</span>
              <span className="font-mono text-indigo-300 text-sm font-bold">
                {state.round.toString().padStart(4, '0')}
              </span>
            </div>

            {/* Pause / Play */}
            <button
              id="btn-toggle-pause"
              onClick={togglePause}
              className={`p-1.5 rounded-lg border transition-all duration-200 ${
                state.isPaused
                  ? 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20'
                  : 'bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20'
              }`}
            >
              {state.isPaused
                ? <PlayIcon className="w-4 h-4 text-emerald-400" />
                : <PauseIcon className="w-4 h-4 text-rose-400" />
              }
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 transition"
              onClick={() => setMobileOpen(o => !o)}
            >
              {mobileOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-slate-800/60 md:hidden"
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {NAV_LINKS.map(({ to, label, icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'text-indigo-300 bg-indigo-500/10'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`
                    }
                  >
                    {icon}
                    {label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
