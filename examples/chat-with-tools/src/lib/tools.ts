import { tool } from 'ai';
import { z } from 'zod';
import { PageIndexClient } from '@pageindex/sdk';

// Tool schemas - using camelCase to match SDK types
const getFolderStructureSchema = z.object({
  folderId: z
    .string()
    .optional()
    .describe('Subtree root. Omit or use "root" for the entire library; pass a folder ID to scope to a subtree.'),
  depth: z
    .number()
    .int()
    .min(1)
    .max(10)
    .default(10)
    .optional()
    .describe('Maximum depth to traverse (1-10, default 10).'),
});

const browseDocumentsSchema = z.object({
  folderId: z
    .string()
    .optional()
    .describe('Folder scope. Omit or use "root" for the library root; pass a folder ID to drill into a sub-folder.'),
  recursive: z
    .boolean()
    .optional()
    .describe(
      'When false (default), returns direct contents plus sub-folders. When true, flattens all descendants into one document list.',
    ),
  sort: z
    .enum(['time', 'relevance'])
    .optional()
    .describe('"time" (default) sorts by upload date; "relevance" ranks by semantic relevance to `query`.'),
  query: z
    .string()
    .optional()
    .describe('Required when sort="relevance"; must be omitted otherwise. Natural-language query is OK.'),
  offset: z.number().int().min(0).optional().describe('Pagination offset from a previous `next_offset`.'),
  limit: z.number().min(1).max(50).default(10).optional().describe('Number of documents to return (1-50).'),
});

const searchDocumentsSchema = z.object({
  query: z
    .string()
    .min(1)
    .describe(
      'Keyword query (NOT a natural-language sentence). Multiple keywords are AND-matched against file name and description.',
    ),
  folderId: z.string().optional().describe('Folder scope. Omit or use "root" for the library root.'),
  recursive: z
    .boolean()
    .optional()
    .describe('Include descendant folders. Default false. Set true to widen scope when a folder-scoped search returns no hits.'),
  limit: z.number().min(1).max(50).default(10).optional().describe('Number of documents to return (1-50).'),
});

const getDocumentSchema = z.object({
  docName: z.string().min(1).describe('Document name copied verbatim from a browse_documents() or search_documents() response.'),
  folderId: z
    .string()
    .optional()
    .describe('Disambiguator when two documents share the same name; copy `folder_id` from the same response.'),
});

const getDocumentStructureSchema = z.object({
  docName: z.string().min(1).describe('Document name from browse_documents()/search_documents().'),
  part: z.number().int().min(1).default(1).optional().describe('Part number for pagination (1-based).'),
});

const getPageContentSchema = z.object({
  docName: z.string().min(1).describe('Document name from browse_documents()/search_documents().'),
  pages: z
    .string()
    .min(1)
    .describe('Page specification: "5", "3,7,10", "5-10", or "1-3,7,9-12".'),
});

const TOOL_DESCRIPTIONS = {
  get_folder_structure:
    'Orientation step: returns the folder hierarchy as a tree. Call this FIRST when exploring a library — folder names reveal content domains and return folder IDs you can pass to browse_documents().',
  browse_documents:
    'Primary document discovery tool. Default sort="time" (newest first); use sort="relevance" + query for semantic ranking. Pass folder_id to drill into a sub-folder.',
  search_documents:
    'ESCALATION tool — only use after browse_documents(sort="relevance") missed a document you strongly believe exists. Keyword-only query; results include an LLM relevance score (6-10).',
  get_document:
    'Get a document\'s processing status and metadata. Call before get_document_structure() or get_page_content() to confirm the document is ready.',
  get_document_structure:
    'Extract a document\'s hierarchical outline (headers, sections, page references). REQUIRED for documents over 20 pages — use it to locate relevant sections before reading pages.',
  get_page_content:
    'Extract page content from a processed document. Use tight, targeted page ranges — never the whole document at once.',
};

export function buildPageIndexTools(client: PageIndexClient) {
  return {
    pageindex_get_folder_structure: tool({
      description: TOOL_DESCRIPTIONS.get_folder_structure,
      inputSchema: getFolderStructureSchema,
      execute: async (params) => client.tools.getFolderStructure(params),
    }),
    pageindex_browse_documents: tool({
      description: TOOL_DESCRIPTIONS.browse_documents,
      inputSchema: browseDocumentsSchema,
      execute: async (params) => client.tools.browseDocuments(params),
    }),
    pageindex_search_documents: tool({
      description: TOOL_DESCRIPTIONS.search_documents,
      inputSchema: searchDocumentsSchema,
      execute: async (params) => client.tools.searchDocuments(params),
    }),
    pageindex_get_document: tool({
      description: TOOL_DESCRIPTIONS.get_document,
      inputSchema: getDocumentSchema,
      execute: async (params) => client.tools.getDocument(params),
    }),
    pageindex_get_document_structure: tool({
      description: TOOL_DESCRIPTIONS.get_document_structure,
      inputSchema: getDocumentStructureSchema,
      execute: async (params) => client.tools.getDocumentStructure(params),
    }),
    pageindex_get_page_content: tool({
      description: TOOL_DESCRIPTIONS.get_page_content,
      inputSchema: getPageContentSchema,
      execute: async (params) => client.tools.getPageContent(params),
    }),
  };
}
