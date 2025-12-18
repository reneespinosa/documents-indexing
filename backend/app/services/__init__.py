"""
Services module.
"""
from app.services.index_service import IndexService

# Instancia compartida del servicio de índices
# Esto asegura que todos los módulos usen la misma instancia
index_service = IndexService()
