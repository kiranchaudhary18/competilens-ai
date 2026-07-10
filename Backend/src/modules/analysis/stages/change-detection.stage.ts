import { AnalysisStage } from "../orchestration/stage-runner";
import { AnalysisPipelineContext } from "../orchestration/pipeline-context";
import { AnalysisJobStatus } from "@prisma/client";
import { AIEngineClient } from "../clients/ai-engine.client";
import prisma from "../../../config/db";

export class ChangeDetectionStage extends AnalysisStage {
  readonly name = "CHANGE_DETECTION";
  readonly jobStatus = AnalysisJobStatus.DETECTING_CHANGES;
  readonly progress = 35;

  public async run(context: AnalysisPipelineContext): Promise<any> {
    // 1. Fetch data sources for this competitor
    const dataSources = await prisma.dataSource.findMany({
      where: {
        competitorId: context.competitorId,
        workspaceId: context.workspaceId,
        status: "ACTIVE",
      },
    });

    const allChanges: any[] = [];

    for (const source of dataSources) {
      // 2. Fetch the last two page snapshots for this data source
      const snapshots = await prisma.pageSnapshot.findMany({
        where: {
          dataSourceId: source.id,
          competitorId: context.competitorId,
          workspaceId: context.workspaceId,
        },
        orderBy: { capturedAt: "desc" },
        take: 2,
      });

      if (snapshots.length < 2) {
        // Can't run diff if there's only one snapshot
        continue;
      }

      const newSnapshot = snapshots[0];
      const oldSnapshot = snapshots[1];

      // Avoid comparing identical content hash
      if (newSnapshot.contentHash === oldSnapshot.contentHash) {
        continue;
      }

      try {
        const payloadOld = {
          snapshot_id: oldSnapshot.id,
          competitor_id: context.competitorId,
          raw_data: oldSnapshot.structuredContent || { text: oldSnapshot.normalizedText },
        };
        const payloadNew = {
          snapshot_id: newSnapshot.id,
          competitor_id: context.competitorId,
          raw_data: newSnapshot.structuredContent || { text: newSnapshot.normalizedText },
        };

        const diffResult = await AIEngineClient.detectChanges(payloadOld, payloadNew);

        if (diffResult.change_detected && diffResult.changes) {
          for (const change of diffResult.changes) {
            allChanges.push({
              sourceUrl: source.url,
              sourceType: source.type,
              oldSnapshotId: oldSnapshot.id,
              newSnapshotId: newSnapshot.id,
              ...change,
            });
          }
        }
      } catch (err: any) {
        console.warn(`[ChangeDetectionStage] Failed for source ${source.id}:`, err.message);
      }
    }

    context.changeDetectionResults = allChanges;
    return {
      changeDetectionResults: allChanges,
    };
  }
}
