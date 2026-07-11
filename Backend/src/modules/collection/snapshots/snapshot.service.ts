import { CollectionRepository } from "../collection.repository";
import { SignalRepository } from "../../signal/repository/signal.repository";
import { AnalysisService } from "../../analysis/analysis.service";
import { AIEngineClient } from "../../analysis/clients/ai-engine.client";
import { SignalSeverity, SignalType } from "@prisma/client";
import crypto from "crypto";
import { MemoryIngestor } from "../../memory/ingestion/memory-ingestor";
import { NotificationService } from "../../notifications/notification.service";

export class SnapshotService {
  /**
   * Process a crawled page: compare with previous snapshot, save new snapshot if updated,
   * detect changes, create signals, and conditionally trigger strategic analyses.
   */
  public static async processCrawledPage(params: {
    workspaceId: string;
    competitorId: string;
    dataSourceId: string;
    url: string;
    rawHtml: string;
    normalizedText: string;
    structuredContent?: any;
    etag?: string;
    lastModified?: string;
  }): Promise<void> {
    const {
      workspaceId,
      competitorId,
      dataSourceId,
      url,
      rawHtml,
      normalizedText,
      structuredContent,
      etag,
      lastModified,
    } = params;

    // 1. Calculate SHA256 of the normalized text
    const contentHash = crypto
      .createHash("sha256")
      .update(normalizedText)
      .digest("hex");

    // 2. Fetch the latest snapshot
    const latestSnapshot = await CollectionRepository.getLatestSnapshot(dataSourceId, url);

    if (latestSnapshot) {
      // 3. Conditional processing: if content hashes match, no updates
      if (latestSnapshot.contentHash === contentHash) {
        console.log(`[SnapshotService] Page contents unchanged for ${url}. Skipping snapshot.`);
        return;
      }

      console.log(`[SnapshotService] Change detected for ${url}. Saving new snapshot and running diff.`);
    } else {
      console.log(`[SnapshotService] First crawl baseline snapshot for ${url}. Saving.`);
    }

    // 4. Save the page snapshot
    const newSnapshot = await CollectionRepository.createPageSnapshot({
      workspaceId,
      competitorId,
      dataSourceId,
      url,
      rawHtml,
      normalizedText,
      contentHash,
      structuredContent,
      etag,
      lastModified,
    });

    // If there is no previous snapshot, we cannot perform a diff.
    if (!latestSnapshot) return;

    try {
      // 5. Trigger Hybrid Change Detection
      const payloadOld = {
        snapshot_id: latestSnapshot.id,
        competitor_id: competitorId,
        raw_data: latestSnapshot.structuredContent || { text: latestSnapshot.normalizedText },
      };

      const payloadNew = {
        snapshot_id: newSnapshot.id,
        competitor_id: competitorId,
        raw_data: newSnapshot.structuredContent || { text: newSnapshot.normalizedText },
      };

      const diffResult = await AIEngineClient.detectChanges(payloadOld, payloadNew);

      if (diffResult.change_detected && diffResult.changes && diffResult.changes.length > 0) {
        console.log(`[SnapshotService] Detected ${diffResult.changes.length} changes for ${url}`);

        // Define severity and type of signal
        let highestSeverity: SignalSeverity = SignalSeverity.LOW;
        let signalType: SignalType = SignalType.WEBSITE;

        // Map severity levels
        const severityMap: Record<string, SignalSeverity> = {
          LOW: SignalSeverity.LOW,
          MEDIUM: SignalSeverity.MEDIUM,
          HIGH: SignalSeverity.HIGH,
          CRITICAL: SignalSeverity.CRITICAL,
        };

        const changeDescriptions: string[] = [];

        for (const change of diffResult.changes) {
          const changeSeverity = severityMap[change.severity?.toUpperCase()] || SignalSeverity.LOW;
          if (
            changeSeverity === SignalSeverity.CRITICAL ||
            (changeSeverity === SignalSeverity.HIGH && highestSeverity !== SignalSeverity.CRITICAL) ||
            (changeSeverity === SignalSeverity.MEDIUM && highestSeverity === SignalSeverity.LOW)
          ) {
            highestSeverity = changeSeverity as SignalSeverity;
          }

          // Check if pricing or product change
          if (change.change_type === "pricing" || url.includes("pricing")) {
            signalType = SignalType.PRICING as SignalType;
          } else if (change.change_type === "feature" || change.change_type === "product") {
            signalType = SignalType.PRODUCT as SignalType;
          }

          changeDescriptions.push(
            `- [${change.change_type || "General"}] ${change.entity || "entity"}: changed from "${
              change.old_value || "none"
            }" to "${change.new_value || "none"}" (Severity: ${change.severity || "LOW"})`
          );
        }

        const summary = `Detected the following updates on ${url}:\n${changeDescriptions.join("\n")}`;

        // 6. Create competitive signal in PostgreSQL
        const signal = await SignalRepository.create(workspaceId, {
          competitorId,
          type: signalType,
          title: `Website update detected: ${url}`,
          summary,
          url,
          source: new URL(url).hostname,
          severity: highestSeverity,
          metadata: {
            diffResult,
            snapshotId: newSnapshot.id,
            previousSnapshotId: latestSnapshot.id,
          },
        });

        // Ingest Signal into long-term memory
        await MemoryIngestor.ingestSignal(signal).catch((err) =>
          console.error("[SnapshotService] Memory signal ingestion failed:", err.message)
        );

        // Ingest individual changes into memory
        for (const change of diffResult.changes) {
          await MemoryIngestor.ingestChange({
            workspaceId,
            competitorId,
            change,
            url,
            evidenceId: signal.id,
          }).catch((err) =>
            console.error("[SnapshotService] Memory change ingestion failed:", err.message)
          );
        }

        // Send workspace alerts if the update is critical
        if (highestSeverity === SignalSeverity.HIGH || highestSeverity === SignalSeverity.CRITICAL) {
          const severityLabel = highestSeverity === SignalSeverity.CRITICAL ? "critical" : "high";
          const eventType = signalType === SignalType.PRICING ? "PRICING_CHANGE" : "CRITICAL_CHANGE";
          const titleSuffix = signalType === SignalType.PRICING ? "Pricing Update" : "Critical Page Change";

          await NotificationService.notifyWorkspace({
            workspaceId,
            event: eventType,
            title: `${titleSuffix} detected`,
            message: `A ${severityLabel} change was detected at ${url}. ${signal.title}`,
            severity: highestSeverity === SignalSeverity.CRITICAL ? "ERROR" : "WARNING",
            dedupeKey: `critical_change_${competitorId}_${dataSourceId}`,
          }).catch((err) =>
            console.error("[SnapshotService] Workspace notification dispatch failed:", err.message)
          );

          console.log(
            `[SnapshotService] High/Critical change detected. Automatically launching strategic analysis job.`
          );
          
          await AnalysisService.startAnalysis(
            workspaceId,
            "SYSTEM_AUTOPILOT", // Requested by autopilot system
            {
              competitorId,
              analysisType: "FULL",
              timeRange: {
                from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Past 30 days
                to: new Date().toISOString(),
              },
            },
            `autopilot_${newSnapshot.id}` // Idempotency key based on new snapshot ID
          ).catch((err) => {
            console.error("[SnapshotService] Failed to auto-trigger strategic analysis:", err.message);
          });
        }
      }
    } catch (err: any) {
      console.error(`[SnapshotService] Failed to run change detection diff:`, err.message);
    }
  }
}
