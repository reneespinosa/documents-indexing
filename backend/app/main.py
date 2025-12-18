"""
FastAPI main application entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import documents, indexing, search, index_management
from app.core.config import settings
from app.db import init_db

app = FastAPI(
    title="Document Indexing System",
    description="Sistema de indexación de documentos usando Suffix Tree y PATRICIA Tree",
    version="1.0.0"
)

# CORS middleware para permitir comunicación con frontend
# En Docker, el frontend está en el mismo network, así que permitimos todos los orígenes
# En producción, deberías especificar solo tu dominio
import os
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar base de datos
init_db(app)

# Incluir routers
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(indexing.router, prefix="/api/indexing", tags=["indexing"])
app.include_router(search.router, prefix="/api/search", tags=["search"])
app.include_router(index_management.router, prefix="/api/index", tags=["index-management"])


@app.get("/")
async def root():
    """Endpoint raíz para verificar que el servidor está funcionando."""
    return {
        "message": "Document Indexing System API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

