'use client';

/**
 * API client for communicating with the FastAPI backend.
 */
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Document {
  id: string;
  title: string;
  content: string;
  filename?: string;
  created_at: string;
  word_count: number;
}

export interface DocumentListResponse {
  documents: Document[];
  total: number;
}

export interface IndexStructureNode {
  id: string;
  label: string;
  children: IndexStructureNode[];
  metadata?: Record<string, any>;
}

export interface IndexStructureResponse {
  index_type: string;
  root: IndexStructureNode;
  stats: Record<string, any>;
}

export interface SearchResult {
  document_id: string;
  document_title: string;
  matches: string[];
  relevance_score?: number;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  total_results: number;
  index_type: string;
}

// Documents
export async function getDocuments(): Promise<DocumentListResponse> {
  const response = await apiClient.get<DocumentListResponse>('/api/documents/');
  return response.data;
}

export async function getDocument(id: string): Promise<Document> {
  const response = await apiClient.get<Document>(`/api/documents/${id}`);
  return response.data;
}

export async function uploadDocument(file: File): Promise<Document> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post<Document>('/api/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function deleteDocument(id: string): Promise<void> {
  await apiClient.delete(`/api/documents/${id}`);
}

// Indexing
export async function createIndex(indexType: 'suffix' | 'patricia', documentIds?: string[]): Promise<void> {
  await apiClient.post('/api/indexing/create', {
    index_type: indexType,
    document_ids: documentIds,
  });
}

export async function getIndexStatus(indexType: string) {
  const response = await apiClient.get(`/api/indexing/status/${indexType}`);
  return response.data;
}

// Index Management
export async function getIndexStructure(indexType: string): Promise<IndexStructureResponse> {
  const response = await apiClient.get<IndexStructureResponse>(
    `/api/index/structure/${indexType}`
  );
  return response.data;
}

export async function getIndexStats(indexType: string) {
  const response = await apiClient.get(`/api/index/stats/${indexType}`);
  return response.data;
}

export async function addWordToIndex(word: string, documentId?: string, indexType?: string): Promise<void> {
  await apiClient.post('/api/index/words', {
    word,
    document_id: documentId,
    index_type: indexType,
  });
}

export async function deleteWordFromIndex(word: string, indexType: string): Promise<void> {
  await apiClient.delete(`/api/index/words/${word}?index_type=${indexType}`);
}

// Search
export async function search(
  query: string,
  indexType: 'suffix' | 'patricia',
  limit: number = 100
): Promise<SearchResponse> {
  const response = await apiClient.post<SearchResponse>('/api/search/', {
    query,
    index_type: indexType,
    limit,
  });
  return response.data;
}

// Export as object for backward compatibility
export const api = {
  getDocuments,
  getDocument,
  uploadDocument,
  deleteDocument,
  createIndex,
  getIndexStatus,
  getIndexStructure,
  getIndexStats,
  addWordToIndex,
  deleteWordFromIndex,
  search,
};
