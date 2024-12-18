import { useCallback, useEffect, useState } from 'react';
import type { IDocument } from '../types/document-manager';
import { useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { useGetNotesQuery } from '../store/api/notes-api-slice';
import { useSelector } from 'react-redux';
import { setContext } from '../store/app/context-slice';
import { useDropzone } from 'react-dropzone';
import type { IInputs } from '../../generated/ManifestTypes';

export const useDocumentManager = (context: ComponentFramework.Context<IInputs>) => {
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [filter, setFilter] = useState('');
  const { data: notes, isLoading } = useGetNotesQuery();

  const dispatch = useDispatch<AppDispatch>();
  const ctx = useSelector((state: RootState) => state.pcfApi.context);

  useEffect(() => {
    dispatch(setContext(context));
  }, [dispatch, context]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newDocuments = acceptedFiles.map(file => ({
      name: file.name,
      type: file.type,
      base64: file.arrayBuffer(),
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
    ctx,
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
