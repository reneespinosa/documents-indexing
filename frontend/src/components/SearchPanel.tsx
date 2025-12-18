'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, SearchResponse } from '@/lib/api';

export function SearchPanel() {
  const [query, setQuery] = useState('');
  const [indexType, setIndexType] = useState<'suffix' | 'patricia'>('suffix');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: searchResults, isLoading, error } = useQuery<SearchResponse>({
    queryKey: ['search', searchQuery, indexType],
    queryFn: () => api.search(searchQuery, indexType),
    enabled: searchQuery.length > 0,
    retry: 1,
  });

  const handleSearch = () => {
    if (query.trim()) {
      setSearchQuery(query.trim());
    }
  };

  const handleIndexTypeChange = (newType: 'suffix' | 'patricia') => {
    setIndexType(newType);
    // Limpiar resultados anteriores al cambiar de árbol
    setSearchQuery('');
    setQuery('');
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-8">
        <h2 className="text-3xl font-bold mb-6 gradient-text">Búsqueda</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 text-gray-300">
            Tipo de Índice
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => handleIndexTypeChange('suffix')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                indexType === 'suffix'
                  ? 'bg-gradient-to-r from-accent-indigo to-accent-purple text-white shadow-lg scale-105'
                  : 'btn-secondary hover:bg-white/5'
              }`}
            >
              🌲 Suffix Tree
            </button>
            <button
              onClick={() => handleIndexTypeChange('patricia')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                indexType === 'patricia'
                  ? 'bg-gradient-to-r from-accent-purple to-accent-emerald text-white shadow-lg scale-105'
                  : 'btn-secondary hover:bg-white/5'
              }`}
            >
              🌳 PATRICIA Tree
            </button>
          </div>
          {indexType === 'suffix' && (
            <p className="mt-2 text-sm text-gray-400">
              Búsqueda de subcadenas dentro de palabras
            </p>
          )}
          {indexType === 'patricia' && (
            <p className="mt-2 text-sm text-gray-400">
              Búsqueda por prefijo de palabras
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Escribe tu búsqueda..."
            className="flex-1 px-6 py-4 bg-white/90 border border-white/20 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20 transition-all font-medium"
            style={{ color: '#111827' }}
          />
          <button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">⏳</span>
                Buscando...
              </span>
            ) : (
              '🔍 Buscar'
            )}
          </button>
        </div>
      </div>

      {searchResults && (
        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-bold gradient-text">
              Resultados ({searchResults.total_results})
            </h3>
            <span className="px-4 py-2 bg-dark-card rounded-lg text-sm text-gray-400">
              {indexType === 'suffix' ? '🌲 Suffix Tree' : '🌳 PATRICIA Tree'}
            </span>
          </div>
          
          {searchResults.results.length > 0 ? (
            <div className="space-y-4">
              {searchResults.results.map((result, index) => (
                <div
                  key={index}
                  className="glass-card p-6 hover:border-accent-indigo/50 transition-all group"
                >
                  <h4 className="font-bold text-xl text-white mb-3 group-hover:text-accent-indigo transition-colors">
                    {result.document_title}
                  </h4>
                  {result.matches.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-sm text-gray-400 mr-2">Coincidencias:</span>
                      {result.matches.map((match, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-accent-indigo/20 text-accent-indigo rounded-lg text-sm font-semibold"
                        >
                          {match}
                        </span>
                      ))}
                    </div>
                  )}
                  {result.relevance_score !== undefined && (
                    <div className="flex items-center space-x-2 mt-3">
                      <span className="text-sm text-gray-400">Relevancia:</span>
                      <div className="flex-1 bg-dark-card rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-accent-indigo to-accent-purple"
                          style={{ width: `${Math.min(result.relevance_score * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-400 font-semibold">
                        {(result.relevance_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : searchQuery.length > 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-400 text-lg">No se encontraron resultados para "{searchQuery}"</p>
              <p className="text-gray-500 text-sm mt-2">
                {indexType === 'suffix' 
                  ? 'Intenta buscar subcadenas dentro de palabras'
                  : 'Intenta buscar prefijos de palabras'}
              </p>
            </div>
          ) : null}
        </div>
      )}
      
      {error && (
        <div className="glass-card p-8 border-red-500/30 bg-red-500/10">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-red-300 text-lg mb-2">
              Error al realizar la búsqueda
            </p>
            <p className="text-gray-400 text-sm">
              {error instanceof Error ? error.message : 'Asegúrate de que el índice esté creado'}
            </p>
          </div>
        </div>
      )}

      {!searchQuery && searchResults === undefined && !error && (
        <div className="glass-card p-8 border-accent-indigo/30 bg-accent-indigo/5">
          <div className="text-center">
            <div className="text-4xl mb-4">💡</div>
            <p className="text-gray-300 text-lg mb-2">
              {indexType === 'suffix' 
                ? 'Suffix Tree: Busca subcadenas dentro de palabras'
                : 'PATRICIA Tree: Busca palabras que comienzan con tu consulta'}
            </p>
            <p className="text-gray-500 text-sm">
              Escribe tu búsqueda arriba y presiona "Buscar" o Enter
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
