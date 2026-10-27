import { apiClient } from "./client";
import { Transaction } from "@/types/contract";
import { TransactionFilterParams } from "@/types/transaction";

export async function getTransactions(params?: TransactionFilterParams): Promise<Transaction[]> {
  let query = "";
  if (params) {
    const searchParams = new URLSearchParams();
    if (params.type && params.type !== "all" as any) searchParams.append("type", params.type);
    if (params.category && params.category !== "all") searchParams.append("category", params.category);
    if (params.date_from) searchParams.append("date_from", params.date_from);
    if (params.date_to) searchParams.append("date_to", params.date_to);
    const qs = searchParams.toString();
    if (qs) query = `?${qs}`;
  }

  return apiClient<Transaction[]>(`/transactions${query}`);
}
