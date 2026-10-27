import { apiClient } from "./client";
import { Income } from "@/types/contract";
import { IncomeCreateInput, IncomeUpdateInput } from "@/types/income";

export async function getIncomes(): Promise<Income[]> {
  return apiClient<Income[]>("/incomes");
}

export async function createIncome(input: IncomeCreateInput): Promise<Income> {
  return apiClient<Income>("/incomes", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateIncome(id: string, input: IncomeUpdateInput): Promise<Income> {
  return apiClient<Income>(`/incomes/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteIncome(id: string): Promise<void> {
  return apiClient<void>(`/incomes/${id}`, {
    method: "DELETE",
  });
}
