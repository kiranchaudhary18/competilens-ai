import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || "http://localhost:8000";
const TIMEOUT_MS = 60000; // 60s timeout for heavy LLM operations

export class AIEngineClient {
  private static async request<T>(
    endpoint: string,
    method: "GET" | "POST",
    body?: any,
    retries = 2
  ): Promise<T> {
    const url = `${AI_ENGINE_URL}${endpoint}`;
    const requestId = uuidv4();
    const correlationId = uuidv4();

    for (let attempt = 1; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            "X-Request-ID": requestId,
            "X-Correlation-ID": correlationId,
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`AI Engine returned status ${response.status}: ${text}`);
        }

        const data = await response.json();
        return data as T;
      } catch (err: any) {
        clearTimeout(timeoutId);
        const isTimeout = err.name === "AbortError";
        console.error(
          `[AI Engine Client] Error on ${endpoint} (attempt ${attempt}/${retries}): ${
            isTimeout ? "Timeout" : err.message
          }`
        );

        if (attempt === retries || isTimeout) {
          throw new Error(
            isTimeout
              ? `AI Engine request timed out after ${TIMEOUT_MS}ms`
              : `AI Engine request failed: ${err.message}`
          );
        }

        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
    throw new Error("Unexpected end of request retry loop");
  }

  public static async checkHealth(): Promise<boolean> {
    try {
      const res = await this.request<{ status: string }>("/health", "GET", undefined, 1);
      return res?.status === "ok";
    } catch {
      return false;
    }
  }

  public static async classifyContent(text: string): Promise<{ label: string; confidence: number }> {
    return this.request<{ label: string; confidence: number }>("/v1/classify-content", "POST", { text });
  }

  public static async analyzeSentiment(text: string): Promise<{ label: string; confidence: number }> {
    return this.request<{ label: string; confidence: number }>("/v1/analyze-sentiment", "POST", { text });
  }

  public static async detectChanges(
    oldSnapshot: any,
    newSnapshot: any
  ): Promise<{
    result_id: string;
    competitor_id: string;
    old_snapshot_id: string;
    new_snapshot_id: string;
    change_detected: boolean;
    total_changes: number;
    changes: any[];
    processing_time_ms: number;
    severity_summary: Record<string, number>;
  }> {
    return this.request<any>("/v1/changes/detect", "POST", {
      old_snapshot: oldSnapshot,
      new_snapshot: newSnapshot,
    });
  }

  public static async analyzeStrategic(payload: {
    workspace_id: string;
    competitor_id: string;
    competitor_name: string;
    raw_signals: any[];
    change_detection_results?: any[];
    sentiment_metrics?: any[];
    historical_context?: string;
    provider?: string;
    model?: string;
  }): Promise<{ status: string; analysis: any; validation?: any }> {
    return this.request<any>("/v1/analyze-strategic", "POST", payload);
  }

  public static async generateReport(payload: {
    workspace_id: string;
    competitor_name: string;
    strategic_analysis: any;
    evidence_pack: any;
    report_type?: string;
    provider?: string;
    model?: string;
  }): Promise<{ status: string; report: any; validation?: any }> {
    return this.request<any>("/v1/generate-report", "POST", payload);
  }
}
