"""
Ejemplo de uso de los módulos de indexación.
"""
import sys
import os

# Agregar el directorio raíz al path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.modules.suffix_tree_index import SuffixTreeIndex
from app.modules.patricia_tree_index import PatriciaTreeIndex
from app.utils.text_processor import tokenize


def example_suffix_tree():
    """Ejemplo de uso de Suffix Tree Index."""
    print("=" * 50)
    print("Ejemplo: Suffix Tree Index")
    print("=" * 50)
    
    # Crear índice
    index = SuffixTreeIndex()
    
    # Agregar documentos
    doc1_text = "Python es un lenguaje de programación"
    doc2_text = "Java y Python son lenguajes populares"
    doc3_text = "Aprende programación en Python"
    
    index.add_document("doc1", tokenize(doc1_text))
    index.add_document("doc2", tokenize(doc2_text))
    index.add_document("doc3", tokenize(doc3_text))
    
    print(f"\nDocumentos indexados: {len(index.document_to_words)}")
    print(f"Palabras únicas: {len(index.word_to_documents)}")
    
    # Buscar
    print("\n--- Búsquedas ---")
    queries = ["python", "thon", "programación", "lenguaje"]
    
    for query in queries:
        results = index.search(query)
        print(f"Búsqueda '{query}': {len(results)} documentos encontrados")
        for doc_id in results:
            print(f"  - {doc_id}")
    
    # Estadísticas
    print("\n--- Estadísticas ---")
    stats = index.get_statistics()
    for key, value in stats.items():
        print(f"{key}: {value}")


def example_patricia_tree():
    """Ejemplo de uso de PATRICIA Tree Index."""
    print("\n" + "=" * 50)
    print("Ejemplo: PATRICIA Tree Index")
    print("=" * 50)
    
    # Crear índice
    index = PatriciaTreeIndex()
    
    # Agregar documentos
    doc1_text = "Python es un lenguaje de programación"
    doc2_text = "Java y Python son lenguajes populares"
    doc3_text = "Aprende programación en Python"
    
    index.add_document("doc1", tokenize(doc1_text))
    index.add_document("doc2", tokenize(doc2_text))
    index.add_document("doc3", tokenize(doc3_text))
    
    print(f"\nDocumentos indexados: {len(index.document_to_words)}")
    print(f"Palabras únicas: {len(index.word_to_documents)}")
    
    # Buscar
    print("\n--- Búsquedas ---")
    queries = ["python", "prog", "leng", "java"]
    
    for query in queries:
        results = index.search(query)
        print(f"Búsqueda '{query}': {len(results)} documentos encontrados")
        for doc_id in results:
            print(f"  - {doc_id}")
    
    # Estadísticas
    print("\n--- Estadísticas ---")
    stats = index.get_statistics()
    for key, value in stats.items():
        print(f"{key}: {value}")


def example_word_management():
    """Ejemplo de gestión de palabras (añadir/eliminar)."""
    print("\n" + "=" * 50)
    print("Ejemplo: Gestión de Palabras")
    print("=" * 50)
    
    index = SuffixTreeIndex()
    index.add_document("doc1", tokenize("Python es genial"))
    
    print(f"\nPalabras antes: {sorted(index.get_all_words())}")
    
    # Añadir palabra
    index.add_word("nuevo", "doc1")
    print(f"Palabras después de añadir 'nuevo': {sorted(index.get_all_words())}")
    
    # Eliminar palabra
    index.remove_word("genial")
    print(f"Palabras después de eliminar 'genial': {sorted(index.get_all_words())}")


if __name__ == "__main__":
    try:
        example_suffix_tree()
        example_patricia_tree()
        example_word_management()
        print("\n" + "=" * 50)
        print("Ejemplos completados exitosamente!")
        print("=" * 50)
    except Exception as e:
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()

