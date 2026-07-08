import { CompetitorRepository } from "../repository/competitor.repository";
import prisma from "../../../config/db";

export class CompetitorService {
  public static async create(workspaceId: string, userId: string, data: any) {
    // 1. Duplicate check: Name
    const existingName = await CompetitorRepository.findByName(data.name, workspaceId);
    if (existingName) {
      const err: any = new Error(`Competitor with name '${data.name}' already exists in this workspace`);
      err.statusCode = 400;
      throw err;
    }

    // 2. Duplicate check: Domain
    const existingDomain = await CompetitorRepository.findByDomain(data.domain, workspaceId);
    if (existingDomain) {
      const err: any = new Error(`Competitor with domain '${data.domain}' already exists in this workspace`);
      err.statusCode = 400;
      throw err;
    }

    return CompetitorRepository.create(workspaceId, userId, data);
  }

  public static async list(workspaceId: string, params: any) {
    return CompetitorRepository.list(workspaceId, params);
  }

  public static async getDetails(id: string, workspaceId: string) {
    const competitor = await CompetitorRepository.findById(id, workspaceId);
    if (!competitor) {
      const err: any = new Error("Competitor not found");
      err.statusCode = 404;
      throw err;
    }
    return competitor;
  }

  public static async update(id: string, workspaceId: string, userId: string, data: any) {
    const competitor = await CompetitorRepository.findById(id, workspaceId);
    if (!competitor) {
      const err: any = new Error("Competitor not found");
      err.statusCode = 404;
      throw err;
    }

    // Duplicate check if changing name
    if (data.name && data.name.toLowerCase() !== competitor.name.toLowerCase()) {
      const existingName = await CompetitorRepository.findByName(data.name, workspaceId);
      if (existingName) {
        const err: any = new Error(`Competitor with name '${data.name}' already exists in this workspace`);
        err.statusCode = 400;
        throw err;
      }
    }

    // Duplicate check if changing domain
    if (data.domain && data.domain.toLowerCase() !== competitor.domain.toLowerCase()) {
      const existingDomain = await CompetitorRepository.findByDomain(data.domain, workspaceId);
      if (existingDomain) {
        const err: any = new Error(`Competitor with domain '${data.domain}' already exists in this workspace`);
        err.statusCode = 400;
        throw err;
      }
    }

    return CompetitorRepository.update(id, workspaceId, userId, data);
  }

  public static async softDelete(id: string, workspaceId: string, userId: string) {
    const competitor = await CompetitorRepository.findById(id, workspaceId);
    if (!competitor) {
      const err: any = new Error("Competitor not found");
      err.statusCode = 404;
      throw err;
    }

    return CompetitorRepository.softDelete(id, workspaceId, userId);
  }

  public static async archive(id: string, workspaceId: string, userId: string) {
    const competitor = await CompetitorRepository.findById(id, workspaceId);
    if (!competitor) {
      const err: any = new Error("Competitor not found");
      err.statusCode = 404;
      throw err;
    }

    return CompetitorRepository.archive(id, workspaceId, userId);
  }

  public static async restore(id: string, workspaceId: string, userId: string) {
    // Find even if soft-deleted
    const competitor = await prisma.competitor.findFirst({
      where: { id, workspaceId },
    });

    if (!competitor) {
      const err: any = new Error("Competitor not found");
      err.statusCode = 404;
      throw err;
    }

    return CompetitorRepository.restore(id, workspaceId, userId);
  }
}
