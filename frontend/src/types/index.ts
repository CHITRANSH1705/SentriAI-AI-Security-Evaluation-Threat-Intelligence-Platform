// ====== Core Data Types ======

export type EventSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type ThreatStatus = 'active' | 'contained' | 'resolved' | 'investigating';

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: EventSeverity;
  message: string;
  source?: string;
  technique?: string;
}

export interface AtlasMetric {
  technique: string;
  count: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
}

export interface ThreatEntry {
  id: string;
  name: string;
  technique: string;
  status: ThreatStatus;
  confidence: number;
  detectedAt: string;
  severity: EventSeverity;
  description: string;
}

export interface BehaviorDataPoint {
  round: number;
  securityScore: number;
  driftScore: number;
  hallucinationRisk: number;
  complianceScore: number;
}

export interface SimulationState {
  mode: 'simulation' | 'live';
  round: number;
  securityScore: number;
  complianceScore: number;
  driftScore: number;
  consistencyScore: number;
  hallucinationRisk: number;
  events: SecurityEvent[];
  atlasDistribution: AtlasMetric[];
  threats: ThreatEntry[];
  isPaused: boolean;
  history: BehaviorDataPoint[];
  activeAlerts: number;
  modelLatencyMs: number;
  tokensAnalyzed: number;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
}

export interface ReportSummary {
  id: string;
  title: string;
  generatedAt: string;
  severity: EventSeverity;
  findings: number;
  status: 'draft' | 'published' | 'archived';
}
