import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import type { SimulationState, SecurityEvent, ThreatEntry, AtlasMetric } from '../types';

interface ContextType {
  state: SimulationState;
  togglePause: () => void;
  setRound: (round: number) => void;
  clearEvents: () => void;
  setMode: (mode: 'simulation' | 'live') => void;
  updateLiveState: (updates: Partial<SimulationState>) => void;
}

const SimulationContext = createContext<ContextType | undefined>(undefined);

// ===== Seed Data =====
const INITIAL_THREATS: ThreatEntry[] = [
  { id: 't1', name: 'Prompt Injection via System Prompt Override', technique: 'AML.T0051.000', status: 'active', confidence: 94, detectedAt: '21:03:12', severity: 'CRITICAL', description: 'Adversarial input detected attempting to override system-level instructions.' },
  { id: 't2', name: 'LLM Data Exfiltration Attempt', technique: 'AML.T0024.001', status: 'investigating', confidence: 81, detectedAt: '20:58:45', severity: 'WARNING', description: 'Suspicious output patterns suggest model may be leaking training data.' },
  { id: 't3', name: 'Adversarial Example: Jailbreak Pattern', technique: 'AML.T0048.003', status: 'contained', confidence: 99, detectedAt: '20:44:22', severity: 'CRITICAL', description: 'Known jailbreak token sequence detected and blocked by safety layer.' },
  { id: 't4', name: 'Context Window Manipulation', technique: 'AML.T0054.002', status: 'resolved', confidence: 76, detectedAt: '20:31:07', severity: 'WARNING', description: 'Attempt to flood context window to push system instructions out of scope.' },
  { id: 't5', name: 'Behavioral Drift: Safety Bypass', technique: 'AML.T0044.001', status: 'investigating', confidence: 67, detectedAt: '20:18:59', severity: 'WARNING', description: 'Multi-turn conversation showing gradual safety boundary erosion.' },
  { id: 't6', name: 'Model Inversion Probe', technique: 'AML.T0005.000', status: 'active', confidence: 58, detectedAt: '19:55:40', severity: 'INFO', description: 'Repeated queries designed to reconstruct model architecture or weights.' },
];

const ATLAS_DISTRIBUTION: AtlasMetric[] = [
  { technique: 'Prompt Injection', count: 45, severity: 'critical', category: 'Adversarial ML' },
  { technique: 'Adversarial Example', count: 30, severity: 'high', category: 'Evasion' },
  { technique: 'Model Extraction', count: 18, severity: 'high', category: 'Exfiltration' },
  { technique: 'Backdoor Attack', count: 12, severity: 'medium', category: 'Poisoning' },
  { technique: 'LLM Exfiltration', count: 10, severity: 'critical', category: 'Exfiltration' },
  { technique: 'Context Manipulation', count: 8, severity: 'medium', category: 'Manipulation' },
  { technique: 'Jailbreaking', count: 7, severity: 'high', category: 'Evasion' },
  { technique: 'Model Inversion', count: 5, severity: 'low', category: 'Inference' },
];

const INFO_MESSAGES = [
  { msg: 'Baseline evaluation cycle completed', source: 'EvalEngine' },
  { msg: 'Policy compliance check passed', source: 'PolicyGuard' },
  { msg: 'Behavior profile snapshot saved', source: 'BehaviorDB' },
  { msg: 'MITRE ATLAS mapping updated', source: 'ThreatMapper' },
  { msg: 'Semantic similarity computed: 0.94', source: 'DriftDetector' },
  { msg: 'Context window integrity verified', source: 'ContextGuard' },
  { msg: 'Token analysis completed: 1,204 tokens', source: 'Tokenizer' },
  { msg: 'Safety guardrails nominal', source: 'SafetyLayer' },
];

const WARN_MESSAGES = [
  { msg: 'Behavioral drift exceeded threshold (0.23)', source: 'DriftDetector' },
  { msg: 'Anomalous output pattern detected in session 0x8F2', source: 'AnomalyEngine' },
  { msg: 'Prompt injection pattern matched: ATLAS.T0051', source: 'ThreatMapper' },
  { msg: 'Hallucination risk elevated: 0.31', source: 'HallucinationMonitor' },
  { msg: 'Response refusal rate dropped below baseline', source: 'SafetyLayer' },
  { msg: 'Context poisoning attempt blocked', source: 'ContextGuard' },
];

const CRITICAL_MESSAGES = [
  { msg: 'CRITICAL: Jailbreak attempt detected — session isolated', source: 'SafetyLayer' },
  { msg: 'CRITICAL: Policy violation — output blocked', source: 'PolicyGuard' },
  { msg: 'CRITICAL: Data exfiltration pattern confirmed', source: 'ThreatMapper' },
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEvent(): SecurityEvent {
  const rand = Math.random();
  let type: SecurityEvent['type'];
  let source: string;
  let message: string;
  let technique: string | undefined;

  if (rand > 0.88) {
    type = 'CRITICAL';
    const m = randomFrom(CRITICAL_MESSAGES);
    message = m.msg;
    source = m.source;
    technique = 'AML.T0051';
  } else if (rand > 0.65) {
    type = 'WARNING';
    const m = randomFrom(WARN_MESSAGES);
    message = m.msg;
    source = m.source;
    technique = 'AML.T0044';
  } else {
    type = 'INFO';
    const m = randomFrom(INFO_MESSAGES);
    message = m.msg;
    source = m.source;
  }

  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    type,
    message,
    source,
    technique,
  };
}

