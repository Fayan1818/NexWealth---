import { apiClient } from "./client";
import { Investment } from "@/types/contract";
import { InvestmentCreateInput, InvestmentUpdateInput } from "@/types/investment";

export async function getInvestments(): Promise<Investment[]> {
  return apiClient<Investment[]>("/investments");
}

export async function createInvestment(input: InvestmentCreateInput): Promise<Investment> {
  return apiClient<Investment>("/investments", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateInvestment(id: string, input: InvestmentUpdateInput): Promise<Investment> {
  return apiClient<Investment>(`/investments/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteInvestment(id: string): Promise<void> {
  return apiClient<void>(`/investments/${id}`, {
    method: "DELETE",
  });
}
