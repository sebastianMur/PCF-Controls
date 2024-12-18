import { useCallback, useState } from 'react';
import type { IDocument } from '../types/document-manager';
import { useGetNotesQuery } from '../store/api/notes-api-slice';
import { useDropzone } from 'react-dropzone';

export const useDocumentManager = () => {
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [filter, setFilter] = useState('');
  const { data: notes, isLoading } = useGetNotesQuery();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newDocuments = acceptedFiles.map(file => ({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    }));

    setDocuments(prev => [...prev, ...newDocuments]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeDocument = useCallback((index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  }, []);

  const downloadDocument = useCallback((doc: IDocument) => {
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return {
    documents,
    filter,
    setFilter,
    getRootProps,
    getInputProps,
    isDragActive,
    removeDocument,
    downloadDocument,
    notes,
    isLoading,
  };
};
