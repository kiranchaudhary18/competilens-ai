import { reports, memoryTracks, history, competitors as mockCompetitors, signals as mockSignals, alerts as mockAlerts } from "./mockData";

const API_BASE_URL = "http://localhost:5000";

class APIClient {
  private getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("competilens_access_token");
    }
    return null;
  }

  private setAccessToken(token: string | null): void {
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("competilens_access_token", token);
      } else {
        localStorage.removeItem("competilens_access_token");
      }
    }
  }

  private getActiveWorkspaceId(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("competilens_active_workspace_id");
    }
    return null;
  }

  public setActiveWorkspaceId(id: string | null): void {
    if (typeof window !== "undefined") {
      if (id) {
        localStorage.setItem("competilens_active_workspace_id", id);
      } else {
        localStorage.removeItem("competilens_active_workspace_id");
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const accessToken = this.getAccessToken();
    const workspaceId = this.getActiveWorkspaceId();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    if (workspaceId) {
      headers["x-workspace-id"] = workspaceId;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

      // Handle token expiration / unauthorized
      if (response.status === 401 && accessToken) {
        // Attempt token refresh
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            // The backend reads from cookies by default, so we send credentials
            credentials: "include",
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            if (refreshData.success && refreshData.data?.accessToken) {
              this.setAccessToken(refreshData.data.accessToken);
              headers["Authorization"] = `Bearer ${refreshData.data.accessToken}`;
              // Retry original request
              const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
              });
              if (!retryResponse.ok) {
                const errData = await retryResponse.json().catch(() => ({}));
                throw new Error(errData.message || `API Error: ${retryResponse.status}`);
              }
              const retryData = await retryResponse.json();
              return (retryData.data ?? retryData) as T;
            }
          }
        } catch (refreshErr) {
          console.error("Session expired, please login again", refreshErr);
          this.logout();
        }
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `API Error: ${response.status}`);
      }

      const json = await response.json();
      return (json.data ?? json) as T;
    } catch (error) {
      console.error(`API Request to ${endpoint} failed:`, error);
      throw error;
    }
  }

  // --- Auth APIs ---
  public async login(credentials: any): Promise<any> {
    const res = await this.request<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (res.accessToken) {
      this.setAccessToken(res.accessToken);
    }
    if (res.user?.workspaceId) {
      this.setActiveWorkspaceId(res.user.workspaceId);
    }
    return res;
  }

  public async signup(data: any): Promise<any> {
    return this.request<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  public async getMe(): Promise<any> {
    return this.request<any>("/auth/me", { method: "GET" });
  }

  public logout(): void {
    this.setAccessToken(null);
    this.setActiveWorkspaceId(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  // --- Workspace APIs ---
  public async getWorkspaceMe(): Promise<any> {
    return this.request<any>("/workspace/me", { method: "GET" });
  }

  public async createWorkspace(data: any): Promise<any> {
    return this.request<any>("/workspace/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  public async inviteMember(data: any): Promise<any> {
    return this.request<any>("/workspace/invite", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  public async getWorkspaceMembers(): Promise<any> {
    return this.request<any>("/workspace/members", { method: "GET" });
  }

  // --- Competitor APIs ---
  public async getCompetitors(params: any = {}): Promise<any[]> {
    try {
      const query = new URLSearchParams(params).toString();
      const endpoint = `/competitors${query ? `?${query}` : ""}`;
      return await this.request<any[]>(endpoint, { method: "GET" });
    } catch {
      // Graceful fallback to mock data
      return mockCompetitors;
    }
  }

  public async getCompetitorDetails(id: string): Promise<any> {
    try {
      return await this.request<any>(`/competitors/${id}`, { method: "GET" });
    } catch {
      // Fallback
      return mockCompetitors.find((c) => c.id === id) || mockCompetitors[0];
    }
  }

  public async createCompetitor(data: any): Promise<any> {
    return this.request<any>("/competitors", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  public async updateCompetitor(id: string, data: any): Promise<any> {
    return this.request<any>(`/competitors/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  public async deleteCompetitor(id: string): Promise<any> {
    return this.request<any>(`/competitors/${id}`, { method: "DELETE" });
  }

  // --- Signal APIs ---
  public async getSignals(params: any = {}): Promise<any[]> {
    try {
      const query = new URLSearchParams(params).toString();
      const endpoint = `/signals${query ? `?${query}` : ""}`;
      return await this.request<any[]>(endpoint, { method: "GET" });
    } catch {
      return mockSignals as any;
    }
  }

  public async getSignalDetails(id: string): Promise<any> {
    try {
      return await this.request<any>(`/signals/${id}`, { method: "GET" });
    } catch {
      return mockSignals.find((s) => s.id === id) || mockSignals[0];
    }
  }

  // --- Analysis APIs (FastAPI Orchestrated Jobs) ---
  public async startAnalysis(payload: { competitorId: string; analysisType: "FULL" | "STRATEGIC" | "QUICK"; timeRange?: any }): Promise<any> {
    return this.request<any>("/analyses", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  public async getAnalysisJobs(competitorId?: string): Promise<any[]> {
    const endpoint = competitorId ? `/analyses?competitorId=${competitorId}` : "/analyses";
    return this.request<any[]>(endpoint, { method: "GET" });
  }

  public async getAnalysisJobStatus(id: string): Promise<any> {
    return this.request<any>(`/analyses/${id}`, { method: "GET" });
  }

  public async getAnalysisStrategic(id: string): Promise<any> {
    return this.request<any>(`/analyses/${id}/strategic`, { method: "GET" });
  }

  public async getAnalysisReport(id: string): Promise<any> {
    return this.request<any>(`/analyses/${id}/report`, { method: "GET" });
  }

  public async cancelAnalysisJob(id: string): Promise<any> {
    return this.request<any>(`/analyses/${id}/cancel`, { method: "POST" });
  }

  public async retryAnalysisJob(id: string): Promise<any> {
    return this.request<any>(`/analyses/${id}/retry`, { method: "POST" });
  }

  // --- Notifications APIs ---
  public async getNotifications(): Promise<any[]> {
    try {
      return await this.request<any[]>("/notifications", { method: "GET" });
    } catch {
      return mockAlerts as any;
    }
  }

  // --- Memory APIs ---
  public async getMemoryRecords(): Promise<any[]> {
    try {
      return await this.request<any[]>("/memory", { method: "GET" });
    } catch {
      return memoryTracks as any;
    }
  }

  // --- Report Dossier APIs ---
  public async getReports(): Promise<any[]> {
    try {
      return await this.request<any[]>("/reports", { method: "GET" });
    } catch {
      return reports as any;
    }
  }
}

export const api = new APIClient();
