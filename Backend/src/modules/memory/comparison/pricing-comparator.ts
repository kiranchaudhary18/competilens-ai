export interface PricingPlanDelta {
  planName: string;
  billingPeriod: string; // MONTHLY | YEARLY
  currency: string;
  oldPrice: number;
  newPrice: number;
  pctChange: number;
  changeType: "INCREASE" | "DECREASE" | "NO_CHANGE" | "ADDED" | "REMOVED";
}

export class PricingComparator {
  /**
   * Compares pricing sets.
   */
  public static comparePlans(
    oldPlans: Array<{ name: string; price: number; billingPeriod: string; currency?: string }>,
    newPlans: Array<{ name: string; price: number; billingPeriod: string; currency?: string }>
  ): PricingPlanDelta[] {
    const deltas: PricingPlanDelta[] = [];

    const oldMap = new Map<string, any>();
    for (const plan of oldPlans) {
      const key = `${plan.name.toLowerCase()}_${plan.billingPeriod.toUpperCase()}`;
      oldMap.set(key, plan);
    }

    const newMap = new Map<string, any>();
    for (const plan of newPlans) {
      const key = `${plan.name.toLowerCase()}_${plan.billingPeriod.toUpperCase()}`;
      newMap.set(key, plan);
    }

    // 1. Check for changes and removals
    for (const [key, oldPlan] of oldMap.entries()) {
      const newPlan = newMap.get(key);
      const currency = oldPlan.currency || "USD";

      if (!newPlan) {
        // Plan was removed
        deltas.push({
          planName: oldPlan.name,
          billingPeriod: oldPlan.billingPeriod,
          currency,
          oldPrice: oldPlan.price,
          newPrice: 0,
          pctChange: -1.0,
          changeType: "REMOVED",
        });
      } else {
        const diff = newPlan.price - oldPlan.price;
        const pct = oldPlan.price > 0 ? diff / oldPlan.price : 0;
        let changeType: "INCREASE" | "DECREASE" | "NO_CHANGE" = "NO_CHANGE";

        if (diff > 0) changeType = "INCREASE";
        if (diff < 0) changeType = "DECREASE";

        deltas.push({
          planName: oldPlan.name,
          billingPeriod: oldPlan.billingPeriod,
          currency,
          oldPrice: oldPlan.price,
          newPrice: newPlan.price,
          pctChange: pct,
          changeType,
        });
      }
    }

    // 2. Check for added plans
    for (const [key, newPlan] of newMap.entries()) {
      if (!oldMap.has(key)) {
        deltas.push({
          planName: newPlan.name,
          billingPeriod: newPlan.billingPeriod,
          currency: newPlan.currency || "USD",
          oldPrice: 0,
          newPrice: newPlan.price,
          pctChange: 1.0,
          changeType: "ADDED",
        });
      }
    }

    return deltas;
  }
}
