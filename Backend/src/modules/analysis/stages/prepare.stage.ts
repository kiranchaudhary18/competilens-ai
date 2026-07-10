import { AnalysisStage } from "../orchestration/stage-runner";
import { AnalysisPipelineContext } from "../orchestration/pipeline-context";
import { AnalysisJobStatus } from "@prisma/client";
import prisma from "../../../config/db";

export class PrepareStage extends AnalysisStage {
  readonly name = "PREPARE";
  readonly jobStatus = AnalysisJobStatus.PREPARING;
  readonly progress = 5;

  public async run(context: AnalysisPipelineContext): Promise<any> {
    // 1. Resolve competitor
    const competitor = await prisma.competitor.findFirst({
      where: {
        id: context.competitorId,
        workspaceId: context.workspaceId,
        deletedAt: null,
      },
    });

    if (!competitor) {
      throw new Error(`Competitor ${context.competitorId} not found or deleted.`);
    }

    context.competitorName = competitor.name;

    // 2. Fetch signals in range
    const fromDate = new Date(context.timeRange.from);
    const toDate = new Date(context.timeRange.to);

    const signals = await prisma.signal.findMany({
      where: {
        competitorId: context.competitorId,
        workspaceId: context.workspaceId,
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    context.signals = signals;

    return {
      competitorName: competitor.name,
      signalsCount: signals.length,
      signals,
    };
  }
}
