import type { McpTransport } from "../transport.js";
import type { NextSteps } from "./types.js";

export interface RemoveDocumentParams {
  docNames: string[];
  folderId?: string | null;
}

export interface RemoveDocumentResultItem {
  doc_name: string;
  status: "deleted" | "not_found" | "failed";
  error?: string;
}

export interface RemoveDocumentResult {
  results: RemoveDocumentResultItem[];
  next_steps: NextSteps;
}

export async function removeDocument(
  transport: McpTransport,
  params: RemoveDocumentParams,
): Promise<RemoveDocumentResult> {
  return transport.callTool<RemoveDocumentResult>("remove_document", {
    doc_names: params.docNames,
    folder_id: params.folderId,
  });
}
