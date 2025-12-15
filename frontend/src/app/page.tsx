import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-secondary/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header Section */}
        <div className="text-center mb-24 animate-slide-up">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-surface/50 border border-white/10 backdrop-blur-md">
            <span className="text-sm font-medium text-primary-light tracking-wide uppercase">Next-Gen Indexing System</span>
          </div>
          <h1 className="text-7xl font-bold mb-8 tracking-tight">
            Sistema de <br />
            <span className="gradient-text">Indexación de Documentos</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed text-balance">
            Potenciado por estructuras de datos avanzadas. Experimenta la velocidad de <span className="text-accent-emerald font-semibold">Suffix Tree</span> y la eficiencia de <span className="text-accent-violet font-semibold">PATRICIA Tree</span>.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link href="/documents" className="btn-primary flex items-center gap-2 group">
              <span>Comenzar Ahora</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/search" className="btn-secondary">
              Ir a Búsqueda
            </Link>
          </div>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          <Link href="/documents" className="glass-card p-8 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Documentos</h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              Gestiona tu biblioteca de documentos. Sube, visualiza y prepara archivos para el proceso de indexación.
            </p>
            <div className="flex items-center text-primary-light text-sm font-medium">
              <span className="group-hover:mr-2 transition-all">Gestionar</span>
              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>

          <Link href="/indexing" className="glass-card p-8 group relative overflow-hidden animation-delay-200">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24 text-accent-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent-violet/10 flex items-center justify-center mb-6 text-accent-violet group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Crear Índices</h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              Construye índices optimizados. Elige entre Suffix Tree para velocidad o PATRICIA Tree para eficiencia.
            </p>
            <div className="flex items-center text-accent-violet text-sm font-medium">
              <span className="group-hover:mr-2 transition-all">Configurar</span>
              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>

          <Link href="/index-viewer" className="glass-card p-8 group relative overflow-hidden animation-delay-400">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24 text-accent-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
              </svg>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent-emerald/10 flex items-center justify-center mb-6 text-accent-emerald group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Visualizar</h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              Explora la estructura interna de tus índices. Visualización gráfica interactiva de los árboles generados.
            </p>
            <div className="flex items-center text-accent-emerald text-sm font-medium">
              <span className="group-hover:mr-2 transition-all">Ver Estructura</span>
              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>

          <Link href="/search" className="glass-card p-8 group relative overflow-hidden animation-delay-400">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center mb-6 text-accent-cyan group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Búsqueda</h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              Realiza búsquedas instantáneas. Encuentra patrones y términos en milisegundos usando tus índices.
            </p>
            <div className="flex items-center text-accent-cyan text-sm font-medium">
              <span className="group-hover:mr-2 transition-all">Buscar</span>
              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="glass-panel rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Tecnología de Vanguardia</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Nuestra plataforma utiliza algoritmos avanzados para garantizar el máximo rendimiento en la indexación y recuperación de información.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-surface/30 hover:bg-surface/50 transition-colors border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-accent-emerald/20 flex items-center justify-center mb-4 text-accent-emerald">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Suffix Tree</h4>
              <p className="text-text-secondary text-sm">
                Estructura ideal para búsquedas de subcadenas en tiempo lineal. Perfecta para análisis genómico y procesamiento de texto masivo.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface/30 hover:bg-surface/50 transition-colors border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-accent-violet/20 flex items-center justify-center mb-4 text-accent-violet">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">PATRICIA Tree</h4>
              <p className="text-text-secondary text-sm">
                Radix tree optimizado que comprime caminos de un solo hijo. Maximiza la eficiencia de memoria para claves largas y compartidas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface/30 hover:bg-surface/50 transition-colors border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-4 text-primary">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Visualización D3</h4>
              <p className="text-text-secondary text-sm">
                Renderizado interactivo de estructuras de datos. Haz zoom, paneo y explora los nodos de tus índices en tiempo real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

