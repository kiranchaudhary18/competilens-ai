import { MemoryRepository } from "../memory.repository";
import { SignificanceFilter } from "./significance-filter";
import { MemoryRecordData } from "../memory.types";

export class IngestionPolicy {
  /**
   * Evaluate and ingest memory candidate. Logs decisions.
   */
  public static async evaluateAndIngest(candidate: MemoryRecordData): Promise<{
    success: boolean;
    reason: string;
    recordId?: string;
  }> {
    try {
      const evaluation = SignificanceFilter.shouldIngest({
        type: candidate.memoryType,
        severity: candidate.metadata?.severity || undefined,
        confidence: candidate.confidenceScore,
        title: candidate.title,
        metadata: candidate.metadata,
      });

      if (!evaluation.eligible) {
        console.log(`[IngestionPolicy] Rejected memory candidate "${candidate.title}". Reason: ${evaluation.reason}`);
        return { success: false, reason: evaluation.reason };
      }

      // Safe check: prevent empty values
      if (!candidate.title || !candidate.summary) {
        return { success: false, reason: "Title and Summary are required fields." };
      }

      // Save to database
      const record = await MemoryRepository.createMemoryRecord({
        workspaceId: candidate.workspaceId,
        competitorId: candidate.competitorId,
        memoryType: candidate.memoryType,
        title: candidate.title,
        summary: candidate.summary,
        importanceScore: candidate.importanceScore,
        confidenceScore: candidate.confidenceScore,
        observedAt: candidate.observedAt,
        evidenceIds: candidate.evidenceIds,
        metadata: {
          ...candidate.metadata,
          ingestionReason: evaluation.reason,
        },
      });

      console.log(`[IngestionPolicy] Ingested new memory record: ${record.id} (${candidate.memoryType})`);
      return { success: true, reason: evaluation.reason, recordId: record.id };
    } catch (err: any) {
      console.error(`[IngestionPolicy] Ingestion error:`, err);
      return { success: false, reason: err.message || String(err) };
    }
  }
}
