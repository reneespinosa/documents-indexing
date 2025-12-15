"""
API routes for index creation and management.
"""
from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.api.models.index import (
    IndexCreateRequest,
    IndexStatusResponse,
    IndexType
)
from app.services.index_service import IndexService

router = APIRouter()
index_service = IndexService()


@router.post("/create")
async def create_index(request: IndexCreateRequest, background_tasks: BackgroundTasks):
    """
    Create an index (Suffix Tree or PATRICIA Tree) from documents.
    
    Args:
        request: Index creation request with type and optional document IDs
        background_tasks: FastAPI background tasks for async processing
        
    Returns:
        Success message with index type
    """
    try:
        # Iniciar indexación en background
        background_tasks.add_task(
            index_service.create_index,
            index_type=request.index_type.value,
            document_ids=request.document_ids
        )
        
        return {
            "message": f"Index creation started for {request.index_type.value} tree",
            "index_type": request.index_type.value,
            "status": "processing"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating index: {str(e)}")


@router.get("/status/{index_type}", response_model=IndexStatusResponse)
async def get_index_status(index_type: str):
    """
    Get the status of an index.
    
    Args:
        index_type: Type of index (suffix or patricia)
        
    Returns:
        Index status information
    """
    try:
        if index_type not in [IndexType.SUFFIX.value, IndexType.PATRICIA.value]:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid index type. Must be '{IndexType.SUFFIX.value}' or '{IndexType.PATRICIA.value}'"
            )
        
        status_info = await index_service.get_index_status(index_type)
        return status_info
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting index status: {str(e)}")

