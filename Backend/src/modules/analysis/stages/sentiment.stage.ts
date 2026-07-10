import { AnalysisStage } from "../orchestration/stage-runner";
import { AnalysisPipelineContext } from "../orchestration/pipeline-context";
import { AnalysisJobStatus } from "@prisma/client";
import { AIEngineClient } from "../clients/ai-engine.client";
import prisma from "../../../config/db";

export class SentimentStage extends AnalysisStage {
  readonly name = "SENTIMENT";
  readonly jobStatus = AnalysisJobStatus.ANALYZING_SENTIMENT;
  readonly progress = 25;

  public async run(context: AnalysisPipelineContext): Promise<any> {
    const sentimentMetrics: any[] = [];

    // Only run sentiment on eligible signal types (NEWS, BLOG, SOCIAL, REVIEWS etc.)
    const eligibleTypes = ["NEWS", "BLOG", "SOCIAL", "PRESS", "WEBSITE"];

    for (const signal of context.classifiedSignals) {
      if (!eligibleTypes.includes(signal.type)) {
        continue;
      }

      const text = signal.summary || signal.title;
      if (!text) continue;

      try {
        const sentimentResult = await AIEngineClient.analyzeSentiment(text);
        
        sentimentMetrics.push({
          signalId: signal.id,
          type: signal.type,
          sentiment: sentimentResult,
        });

        // Persist to database
        const existingMetadata = (signal.metadata as Record<string, any>) || {};
        await prisma.signal.update({
          where: { id: signal.id },
          data: {
            metadata: {
              ...existingMetadata,
              sentiment: sentimentResult,
            },
          },
        });
      } catch (err: any) {
        console.warn(`[SentimentStage] Failed to analyze sentiment for signal ${signal.id}:`, err.message);
      }
    }

    context.sentimentMetrics = sentimentMetrics;
    return {
      sentimentMetrics,
    };
  }
}
