
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DocumentUpload } from '@/components/DocumentUpload';
import { api, Document } from '@/lib/api';
import Link from 'next/link';
import { Modal } from '@/components/Modal';

export default function DocumentsPage() {
  const queryClient = useQueryClient();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => api.getDocuments(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setShowDeleteConfirm(false);
      setDocumentToDelete(null);
    },
  });

  const handleDelete = (doc: Document) => {
    setDocumentToDelete(doc);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      deleteMutation.mutate(documentToDelete.id);
    }
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setDocumentToDelete(null);
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setSelectedDocument(null);
  };

  return (
    <div className="min-h-screen p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-accent-indigo hover:text-accent-purple transition-colors mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-5xl font-bold mb-4 gradient-text">Gestión de Documentos</h1>
          <p className="text-gray-400 text-lg">Sube y gestiona tus documentos para indexación</p>
        </div>

        <div className="mb-12">
          <DocumentUpload />
        </div>

        <div className="glass-card p-8">
          <h2 className="text-3xl font-bold mb-6 gradient-text">Documentos Subidos</h2>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin text-4xl mb-4">⏳</div>
              <p className="text-gray-400">Cargando documentos...</p>
            </div>
          ) : documents && documents.documents.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {documents.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-surface/50 border border-white/5 rounded-xl p-6 hover:border-accent-indigo/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent-indigo/10 group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-accent-indigo transition-colors">
                        {doc.title}
                      </h3>
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <span className="mr-1">📅</span>
                          {new Date(doc.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <span className="mr-1">📝</span>
                          {doc.word_count} palabras
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDocument(doc)}
                        className="p-2 text-accent-indigo hover:bg-accent-indigo/10 rounded-lg transition-colors"
                        title="Ver contenido"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleDelete(doc)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl">
              <p className="text-gray-400 text-lg">No hay documentos subidos aún.</p>
            </div>
          )}
        </div>

        {/* Document Preview Modal */}
        <Modal
          isOpen={isPreviewOpen}
          onClose={closePreview}
          title={selectedDocument?.title || 'Vista Previa'}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm text-gray-400 border-b border-white/10 pb-2">
              <span>Palabras: {selectedDocument?.word_count}</span>
              <span>Fecha: {selectedDocument && new Date(selectedDocument.created_at).toLocaleString()}</span>
            </div>
            <div className="bg-dark-card p-4 rounded-xl border border-white/5 min-h-[200px] max-h-[60vh] overflow-y-auto custom-scrollbar">
              <pre className="text-gray-300 whitespace-pre-wrap font-sans leading-relaxed text-base">
                {selectedDocument?.content || 'No hay contenido disponible para visualizar.'}
              </pre>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={closePreview}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteConfirm}
          onClose={closeDeleteConfirm}
          title="Confirmar Eliminación"
          type="error"
        >
          <div className="text-gray-200 text-lg leading-relaxed">
            ¿Estás seguro de que deseas eliminar el documento <span className="font-bold text-white">"{documentToDelete?.title}"</span>?
            <p className="text-sm text-gray-400 mt-2">Esta acción no se puede deshacer.</p>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={closeDeleteConfirm}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

