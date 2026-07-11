import { AnalysisStage } from "../orchestration/stage-runner";
import { AnalysisPipelineContext } from "../orchestration/pipeline-context";
import { AnalysisJobStatus } from "@prisma/client";
import { AIEngineClient } from "../clients/ai-engine.client";

export class ReportStage extends AnalysisStage {
  readonly name = "EXECUTIVE_REPORT";
  readonly jobStatus = AnalysisJobStatus.GENERATING_REPORT;
  readonly progress = 80;

  private validateReport(report: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!report) {
      errors.push("Report content is empty.");
      return { valid: false, errors };
    }

    // Expecting sections: executive_summary, strategic_implications, key_imperatives
    if (!report.title) {
      errors.push("Report is missing a title.");
    }

    if (!report.executive_summary) {
      errors.push("Report is missing executive summary.");
    }

    if (!report.key_findings || !Array.isArray(report.key_findings)) {
      errors.push("Report is missing key findings array.");
    }

    if (!report.action_items || !Array.isArray(report.action_items)) {
      errors.push("Report is missing action items array.");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  public async run(context: AnalysisPipelineContext): Promise<any> {
    // Generate Report via AI Engine
    const response = await AIEngineClient.generateReport({
      workspace_id: context.workspaceId,
      competitor_name: context.competitorName,
      strategic_analysis: context.strategicAnalysis,
      evidence_pack: context.evidencePack,
      report_type: "WEEKLY_BRIEF",
      provider: "gemini",
      model: "gemini-1.5-flash",
    });

    const responseData = response as { status?: string; report?: any; error?: string };

    if (responseData.status !== "success" || !responseData.report) {
      throw new Error(`Executive Report generation failed: ${responseData.error || "Unknown Error"}`);
    }

    const validationResult = this.validateReport(responseData.report);
    context.executiveReport = responseData.report;
    context.reportValidation = validationResult;

    if (!validationResult.valid) {
      console.warn("[ReportStage] Executive Report validation failed with errors:", validationResult.errors);
      throw new Error(`Executive Report validation failed: ${validationResult.errors[0]}`);
    }

    return {
      executiveReport: responseData.report,
      reportValidation: validationResult,
    };
  }
}
