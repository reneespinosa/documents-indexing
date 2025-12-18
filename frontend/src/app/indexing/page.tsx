'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Modal } from '@/components/Modal';

export default function IndexingPage() {
  const [indexType, setIndexType] = useState<'suffix' | 'patricia'>('suffix');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'default' | 'success' | 'error';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'default',
  });

  const queryClient = useQueryClient();

  const { data: documents } = useQuery({
    queryKey: ['documents'],
    queryFn: () => api.getDocuments(),
  });

  const { data: suffixStatus } = useQuery({
    queryKey: ['index-status', 'suffix'],
    queryFn: () => api.getIndexStatus('suffix'),
  });

  const { data: patriciaStatus } = useQuery({
    queryKey: ['index-status', 'patricia'],
    queryFn: () => api.getIndexStatus('patricia'),
  });

  const createIndexMutation = useMutation({
    mutationFn: (type: 'suffix' | 'patricia') => api.createIndex(type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['index-status'] });
      queryClient.invalidateQueries({ queryKey: ['index-structure'] });
      queryClient.invalidateQueries({ queryKey: ['index-stats'] });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['index-status'] });
      }, 2000);

      setModalState({
        isOpen: true,
        title: '¡Éxito!',
        message: 'Índice creado exitosamente. Ahora puedes visualizar su estructura o realizar búsquedas.',
        type: 'success',
      });
    },
    onError: (error: any) => {
      setModalState({
        isOpen: true,
        title: 'Error',
        message: `Error al crear índice: ${error.message}`,
        type: 'error',
      });
    },
  });

  const handleCreateIndex = () => {
    if (!documents || documents.documents.length === 0) {
      setModalState({
        isOpen: true,
        title: 'Atención',
        message: 'No hay documentos para indexar. Por favor, sube documentos primero.',
        type: 'error',
      });
      return;
    }
    createIndexMutation.mutate(indexType);
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-accent-indigo hover:text-accent-purple transition-colors mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-5xl font-bold mb-4 gradient-text">Crear Índices</h1>
          <p className="text-gray-400 text-lg">Genera índices usando Suffix Tree o PATRICIA Tree</p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium mb-3 text-gray-300">
            Selecciona el tipo de índice a crear
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setIndexType('suffix')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${indexType === 'suffix'
                  ? 'bg-gradient-to-r from-accent-indigo to-accent-purple text-white shadow-lg scale-105'
                  : 'btn-secondary hover:bg-white/5'
                }`}
            >
              🌲 Suffix Tree
            </button>
            <button
              onClick={() => setIndexType('patricia')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${indexType === 'patricia'
                  ? 'bg-gradient-to-r from-accent-purple to-accent-emerald text-white shadow-lg scale-105'
                  : 'btn-secondary hover:bg-white/5'
                }`}
            >
              🌳 PATRICIA Tree
            </button>
          </div>
          <p className="mt-3 text-sm text-gray-400">
            {indexType === 'suffix' 
              ? 'Suffix Tree: Ideal para búsqueda de subcadenas dentro de palabras'
              : 'PATRICIA Tree: Optimizado para búsqueda por prefijo de palabras'}
          </p>
        </div>

        <div className="glass-card p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 gradient-text">
            Crear Índice {indexType === 'suffix' ? 'Suffix Tree' : 'PATRICIA Tree'}
          </h2>

          {documents && documents.documents.length > 0 ? (
            <div>
              <p className="mb-6 text-gray-300 text-lg">
                Se indexarán <span className="text-accent-indigo font-bold">{documents.documents.length}</span> documento(s) disponible(s).
              </p>
              <button
                onClick={handleCreateIndex}
                disabled={createIndexMutation.isPending}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {createIndexMutation.isPending ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">⏳</span>
                    Creando índice...
                  </span>
                ) : (
                  'Crear Índice'
                )}
              </button>
            </div>
          ) : (
            <div className="glass-card p-6 border-yellow-500/30 bg-yellow-500/10">
              <p className="text-yellow-300 mb-4 flex items-center">
                <span className="mr-2">⚠️</span>
                No hay documentos disponibles para indexar.
              </p>
              <Link
                href="/documents"
                className="text-accent-indigo hover:text-accent-purple transition-colors inline-flex items-center"
              >
                Ir a subir documentos →
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6">
            <h3 className="text-2xl font-bold mb-4 text-white flex items-center">
              <span className="mr-2">🌲</span>
              Suffix Tree
            </h3>
            {suffixStatus ? (
              <div>
                <p className={`mb-4 text-lg font-semibold ${suffixStatus.exists ? 'text-accent-emerald' : 'text-gray-500'}`}>
                  {suffixStatus.exists ? '✓ Índice creado' : '✗ Índice no creado'}
                </p>
                {suffixStatus.exists && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-dark-card rounded-lg">
                      <span className="text-gray-400">Palabras:</span>
                      <span className="text-white font-bold">{suffixStatus.word_count || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-dark-card rounded-lg">
                      <span className="text-gray-400">Documentos:</span>
                      <span className="text-white font-bold">{suffixStatus.document_count || 0}</span>
                    </div>
                    {suffixStatus.created_at && (
                      <p className="text-gray-500 text-sm">
                        Creado: {new Date(suffixStatus.created_at).toLocaleString('es-ES')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Cargando...</p>
            )}
          </div>

          <div className="glass-card p-6">
            <h3 className="text-2xl font-bold mb-4 text-white flex items-center">
              <span className="mr-2">🌳</span>
              PATRICIA Tree
            </h3>
            {patriciaStatus ? (
              <div>
                <p className={`mb-4 text-lg font-semibold ${patriciaStatus.exists ? 'text-accent-emerald' : 'text-gray-500'}`}>
                  {patriciaStatus.exists ? '✓ Índice creado' : '✗ Índice no creado'}
                </p>
                {patriciaStatus.exists && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-dark-card rounded-lg">
                      <span className="text-gray-400">Palabras:</span>
                      <span className="text-white font-bold">{patriciaStatus.word_count || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-dark-card rounded-lg">
                      <span className="text-gray-400">Documentos:</span>
                      <span className="text-white font-bold">{patriciaStatus.document_count || 0}</span>
                    </div>
                    {patriciaStatus.created_at && (
                      <p className="text-gray-500 text-sm">
                        Creado: {new Date(patriciaStatus.created_at).toLocaleString('es-ES')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Cargando...</p>
            )}
          </div>
        </div>

        <div className="glass-card p-8">
          <h3 className="text-2xl font-bold mb-6 gradient-text">Información</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-dark-card rounded-xl border border-accent-indigo/20">
              <h4 className="text-xl font-semibold text-white mb-3 flex items-center">
                <span className="mr-2">🌲</span>
                Suffix Tree
              </h4>
              <p className="text-gray-400 leading-relaxed">
                Permite búsqueda de subcadenas dentro de palabras. Útil para encontrar palabras que contienen un patrón específico.
              </p>
            </div>
            <div className="p-6 bg-dark-card rounded-xl border border-accent-purple/20">
              <h4 className="text-xl font-semibold text-white mb-3 flex items-center">
                <span className="mr-2">🌳</span>
                PATRICIA Tree
              </h4>
              <p className="text-gray-400 leading-relaxed">
                Optimizado para búsqueda por prefijo. Eficiente para palabras que comparten prefijos comunes.
              </p>
            </div>
          </div>
        </div>

        <Modal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          title={modalState.title}
          type={modalState.type}
        >
          <div className="text-gray-200 text-lg leading-relaxed">
            {modalState.message}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={closeModal}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
