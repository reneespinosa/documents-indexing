"""
Pydantic models for index-related operations.
"""
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from enum import Enum


class IndexType(str, Enum):
    """Types of indexes available."""
    SUFFIX = "suffix"
    PATRICIA = "patricia"


class IndexCreateRequest(BaseModel):
    """Request model for creating an index."""
    index_type: IndexType
    document_ids: Optional[List[str]] = None  # Si es None, indexa todos


class IndexStatusResponse(BaseModel):
    """Response model for index status."""
    index_type: str
    exists: bool
    word_count: Optional[int] = None
    document_count: Optional[int] = None
    created_at: Optional[str] = None


class WordAddRequest(BaseModel):
    """Request model for adding a word to index."""
    word: str
    document_id: Optional[str] = None


class WordDeleteRequest(BaseModel):
    """Request model for deleting a word from index."""
    word: str


class SearchRequest(BaseModel):
    """Request model for searching."""
    query: str
    index_type: IndexType
    limit: Optional[int] = 100


class SearchResult(BaseModel):
    """Single search result."""
    document_id: str
    document_title: str
    matches: List[str]  # Palabras que coinciden
    relevance_score: Optional[float] = None


class SearchResponse(BaseModel):
    """Response model for search."""
    query: str
    results: List[SearchResult]
    total_results: int
    index_type: str


class IndexStructureNode(BaseModel):
    """Node in the index structure tree."""
    id: str
    label: str
    children: List["IndexStructureNode"] = []
    metadata: Optional[Dict[str, Any]] = None


class IndexStructureResponse(BaseModel):
    """Response model for index structure visualization."""
    index_type: str
    root: IndexStructureNode
    stats: Dict[str, Any]

