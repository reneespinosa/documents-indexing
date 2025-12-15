/**
 * TypeScript type definitions for the application.
 */

export type IndexType = 'suffix' | 'patricia';

export interface Document {
  id: string;
  title: string;
  content: string;
  filename?: string;
  created_at: string;
  word_count: number;
}

export interface IndexStatus {
  index_type: string;
  exists: boolean;
  word_count?: number;
  document_count?: number;
  created_at?: string;
}

