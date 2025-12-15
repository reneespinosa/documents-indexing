'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, SearchResponse } from '@/lib/api';

export function SearchPanel() {
  const [query, setQuery] = useState('');
  const [indexType, setIndexType] = useState<'suffix' | 'patricia'>('suffix');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: searchResults, isLoading } = useQuery<SearchResponse>({
    queryKey: ['search', searchQuery, indexType],
    queryFn: () => api.search(searchQuery, indexType),
    enabled: searchQuery.length > 0,
  });

  const handleSearch = () => {
    if (query.trim()) {
      setSearchQuery(query.trim());
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-8">
        <h2 className="text-3xl font-bold mb-6 gradient-text">Búsqueda</h2>
        
        <div className="mb-6 flex gap-4">
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

        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Escribe tu búsqueda..."
            className="flex-1 px-6 py-4 bg-dark-card border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20 transition-all"
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
          <h3 className="text-3xl font-bold mb-6 gradient-text">
            Resultados ({searchResults.total_results})
          </h3>
          
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
                  <div className="flex flex-wrap gap-2 mb-3">
                    {result.matches.map((match, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-accent-indigo/20 text-accent-indigo rounded-lg text-sm font-semibold"
                      >
                        {match}
                      </span>
                    ))}
                  </div>
                  {result.relevance_score !== undefined && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Relevancia:</span>
                      <div className="flex-1 bg-dark-card rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-accent-indigo to-accent-purple"
                          style={{ width: `${result.relevance_score * 100}%` }}
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
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-400 text-lg">No se encontraron resultados.</p>
              <p className="text-gray-500 text-sm mt-2">Intenta con otros términos de búsqueda</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
