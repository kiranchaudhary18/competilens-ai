import { PipelineContext, TimeRange } from "../analysis.types";

export class AnalysisPipelineContext implements PipelineContext {
  public jobId: string;
  public workspaceId: string;
  public competitorId: string;
  public competitorName: string;
  public analysisType: "FULL" | "QUICK";
  public timeRange: TimeRange;
  public userId: string;

  public signals: any[] = [];
  public classifiedSignals: any[] = [];
  public sentimentMetrics: any[] = [];
  public changeDetectionResults: any = null;
  public evidencePack: any = null;
  public strategicAnalysis: any = null;
  public strategicValidation: any = null;
  public executiveReport: any = null;
  public reportValidation: any = null;

  constructor(params: {
    jobId: string;
    workspaceId: string;
    competitorId: string;
    competitorName: string;
    analysisType: "FULL" | "QUICK";
    timeRange: TimeRange;
    userId: string;
  }) {
    this.jobId = params.jobId;
    this.workspaceId = params.workspaceId;
    this.competitorId = params.competitorId;
    this.competitorName = params.competitorName;
    this.analysisType = params.analysisType;
    this.timeRange = params.timeRange;
    this.userId = params.userId;
  }
}
