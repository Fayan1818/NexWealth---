import { apiClient } from "./client";
import { BankStatement } from "@/types/contract";
import {
  BankStatementParseResult,
  ParsedTransaction,
  ImportTransactionsResponse,
} from "@/types/bank_statement";

export async function getBankStatements(): Promise<BankStatement[]> {
  return apiClient<BankStatement[]>("/bank-statements");
}

export async function uploadBankStatement(
  file: File,
  accountName: string,
  statementMonth?: string
): Promise<BankStatement> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("accountName", accountName);
  if (statementMonth) {
    formData.append("statementMonth", statementMonth);
  }

  // Also support JSON body if multipart is intercepted
  return apiClient<BankStatement>("/bank-statements/upload", {
    method: "POST",
    body: formData,
  });
}

export async function parseBankStatement(
  statementId: string
): Promise<BankStatementParseResult> {
  return apiClient<BankStatementParseResult>(`/bank-statements/${statementId}/parse`, {
    method: "POST",
  });
}

export async function importStatementTransactions(
  statementId: string,
  transactions: ParsedTransaction[]
): Promise<ImportTransactionsResponse> {
  return apiClient<ImportTransactionsResponse>(`/bank-statements/${statementId}/import`, {
    method: "POST",
    body: JSON.stringify({ transactions }),
  });
}

export async function deleteBankStatement(id: string): Promise<void> {
  return apiClient<void>(`/bank-statements/${id}`, {
    method: "DELETE",
  });
}
