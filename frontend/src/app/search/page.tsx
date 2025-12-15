'use client';

import Link from 'next/link';
import { SearchPanel } from '@/components/SearchPanel';

export default function SearchPage() {
  return (
    <div className="min-h-screen p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-accent-indigo hover:text-accent-purple transition-colors mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-5xl font-bold mb-4 gradient-text">Búsqueda en Índices</h1>
          <p className="text-gray-400 text-lg">Busca términos en tus documentos indexados</p>
        </div>
        <SearchPanel />
      </div>
    </div>
  );
}
