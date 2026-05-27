import type { McpTransport } from "../transport.js";
import type { NextSteps } from "./types.js";

export interface GetFolderStructureParams {
  folderId?: string;
  path?: string;
  depth?: number;
  includeCounts?: boolean;
}

export interface FolderStructureItem {
  id: string;
  name: string;
  path: string;
  file_count?: number;
  children_count?: number;
  children: FolderStructureItem[];
}

export interface FolderStructureRoot {
  id?: string;
  name: string;
  path?: string;
  file_count: number;
  children_count: number;
  children: FolderStructureItem[];
}

export interface GetFolderStructureResult {
  tree: FolderStructureRoot;
  total_folders: number;
  depth: number;
  truncated: boolean;
  next_steps: NextSteps;
}

export async function getFolderStructure(
  transport: McpTransport,
  params?: GetFolderStructureParams,
): Promise<GetFolderStructureResult> {
  return transport.callTool<GetFolderStructureResult>("get_folder_structure", {
    folder_id: params?.folderId,
    path: params?.path,
    depth: params?.depth,
    include_counts: params?.includeCounts,
  });
}
