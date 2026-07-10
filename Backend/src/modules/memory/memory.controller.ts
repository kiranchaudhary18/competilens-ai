import { Response } from "express";
import { WorkspaceRequest } from "../workspace/middleware/workspace.middleware";
import { TimelineService } from "./timeline/timeline.service";
import { MemoryRetriever } from "./retrieval/memory-retriever";
import { MemoryRepository } from "./memory.repository";
import { MemoryConsolidator } from "./consolidation/memory-consolidator";
import { getTimelineSchema, searchMemorySchema } from "./memory.validation";
import prisma from "../../config/db";

export class MemoryController {
  public static async getTimeline(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const workspaceId = req.workspaceId!;
      const { competitorId } = req.params;

      // Check competitor exists
      const competitor = await prisma.competitor.findFirst({
        where: { id: competitorId, workspaceId, deletedAt: null },
      });

      if (!competitor) {
        res.status(404).json({ success: false, message: "Competitor not found in this workspace" });
        return;
      }

      // Parse parameters
      const parsed = getTimelineSchema.partial().parse(req.query);

      const timeline = await TimelineService.getTimeline({
        workspaceId,
        competitorId,
        startDate: parsed.startDate,
        endDate: parsed.endDate,
        types: parsed.types,
        minImportance: parsed.minImportance,
      });

      res.status(200).json({
        success: true,
        data: timeline,
      });
    } catch (err: any) {
      if (err.name === "ZodError") {
        res.status(400).json({ success: false, message: err.errors[0].message });
        return;
      }
      res.status(500).json({
        success: false,
        message: err.message || "Failed to retrieve competitor timeline",
      });
    }
  }

  public static async getTrends(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const workspaceId = req.workspaceId!;
      const { competitorId } = req.params;

      const competitor = await prisma.competitor.findFirst({
        where: { id: competitorId, workspaceId, deletedAt: null },
      });

      if (!competitor) {
        res.status(404).json({ success: false, message: "Competitor not found" });
        return;
      }

      const trends = await MemoryRepository.getHistoricalTrends(workspaceId, competitorId);

      res.status(200).json({
        success: true,
        data: trends,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || "Failed to retrieve competitor trends",
      });
    }
  }

  public static async search(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const workspaceId = req.workspaceId!;
      const parsed = searchMemorySchema.parse(req.query);

      const keywords = parsed.query.split(/\s+/).filter((k) => k.length > 2);

      // Search all competitor memories in the workspace
      const rawMemories = await prisma.memoryRecord.findMany({
        where: { workspaceId },
        take: 100,
      });

      const memories = rawMemories.map((m) => ({
        id: m.id,
        memoryType: m.memoryType,
        title: m.title,
        summary: m.summary,
        importanceScore: m.importanceScore,
        confidenceScore: m.confidenceScore,
        observedAt: m.observedAt,
        metadata: m.metadata || {},
      }));

      const ranked = MemoryRetriever.retrieve({
        workspaceId,
        competitorId: "", // Empty maps to all competitors
        keywords,
        limit: parsed.limit || 15,
      });

      res.status(200).json({
        success: true,
        data: await ranked,
      });
    } catch (err: any) {
      if (err.name === "ZodError") {
        res.status(400).json({ success: false, message: err.errors[0].message });
        return;
      }
      res.status(500).json({
        success: false,
        message: err.message || "Search failed",
      });
    }
  }

  public static async consolidate(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const workspaceId = req.workspaceId!;
      const { competitorId } = req.params;

      const competitor = await prisma.competitor.findFirst({
        where: { id: competitorId, workspaceId, deletedAt: null },
      });

      if (!competitor) {
        res.status(404).json({ success: false, message: "Competitor not found" });
        return;
      }

      // Consolidate asynchronously
      MemoryConsolidator.consolidate(workspaceId, competitorId).catch((err) =>
        console.error("[MemoryController] Consolidation run failed:", err)
      );

      res.status(202).json({
        success: true,
        message: "Memory consolidation and pattern analysis triggered in background.",
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || "Consolidation triggering failed",
      });
    }
  }

  public static async validateMemory(req: WorkspaceRequest, res: Response): Promise<void> {
    try {
      const workspaceId = req.workspaceId!;
      const { id } = req.params;

      const record = await prisma.memoryRecord.findUnique({ where: { id } });

      if (!record || record.workspaceId !== workspaceId) {
        res.status(404).json({ success: false, message: "Memory record not found" });
        return;
      }

      // Update type to USER_VALIDATED_INSIGHT
      const updated = await prisma.memoryRecord.update({
        where: { id },
        data: {
          memoryType: "USER_VALIDATED_INSIGHT",
          importanceScore: 1.0, // verified high importance
        },
      });

      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || "Validation failed",
      });
    }
  }
}
