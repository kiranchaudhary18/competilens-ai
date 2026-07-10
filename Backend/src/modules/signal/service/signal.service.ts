import { SignalRepository } from "../repository/signal.repository";
import prisma from "../../../config/db";

export class SignalService {
  public static async create(workspaceId: string, data: any) {
    // Verify competitor belongs to this workspace
    const competitor = await prisma.competitor.findFirst({
      where: {
        id: data.competitorId,
        workspaceId,
        deletedAt: null,
      },
    });

    if (!competitor) {
      const err: any = new Error("Competitor not found in this workspace");
      err.statusCode = 404;
      throw err;
    }

    return SignalRepository.create(workspaceId, data);
  }

  public static async list(workspaceId: string, params: any) {
    return SignalRepository.list(workspaceId, params);
  }

  public static async getDetails(id: string, workspaceId: string) {
    const signal = await SignalRepository.findById(id, workspaceId);
    if (!signal) {
      const err: any = new Error("Signal not found");
      err.statusCode = 404;
      throw err;
    }
    return signal;
  }

  public static async markAsRead(id: string, workspaceId: string) {
    const signal = await SignalRepository.findById(id, workspaceId);
    if (!signal) {
      const err: any = new Error("Signal not found");
      err.statusCode = 404;
      throw err;
    }

    return SignalRepository.updateStatus(id, workspaceId, "READ");
  }

  public static async archive(id: string, workspaceId: string) {
    const signal = await SignalRepository.findById(id, workspaceId);
    if (!signal) {
      const err: any = new Error("Signal not found");
      err.statusCode = 404;
      throw err;
    }

    return SignalRepository.updateStatus(id, workspaceId, "ARCHIVED");
  }

  public static async getStatistics(workspaceId: string) {
    return SignalRepository.getStatistics(workspaceId);
  }
}
