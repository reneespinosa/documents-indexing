'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { IndexTreeViewer } from '@/components/IndexTreeViewer';
import { IndexManager } from '@/components/IndexManager';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function IndexViewerPage() {
  const [indexType, setIndexType] = useState<'suffix' | 'patricia'>('suffix');

  const { data: structure, isLoading } = useQuery({
    queryKey: ['index-structure', indexType],
    queryFn: () => api.getIndexStructure(indexType),
    enabled: true,
  });

  const { data: stats } = useQuery({
    queryKey: ['index-stats', indexType],
    queryFn: () => api.getIndexStats(indexType),
  });

  return (
    <div className="min-h-screen p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-accent-indigo hover:text-accent-purple transition-colors mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-5xl font-bold mb-4 gradient-text">Visualizador de Índices</h1>
          <p className="text-gray-400 text-lg">Explora la estructura de tus índices creados</p>
        </div>

        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setIndexType('suffix')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
              indexType === 'suffix'
                ? 'bg-gradient-to-r from-accent-indigo to-accent-purple text-white shadow-lg scale-105'
                : 'btn-secondary'
            }`}
          >
            🌲 Suffix Tree
          </button>
          <button
            onClick={() => setIndexType('patricia')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
              indexType === 'patricia'
                ? 'bg-gradient-to-r from-accent-purple to-accent-emerald text-white shadow-lg scale-105'
                : 'btn-secondary'
            }`}
          >
            🌳 PATRICIA Tree
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-indigo mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando estructura del índice...</p>
          </div>
        ) : structure ? (
          <div className="space-y-6">
            <div className="glass-card p-8">
              <h2 className="text-3xl font-bold mb-6 gradient-text">
                Estructura del Índice ({indexType})
              </h2>
              <IndexTreeViewer structure={structure} />
            </div>

            {stats && (
              <div className="glass-card p-8">
                <h2 className="text-3xl font-bold mb-6 gradient-text">Estadísticas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-6 bg-dark-card rounded-xl text-center">
                    <p className="text-sm text-gray-400 mb-2">Palabras</p>
                    <p className="text-4xl font-bold text-accent-indigo">{stats.word_count || 0}</p>
                  </div>
                  <div className="p-6 bg-dark-card rounded-xl text-center">
                    <p className="text-sm text-gray-400 mb-2">Documentos</p>
                    <p className="text-4xl font-bold text-accent-purple">{stats.document_count || 0}</p>
                  </div>
                  <div className="p-6 bg-dark-card rounded-xl text-center">
                    <p className="text-sm text-gray-400 mb-2">Ocurrencias</p>
                    <p className="text-4xl font-bold text-accent-emerald">{stats.total_occurrences || 0}</p>
                  </div>
                  <div className="p-6 bg-dark-card rounded-xl text-center">
                    <p className="text-sm text-gray-400 mb-2">Tipo</p>
                    <p className="text-2xl font-bold text-accent-cyan capitalize">{indexType}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="glass-card p-8">
              <h2 className="text-3xl font-bold mb-6 gradient-text">Gestión del Índice</h2>
              <IndexManager indexType={indexType} />
            </div>
          </div>
        ) : (
          <div className="glass-card p-8 border-yellow-500/30 bg-yellow-500/10">
            <div className="text-center">
              <div className="text-6xl mb-4">🌳</div>
              <p className="text-yellow-300 text-lg mb-4">
                No se ha creado un índice de tipo {indexType} aún.
              </p>
              <Link
                href="/indexing"
                className="text-accent-indigo hover:text-accent-purple transition-colors inline-flex items-center"
              >
                Ir a crear índice →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
