"""
API routes for index management (add/remove words, visualize structure).
"""
from fastapi import APIRouter, HTTPException
from app.api.models.index import (
    WordAddRequest,
    WordDeleteRequest,
    IndexStructureResponse
)
from app.services.index_service import IndexService

router = APIRouter()
index_service = IndexService()


@router.post("/words")
async def add_word(request: WordAddRequest):
    """
    Add a word to the index.
    
    Args:
        request: Word to add and optional document ID
        
    Returns:
        Success message
    """
    try:
        success = await index_service.add_word_to_index(
            word=request.word,
            document_id=request.document_id
        )
        
        if not success:
            raise HTTPException(
                status_code=404,
                detail="Index not found. Please create an index first."
            )
        
        return {"message": f"Word '{request.word}' added successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding word: {str(e)}")


@router.delete("/words/{word}")
async def delete_word(word: str, index_type: str = "suffix"):
    """
    Delete a word from the index.
    
    Args:
        word: Word to delete
        index_type: Type of index (suffix or patricia)
        
    Returns:
        Success message
    """
    try:
        success = await index_service.delete_word_from_index(
            word=word,
            index_type=index_type
        )
        
        if not success:
            raise HTTPException(
                status_code=404,
                detail="Word not found in index or index does not exist"
            )
        
        return {"message": f"Word '{word}' deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting word: {str(e)}")


@router.get("/structure/{index_type}", response_model=IndexStructureResponse)
async def get_index_structure(index_type: str):
    """
    Get the structure of an index for visualization.
    
    Args:
        index_type: Type of index (suffix or patricia)
        
    Returns:
        Index structure in tree format
    """
    try:
        structure = await index_service.get_index_structure(index_type)
        
        if not structure:
            raise HTTPException(
                status_code=404,
                detail=f"Index of type '{index_type}' not found. Please create an index first."
            )
        
        return structure
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting index structure: {str(e)}")


@router.get("/stats/{index_type}")
async def get_index_stats(index_type: str):
    """
    Get statistics about an index.
    
    Args:
        index_type: Type of index (suffix or patricia)
        
    Returns:
        Index statistics
    """
    try:
        stats = await index_service.get_index_stats(index_type)
        
        if not stats:
            raise HTTPException(
                status_code=404,
                detail=f"Index of type '{index_type}' not found"
            )
        
        return stats
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting index stats: {str(e)}")

