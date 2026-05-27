import type { McpTransport } from "../transport.js";
import type { NextSteps } from "./types.js";

export interface SearchDocumentsParams {
  query: string;
  folderId?: string;
  recursive?: boolean;
  limit?: number;
}

export interface SearchDocumentResultItem {
  name: string;
  description: string;
  status: string;
  created_at: string;
  folder_id?: string;
  path?: string;
  /** LLM relevance score, 6-10. Higher is more relevant. */
  score: number;
}

export interface SearchDocumentsResult {
  documents: SearchDocumentResultItem[];
  next_steps: NextSteps;
}

export async function searchDocuments(
  transport: McpTransport,
  params: SearchDocumentsParams,
): Promise<SearchDocumentsResult> {
  return transport.callTool<SearchDocumentsResult>("search_documents", {
    query: params.query,
    folder_id: params.folderId,
    recursive: params.recursive,
    limit: params.limit,
  });
}
