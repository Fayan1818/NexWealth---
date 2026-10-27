import { apiClient } from "./client";
import { AnalyticsSummary } from "@/types/analytics";

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  return apiClient<AnalyticsSummary>("/analytics/summary");
}
