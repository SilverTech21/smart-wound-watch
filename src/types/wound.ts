export type WoundStatus = 'Stable' | 'Monitor' | 'Concerning' | 'Urgent';

export interface WoundMetrics {
  area: number;
  areaPct: number;
  redness: number;
  exudateRatio: number;
  brightness: number;
  blurVar: number;
}

export interface WoundEntry {
  id: string;
  patientId: string;
  timestamp: string;
  imagePath: string;
  imageData: string; // base64
  metrics: WoundMetrics;
  status: WoundStatus;
  llmSummary: string;
  patientInstructions: string[];
  patientContext: PatientContext;
  deltaFromPrevious?: DeltaMetrics;
}

export interface PatientContext {
  age: number;
  notes: string;
  comorbidities: string[];
}

export interface DeltaMetrics {
  areaPctDelta: number;
  rednessDelta: number;
  exudateDelta: number;
}

export interface Patient {
  id: string;
  name: string;
  createdAt: string;
  entries: WoundEntry[];
}

export interface AnalysisResult {
  metrics: WoundMetrics;
  status: WoundStatus;
  llmSummary: string;
  patientInstructions: string[];
  qualityIssue?: string;
  delta?: DeltaMetrics;
  escalation?: EscalationInfo;
}

export interface EscalationInfo {
  required: boolean;
  reason: string;
}
