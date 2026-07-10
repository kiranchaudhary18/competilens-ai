export class DeduplicationPolicy {
  // Simple in-memory cache to prevent duplicate notification floods within 1 hour
  private static recentAlerts = new Map<string, number>();
  private static TTL_MS = 60 * 60 * 1000; // 1 hour TTL

  /**
   * Evaluates if a notification is a duplicate and should be throttled.
   */
  public static shouldSuppress(userId: string, event: string, dedupeKey?: string): boolean {
    const key = `${userId}_${event}_${dedupeKey || "default"}`;
    const now = Date.now();
    const lastSent = this.recentAlerts.get(key);

    // Clean up expired keys periodically
    for (const [k, time] of this.recentAlerts.entries()) {
      if (now - time > this.TTL_MS) {
        this.recentAlerts.delete(k);
      }
    }

    if (lastSent && now - lastSent < this.TTL_MS) {
      console.log(`[DeduplicationPolicy] Suppressing duplicate alert for key: ${key}`);
      return true;
    }

    this.recentAlerts.set(key, now);
    return false;
  }
}
