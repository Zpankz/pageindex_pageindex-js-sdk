import type { McpTransport } from "../transport.js";
import type { NextSteps } from "./types.js";

export type BrowseSortMode = "time" | "relevance";

export interface BrowseDocumentsParams {
  folderId?: string;
  recursive?: boolean;
  sort?: BrowseSortMode;
  query?: string;
  offset?: number;
  limit?: number;
}

export interface BrowseFolderItem {
  id: string;
  name: string;
  path: string;
  description: string | null;
  children_count: number;
  file_count: number;
  created_at: string;
}

export interface BrowseDocumentItem {
  name: string;
  description: string;
  status: string;
  created_at: string;
  folder_id?: string;
  path?: string;
}

export interface BrowseDocumentsResult {
  folders?: BrowseFolderItem[];
  documents: BrowseDocumentItem[];
  sort: BrowseSortMode;
  next_offset: number | null;
  has_more: boolean;
  next_steps: NextSteps;
}

export async function browseDocuments(
  transport: McpTransport,
  params?: BrowseDocumentsParams,
): Promise<BrowseDocumentsResult> {
  return transport.callTool<BrowseDocumentsResult>("browse_documents", {
    folder_id: params?.folderId,
    recursive: params?.recursive,
    sort: params?.sort,
    query: params?.query,
    offset: params?.offset,
    limit: params?.limit,
  });
}
