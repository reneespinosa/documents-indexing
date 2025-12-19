'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Modal } from '@/components/Modal';

interface IndexManagerProps {
  indexType: string;
}

export function IndexManager({ indexType }: IndexManagerProps) {
  const [wordToAdd, setWordToAdd] = useState('');
  const [wordToDelete, setWordToDelete] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [wordToDeleteConfirm, setWordToDeleteConfirm] = useState('');
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

  const addWordMutation = useMutation({
    mutationFn: (word: string) => api.addWordToIndex(word, undefined, indexType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['index-structure', indexType] });
      queryClient.invalidateQueries({ queryKey: ['index-stats', indexType] });
      setWordToAdd('');
      setModalState({
        isOpen: true,
        title: '¡Éxito!',
        message: 'Palabra añadida exitosamente.',
        type: 'success',
      });
    },
    onError: (error: any) => {
      setModalState({
        isOpen: true,
        title: 'Error',
        message: `Error al añadir palabra: ${error.message}`,
        type: 'error',
      });
    },
  });

  const deleteWordMutation = useMutation({
    mutationFn: (word: string) => api.deleteWordFromIndex(word, indexType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['index-structure', indexType] });
      queryClient.invalidateQueries({ queryKey: ['index-stats', indexType] });
      setWordToDelete('');
      setShowDeleteConfirm(false);
      setWordToDeleteConfirm('');
      setModalState({
        isOpen: true,
        title: '¡Éxito!',
        message: 'Palabra eliminada exitosamente.',
        type: 'success',
      });
    },
    onError: (error: any) => {
      setShowDeleteConfirm(false);
      setModalState({
        isOpen: true,
        title: 'Error',
        message: `Error al eliminar palabra: ${error.message}`,
        type: 'error',
      });
    },
  });

  const handleDeleteClick = () => {
    if (wordToDelete.trim()) {
      setWordToDeleteConfirm(wordToDelete.trim());
      setShowDeleteConfirm(true);
    }
  };

  const handleConfirmDelete = () => {
    if (wordToDeleteConfirm) {
      deleteWordMutation.mutate(wordToDeleteConfirm);
    }
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const closeConfirmModal = () => {
    setShowDeleteConfirm(false);
    setWordToDeleteConfirm('');
  };

  return (
    <>
      <div className="space-y-8">
        <div className="p-6 bg-dark-card rounded-xl border border-accent-emerald/20">
          <h3 className="text-xl font-bold mb-4 text-white flex items-center">
            <span className="mr-2">➕</span>
            Añadir Palabra al Índice
          </h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={wordToAdd}
              onChange={(e) => setWordToAdd(e.target.value)}
              placeholder="Escribe una palabra..."
              className="flex-1 px-6 py-3 bg-white/90 border border-white/20 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-accent-emerald focus:ring-2 focus:ring-accent-emerald/20 transition-all font-medium"
              style={{ color: '#111827' }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && wordToAdd.trim()) {
                  addWordMutation.mutate(wordToAdd.trim());
                }
              }}
            />
            <button
              onClick={() => {
                if (wordToAdd.trim()) {
                  addWordMutation.mutate(wordToAdd.trim());
                }
              }}
              disabled={addWordMutation.isPending}
              className="px-8 py-3 bg-gradient-to-r from-accent-emerald to-accent-cyan text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {addWordMutation.isPending ? 'Añadiendo...' : 'Añadir'}
            </button>
          </div>
        </div>

        <div className="p-6 bg-dark-card rounded-xl border border-red-500/20">
          <h3 className="text-xl font-bold mb-4 text-white flex items-center">
            <span className="mr-2">➖</span>
            Eliminar Palabra del Índice
          </h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={wordToDelete}
              onChange={(e) => setWordToDelete(e.target.value)}
              placeholder="Escribe una palabra..."
              className="flex-1 px-6 py-3 bg-white/90 border border-white/20 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
              style={{ color: '#111827' }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && wordToDelete.trim()) {
                  handleDeleteClick();
                }
              }}
            />
            <button
              onClick={handleDeleteClick}
              disabled={!wordToDelete.trim() || deleteWordMutation.isPending}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {deleteWordMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Modal */}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={closeConfirmModal}
        title="Confirmar Eliminación"
        type="error"
      >
        <div className="text-gray-200 text-lg leading-relaxed">
          ¿Estás seguro de que deseas eliminar la palabra <span className="font-bold text-white">"{wordToDeleteConfirm}"</span>?
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={closeConfirmModal}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmDelete}
            disabled={deleteWordMutation.isPending}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteWordMutation.isPending ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </Modal>
    </>
  );
}
