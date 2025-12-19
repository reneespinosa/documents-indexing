'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface IndexManagerProps {
  indexType: string;
}

export function IndexManager({ indexType }: IndexManagerProps) {
  const [wordToAdd, setWordToAdd] = useState('');
  const [wordToDelete, setWordToDelete] = useState('');
  const queryClient = useQueryClient();

  const addWordMutation = useMutation({
    mutationFn: (word: string) => api.addWordToIndex(word, undefined, indexType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['index-structure', indexType] });
      queryClient.invalidateQueries({ queryKey: ['index-stats', indexType] });
      setWordToAdd('');
      alert('Palabra añadida exitosamente');
    },
    onError: (error: any) => {
      alert(`Error al añadir palabra: ${error.message}`);
    },
  });

  const deleteWordMutation = useMutation({
    mutationFn: (word: string) => api.deleteWordFromIndex(word, indexType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['index-structure', indexType] });
      queryClient.invalidateQueries({ queryKey: ['index-stats', indexType] });
      setWordToDelete('');
      alert('Palabra eliminada exitosamente');
    },
    onError: (error: any) => {
      alert(`Error al eliminar palabra: ${error.message}`);
    },
  });

  return (
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
          />
          <button
            onClick={() => {
              if (wordToDelete.trim()) {
                if (confirm(`¿Eliminar la palabra "${wordToDelete}"?`)) {
                  deleteWordMutation.mutate(wordToDelete.trim());
                }
              }
            }}
            disabled={deleteWordMutation.isPending}
            className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {deleteWordMutation.isPending ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
