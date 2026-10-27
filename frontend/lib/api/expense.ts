import { apiClient } from "./client";
import { Expense } from "@/types/contract";
import { ExpenseCreateInput, ExpenseUpdateInput } from "@/types/expense";

export async function getExpenses(): Promise<Expense[]> {
  return apiClient<Expense[]>("/expenses");
}

export async function createExpense(input: ExpenseCreateInput): Promise<Expense> {
  return apiClient<Expense>("/expenses", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateExpense(id: string, input: ExpenseUpdateInput): Promise<Expense> {
  return apiClient<Expense>(`/expenses/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteExpense(id: string): Promise<void> {
  return apiClient<void>(`/expenses/${id}`, {
    method: "DELETE",
  });
}
