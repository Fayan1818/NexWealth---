import { apiClient } from "./client";
import { Goal } from "@/types/contract";
import { GoalCreateInput, GoalUpdateInput, GoalAddFundsInput } from "@/types/goal";

export async function getGoals(): Promise<Goal[]> {
  return apiClient<Goal[]>("/goals");
}

export async function createGoal(input: GoalCreateInput): Promise<Goal> {
  return apiClient<Goal>("/goals", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateGoal(id: string, input: GoalUpdateInput): Promise<Goal> {
  return apiClient<Goal>(`/goals/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function addFundsToGoal(id: string, input: GoalAddFundsInput): Promise<Goal> {
  return apiClient<Goal>(`/goals/${id}/funds`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function deleteGoal(id: string): Promise<void> {
  return apiClient<void>(`/goals/${id}`, {
    method: "DELETE",
  });
}

export interface SavingsOverview {
  initialSavingsPool: number;
  totalIncome: number;
  totalExpenses: number;
  cashflowSavings: number;
  totalLiquidBase: number;
  allocatedToGoals: number;
  totalInvested: number;
  unallocatedSavings: number;
  monthlySavings: number;
  allocatedMonthlyToGoals: number;
  unallocatedMonthlySavings: number;
}

export async function getSavingsOverview(): Promise<SavingsOverview> {
  return apiClient<SavingsOverview>("/savings/overview");
}

