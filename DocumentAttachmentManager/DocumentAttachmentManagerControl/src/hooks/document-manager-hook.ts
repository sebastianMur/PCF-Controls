import { useCallback, useState } from 'react';
import type { IDocument } from '../types/document-manager';
import { useCreateNoteMutation, useDeleteNoteMutation, useGetNotesQuery } from '../store/api/notes-api-slice';
import { useDropzone } from 'react-dropzone';
import { fileToBase64 } from '../utils/functions';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import pluralize from 'pluralize';

export const useDocumentManager = () => {
  const [filter, setFilter] = useState('');
  const { data: notes, isLoading: isNoteListLoading, refetch } = useGetNotesQuery();
  const { entityId, entityTypeName } = useSelector((state: RootState) => state.pcfApi);
  const [createNote, { isLoading: isCreateLoading }] = useCreateNoteMutation();
  const [deleteNote, { isLoading: isDeleteLoading }] = useDeleteNoteMutation();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const createNotePromises = acceptedFiles.map(async file => {
          const base64String = (await fileToBase64(file)).split(',')[1];
          const createdNote = await createNote({
            filename: file.name,
            documentbody: base64String,
            mimetype: file.type,
            [`objectid_${entityTypeName}@odata.bind`]: `/${pluralize(entityTypeName)}(${entityId})`,
          }).unwrap();
          console.log('🚀 ~ createdNote:', createdNote);
          return createdNote;
        });

        await Promise.all(createNotePromises);
        await refetch();
      } catch (error) {
        console.error('Error creating notes:', error);
      }
    },
    [createNote, refetch, entityId, entityTypeName],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeDocument = useCallback(
    async (annotationId: string) => {
      const deletedNote = await deleteNote(annotationId).unwrap();
      await refetch();
      console.log('🚀 ~ useDocumentManager ~ deletedNote:', deletedNote);
    },
    [deleteNote, refetch],
  );

  const downloadDocument = useCallback((doc: IDocument) => {
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return {
    filter,
    setFilter,
    getRootProps,
    getInputProps,
    isDragActive,
    removeDocument,
    downloadDocument,
    notes,
    isNoteListLoading,
    isDeleteLoading,
    isCreateLoading,
  };
};
