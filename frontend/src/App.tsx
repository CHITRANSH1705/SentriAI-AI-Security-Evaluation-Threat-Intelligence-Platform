import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { SimulationProvider } from './context/SimulationContext';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import BehaviorPage from './components/BehaviorPage';
import ThreatsPage from './components/ThreatsPage';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './components/SettingsPage';
import EvaluationPage from './components/EvaluationPage';
import ComparePage from './components/ComparePage';

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -5 }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export default function App() {
  return (
    <SimulationProvider>
      <BrowserRouter>
        {/* Scan line effect */}
        <div className="scan-line" />

        {/* Global grid bg */}
        <div className="min-h-screen bg-grid bg-slate-950 text-slate-200">
          <Navbar />

          {/* Page content */}
          <main className="w-full px-3 md:px-5 py-3">
            <Routes>
              <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
              <Route path="/evaluate" element={<PageWrapper><EvaluationPage /></PageWrapper>} />
              <Route path="/compare" element={<PageWrapper><ComparePage /></PageWrapper>} />
              <Route path="/behavior" element={<PageWrapper><BehaviorPage /></PageWrapper>} />
              <Route path="/threats" element={<PageWrapper><ThreatsPage /></PageWrapper>} />
              <Route path="/reports" element={<PageWrapper><ReportsPage /></PageWrapper>} />
              <Route path="/settings" element={<PageWrapper><SettingsPage /></PageWrapper>} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-800/40 mt-8 py-4">
            <div className="w-full px-3 md:px-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
              <span className="font-mono">AI SOC Platform v1.0.0 — Defensive Engineering Mode</span>
              <span>Powered by MITRE ATLAS · Built with React + Vite</span>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </SimulationProvider>
  );
}