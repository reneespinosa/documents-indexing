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

export const api = {
  // Documents
  async getDocuments(): Promise<DocumentListResponse> {
    const response = await apiClient.get<DocumentListResponse>('/api/documents/');
    return response.data;
  },

  async getDocument(id: string): Promise<Document> {
    const response = await apiClient.get<Document>(`/api/documents/${id}`);
    return response.data;
  },

  async uploadDocument(file: File): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<Document>('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteDocument(id: string): Promise<void> {
    await apiClient.delete(`/api/documents/${id}`);
  },

  // Indexing
  async createIndex(indexType: 'suffix' | 'patricia', documentIds?: string[]): Promise<void> {
    await apiClient.post('/api/indexing/create', {
      index_type: indexType,
      document_ids: documentIds,
    });
  },

  async getIndexStatus(indexType: string) {
    const response = await apiClient.get(`/api/indexing/status/${indexType}`);
    return response.data;
  },

  // Index Management
  async getIndexStructure(indexType: string): Promise<IndexStructureResponse> {
    const response = await apiClient.get<IndexStructureResponse>(
      `/api/index/structure/${indexType}`
    );
    return response.data;
  },

  async getIndexStats(indexType: string) {
    const response = await apiClient.get(`/api/index/stats/${indexType}`);
    return response.data;
  },

  async addWordToIndex(word: string, documentId?: string): Promise<void> {
    await apiClient.post('/api/index/words', {
      word,
      document_id: documentId,
    });
  },

  async deleteWordFromIndex(word: string, indexType: string): Promise<void> {
    await apiClient.delete(`/api/index/words/${word}?index_type=${indexType}`);
  },

  // Search
  async search(
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
  },
};