const INITIAL_HISTORY = Array.from({ length: 30 }, (_, i) => ({
  round: -30 + i,
  securityScore: 88 + Math.sin(i * 0.3) * 4 + Math.random() * 3,
  driftScore: 0.08 + Math.cos(i * 0.4) * 0.03 + Math.random() * 0.04,
  hallucinationRisk: 0.05 + Math.random() * 0.08,
  complianceScore: 97 + Math.random() * 2,
}));

const INITIAL_EVENTS: SecurityEvent[] = Array.from({ length: 6 }, (_, i) => ({
  id: `init-${i}`,
  timestamp: new Date(Date.now() - (6 - i) * 12000).toLocaleTimeString('en-US', { hour12: false }),
  type: i === 1 ? 'WARNING' : i === 3 ? 'CRITICAL' : 'INFO',
  message: i === 1 ? WARN_MESSAGES[0].msg : i === 3 ? CRITICAL_MESSAGES[0].msg : INFO_MESSAGES[i % INFO_MESSAGES.length].msg,
  source: i === 1 ? WARN_MESSAGES[0].source : i === 3 ? CRITICAL_MESSAGES[0].source : INFO_MESSAGES[i % INFO_MESSAGES.length].source,
}));

// ===== Provider =====
export const SimulationProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<SimulationState>({
    mode: 'simulation',
    round: 0,
    securityScore: 91.4,
    complianceScore: 98.7,
    driftScore: 0.12,
    consistencyScore: 94.2,
    hallucinationRisk: 0.07,
    events: INITIAL_EVENTS,
    atlasDistribution: ATLAS_DISTRIBUTION,
    threats: INITIAL_THREATS,
    isPaused: false,
    history: INITIAL_HISTORY,
    activeAlerts: 3,
    modelLatencyMs: 312,
    tokensAnalyzed: 0,
  });

  const tick = useCallback(() => {
    setState(prev => {
      if (prev.isPaused || prev.mode === 'live') return prev;

      const newRound = prev.round + 1;
      const delta = (Math.random() - 0.45) * 2.5;
      const newScore = Math.max(72, Math.min(100, prev.securityScore + delta));
      const driftDelta = (Math.random() - 0.38) * 0.04;
      const newDrift = Math.max(0, Math.min(1, prev.driftScore + driftDelta));
      const newHallucination = Math.max(0, Math.min(0.95, prev.hallucinationRisk + (Math.random() - 0.5) * 0.03));
      const newCompliance = Math.max(85, Math.min(100, prev.complianceScore + (Math.random() - 0.45) * 0.5));
      const newLatency = Math.max(120, Math.min(900, prev.modelLatencyMs + (Math.random() - 0.5) * 60));

      const newEvent = generateEvent();
      const newEvents = [newEvent, ...prev.events].slice(0, 12);
      const newAlerts = newEvents.filter(e => e.type !== 'INFO').length;

      const newHistory = [
        ...prev.history,
        {
          round: newRound,
          securityScore: newScore,
          driftScore: newDrift,
          hallucinationRisk: newHallucination,
          complianceScore: newCompliance,
        },
      ].slice(-40);

      return {
        ...prev,
        round: newRound,
        securityScore: parseFloat(newScore.toFixed(1)),
        driftScore: parseFloat(newDrift.toFixed(3)),
        consistencyScore: parseFloat((100 - newDrift * 80).toFixed(1)),
        hallucinationRisk: parseFloat(newHallucination.toFixed(3)),
        complianceScore: parseFloat(newCompliance.toFixed(1)),
        events: newEvents,
        activeAlerts: newAlerts,
        modelLatencyMs: Math.round(newLatency),
        tokensAnalyzed: prev.tokensAnalyzed + Math.floor(200 + Math.random() * 800),
        history: newHistory,
      };
    });
  }, []);

  useEffect(() => {
    if (state.isPaused || state.mode === 'live') return;
    const interval = setInterval(tick, 2500);
    return () => clearInterval(interval);
  }, [state.isPaused, tick]);

  const togglePause = useCallback(() =>
    setState(prev => ({ ...prev, isPaused: !prev.isPaused })), []);

  const setRound = useCallback((round: number) =>
    setState(prev => ({ ...prev, round })), []);

  const clearEvents = useCallback(() =>
    setState(prev => ({ ...prev, events: [] })), []);

  const setMode = useCallback((mode: 'simulation' | 'live') =>
    setState(prev => ({ ...prev, mode })), []);

  const updateLiveState = useCallback((updates: Partial<SimulationState>) =>
    setState(prev => ({ ...prev, ...updates })), []);

  return (
    <SimulationContext.Provider value={{ state, togglePause, setRound, clearEvents, setMode, updateLiveState }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = (): ContextType => {
  const context = useContext(SimulationContext);
  if (!context) throw new Error('useSimulation must be used within SimulationProvider');
  return context;
};
