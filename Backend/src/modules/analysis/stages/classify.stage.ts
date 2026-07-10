import { AnalysisStage } from "../orchestration/stage-runner";
import { AnalysisPipelineContext } from "../orchestration/pipeline-context";
import { AnalysisJobStatus } from "@prisma/client";
import { AIEngineClient } from "../clients/ai-engine.client";
import prisma from "../../../config/db";

export class ClassifyStage extends AnalysisStage {
  readonly name = "CLASSIFY";
  readonly jobStatus = AnalysisJobStatus.CLASSIFYING;
  readonly progress = 15;

  public async run(context: AnalysisPipelineContext): Promise<any> {
    const classifiedSignals: any[] = [];

    for (const signal of context.signals) {
      const textToClassify = signal.summary || signal.title;
      if (!textToClassify) {
        classifiedSignals.push({ ...signal, classification: { label: "UNKNOWN", confidence: 1.0 } });
        continue;
      }

      try {
        const classification = await AIEngineClient.classifyContent(textToClassify);
        classifiedSignals.push({
          ...signal,
          classification,
        });

        // Optionally persist to database
        const existingMetadata = (signal.metadata as Record<string, any>) || {};
        await prisma.signal.update({
          where: { id: signal.id },
          data: {
            metadata: {
              ...existingMetadata,
              classification,
            },
          },
        });
      } catch (err: any) {
        console.warn(`[ClassifyStage] Failed to classify signal ${signal.id}:`, err.message);
        classifiedSignals.push({
          ...signal,
          classification: { label: "ERROR", confidence: 0.0, error: err.message },
        });
      }
    }

    context.classifiedSignals = classifiedSignals;
    return {
      classifiedSignals,
    };
  }
}
