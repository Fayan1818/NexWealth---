import { apiClient } from "./client";
import {
  AdvisorInsightsResponse,
  AdvisorQueryResponse,
  ChatMessage,
} from "@/types/ai_advisor";

export async function getAdvisorInsights(): Promise<AdvisorInsightsResponse> {
  return apiClient<AdvisorInsightsResponse>("/ai-advisor/insights");
}

export async function queryAdvisor(
  message: string,
  history?: ChatMessage[]
): Promise<AdvisorQueryResponse> {
  return apiClient<AdvisorQueryResponse>("/ai-advisor/chat", {
    method: "POST",
    body: JSON.stringify({ message, history }),
  });
}
