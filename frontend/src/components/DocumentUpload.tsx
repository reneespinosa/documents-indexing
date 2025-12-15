'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Modal } from '@/components/Modal';

export function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
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

  const uploadMutation = useMutation({
    mutationFn: (file: File) => api.uploadDocument(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setFile(null);
      setModalState({
        isOpen: true,
        title: '¡Éxito!',
        message: 'Documento subido exitosamente.',
        type: 'success',
      });
    },
    onError: (error: any) => {
      setModalState({
        isOpen: true,
        title: 'Error',
        message: `Error al subir documento: ${error.message}`,
        type: 'error',
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    uploadMutation.mutate(file);
    setUploading(false);
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <div className="glass-card p-8">
        <h2 className="text-3xl font-bold mb-6 gradient-text">Subir Documento</h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium mb-3 text-gray-300">
              Seleccionar archivo
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".txt,.md,.doc,.docx,.pdf"
                className="block w-full text-sm text-gray-200 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover file:cursor-pointer file:transition-colors bg-surface/50 border border-white/10 rounded-xl p-2 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 w-full md:w-auto"
          >
            {uploading ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">⏳</span>
                Subiendo...
              </span>
            ) : (
              'Subir Documento'
            )}
          </button>
        </div>
        {file && (
          <div className="mt-4 p-4 bg-dark-card rounded-xl border border-accent-indigo/30">
            <p className="text-sm text-gray-300 flex items-center">
              <span className="mr-2">📎</span>
              <span className="font-semibold text-accent-indigo">{file.name}</span>
              <span className="ml-2 text-gray-500">({(file.size / 1024).toFixed(2)} KB)</span>
            </p>
          </div>
        )}
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
    </>
  );
}

