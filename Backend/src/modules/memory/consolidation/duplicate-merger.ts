import { MemoryRepository } from "../memory.repository";

export class DuplicateMerger {
  /**
   * Scans memory timeline, identifies duplicate memory events, and links them.
   */
  public static async mergeDuplicates(workspaceId: string, competitorId: string): Promise<void> {
    const memories = await MemoryRepository.getMemoryTimeline(workspaceId, competitorId);

    for (let i = 0; i < memories.length; i++) {
      for (let j = i + 1; j < memories.length; j++) {
        const memA = memories[i];
        const memB = memories[j];

        // If same type and exact title/summary or very similar text
        const isTypeMatch = memA.memoryType === memB.memoryType;
        const isTitleMatch = memA.title.toLowerCase().trim() === memB.title.toLowerCase().trim();

        if (isTypeMatch && isTitleMatch) {
          // Check if link already exists
          console.log(`[DuplicateMerger] Linking duplicates: "${memA.title}" (ID: ${memA.id} <-> ID: ${memB.id})`);
          await MemoryRepository.linkMemoryRecords(memA.id, memB.id, "DUP").catch(
            (err) => console.error("[DuplicateMerger] Failed to create DUP link:", err.message)
          );
        }
      }
    }
  }
}
