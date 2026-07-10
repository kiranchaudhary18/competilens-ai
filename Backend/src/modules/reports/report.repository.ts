import prisma from "../../config/db";

export class ReportRepository {
  public static async createReport(params: {
    jobId: string;
    workspaceId: string;
    competitorId: string;
    title: string;
    content: any;
    reportType: string;
    validation?: any;
    modelVersion: string;
    provider: string;
  }) {
    return prisma.executiveReport.create({
      data: {
        jobId: params.jobId,
        workspaceId: params.workspaceId,
        competitorId: params.competitorId,
        title: params.title,
        content: params.content,
        reportType: params.reportType,
        validation: params.validation || {},
        modelVersion: params.modelVersion,
        provider: params.provider,
      },
    });
  }

  public static async getReportById(id: string, workspaceId: string) {
    return prisma.executiveReport.findFirst({
      where: { id, workspaceId },
    });
  }

  public static async listReports(workspaceId: string, competitorId?: string, limit = 50) {
    return prisma.executiveReport.findMany({
      where: {
        workspaceId,
        ...(competitorId ? { competitorId } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  public static async deleteReport(id: string, workspaceId: string) {
    return prisma.executiveReport.deleteMany({
      where: { id, workspaceId },
    });
  }
}
