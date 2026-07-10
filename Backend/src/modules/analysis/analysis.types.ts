import { AnalysisJobStatus } from "@prisma/client";

export interface TimeRange {
  from: string;
  to: string;
}

export interface StartAnalysisRequest {
  competitorId: string;
  analysisType: "FULL" | "QUICK";
  timeRange: TimeRange;
}

export interface PipelineContext {
  jobId: string;
  workspaceId: string;
  competitorId: string;
  competitorName: string;
  analysisType: "FULL" | "QUICK";
  timeRange: TimeRange;
  userId: string;
  
  // Accumulated data from stages
  signals: any[];
  classifiedSignals: any[];
  sentimentMetrics: any[];
  changeDetectionResults: any;
  evidencePack: any;
  strategicAnalysis: any;
  strategicValidation: any;
  executiveReport: any;
  reportValidation: any;
}

export interface StageResult<T = any> {
  success: boolean;
  stageName: string;
  outputData?: T;
  error?: string;
  durationMs: number;
}
