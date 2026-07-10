import { ReportRepository } from "./report.repository";

export class ReportService {
  public static async getReportDetails(id: string, workspaceId: string) {
    const report = await ReportRepository.getReportById(id, workspaceId);
    if (!report) {
      const err: any = new Error("Executive report not found");
      err.statusCode = 404;
      throw err;
    }
    return report;
  }

  public static async listExecutiveReports(workspaceId: string, competitorId?: string) {
    return ReportRepository.listReports(workspaceId, competitorId);
  }

  public static async removeReport(id: string, workspaceId: string) {
    const report = await ReportRepository.getReportById(id, workspaceId);
    if (!report) {
      const err: any = new Error("Executive report not found");
      err.statusCode = 404;
      throw err;
    }
    await ReportRepository.deleteReport(id, workspaceId);
    return { success: true, message: "Report deleted successfully" };
  }
}
