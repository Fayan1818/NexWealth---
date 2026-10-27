import { apiClient } from "./client";
import { Document } from "@/types/contract";

export async function getDocuments(category?: string): Promise<Document[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return apiClient<Document[]>(`/documents${query}`);
}

export async function uploadDocument(file: File, documentType: string): Promise<Document> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("documentType", documentType);

  return apiClient<Document>("/documents", {
    method: "POST",
    body: JSON.stringify({
      fileName: file.name,
      documentType,
    }),
  });
}

export async function deleteDocument(id: string): Promise<void> {
  return apiClient<void>(`/documents/${id}`, {
    method: "DELETE",
  });
}
