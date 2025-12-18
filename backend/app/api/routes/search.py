"""
API routes for searching in indexes.
"""
from fastapi import APIRouter, HTTPException
from app.api.models.index import (
    SearchRequest,
    SearchResponse
)
from app.services import index_service

router = APIRouter()


@router.post("/", response_model=SearchResponse)
async def search(request: SearchRequest):
    """
    Search for a query in the specified index.
    
    Args:
        request: Search request with query, index type, and optional limit
        
    Returns:
        Search results with matching documents
    """
    try:
        results = await index_service.search(
            query=request.query,
            index_type=request.index_type.value,
            limit=request.limit or 100
        )
        
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error performing search: {str(e)}")

