import { useCallback, useState } from 'react';
import type { IDocument } from '../types/document-manager';
import { useCreateNoteMutation, useDeleteNoteMutation, useGetNotesQuery, useUpdateNoteMutation } from '../store/api/notes-api-slice';
import { useDropzone } from 'react-dropzone';
import { fileToBase64 } from '../utils/functions';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import pluralize from 'pluralize';
import type { IPostNote } from '../types/note';

export const useDocumentManager = () => {
  const [filter, setFilter] = useState('');
  const { entityId, entityTypeName } = useSelector((state: RootState) => state.pcfApi);
  console.log('🚀 ~ useDocumentManager ~ entityTypeName:', entityTypeName);
  console.log('🚀 ~ useDocumentManager ~ entityId:', entityId);
  const [createNote, { isLoading: isCreateLoading }] = useCreateNoteMutation();
  const [updateNote, { isLoading: isUpdatedNoteLoading }] = useUpdateNoteMutation();
  const [deleteNote, { isLoading: isDeleteLoading }] = useDeleteNoteMutation();
  const {
    data: notes,
    isLoading: isNoteListLoading,
    refetch,
    isError: isNoteListWithError,
    error: NoteListError,
  } = useGetNotesQuery(entityTypeName);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateFiles, setDuplicateFiles] = useState<Array<{ name: string; file: File }>>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const addFiles = useCallback(
    async (files: File[]) => {
      try {
        const createNotePromises = files.map(async file => {
          const base64String = (await fileToBase64(file)).split(',')[1];
          const createdNote = await createNote({
            filename: file.name,
            documentbody: base64String,
            mimetype: file.type,
            [`objectid_${entityTypeName}@odata.bind`]: `/${pluralize.plural(entityTypeName)}(${entityId})`,
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
    [refetch, createNote, entityId, entityTypeName],
  );

  const handleCancelDuplicates = () => {
    setShowDuplicateDialog(false);
    setPendingFiles([]);
    setDuplicateFiles([]);
  };

  const replaceFiles = useCallback(
    async (files: Array<{ name: string; file: File }>) => {
      try {
        const updateNotePromises = files.map(async ({ name, file }) => {
          const oldDoc = notes?.find(doc => doc.name === name);
          const base64String = (await fileToBase64(file)).split(',')[1];

          if (!oldDoc?.annotationid) {
            throw new Error('Annotation ID is undefined');
          }
          const patchNote: IPostNote = {
            annotationId: oldDoc?.annotationid,
            filename: file.name,
            documentbody: base64String,
            mimetype: file.type,
            [`objectid_${entityTypeName}@odata.bind`]: `/${pluralize.plural(entityTypeName)}(${entityId})`,
          };

          const updatedNote = await updateNote({ patchNote, id: oldDoc.annotationid }).unwrap();
          console.log('🚀 ~ updatedNote:', updatedNote);
          return updatedNote;
        });

        await Promise.all(updateNotePromises);
        await refetch();
      } catch (error) {
        console.error('Error creating notes:', error);
      }
    },
    [refetch, updateNote, notes, entityId, entityTypeName],
  );

  const handleConfirmDuplicates = () => {
    replaceFiles(duplicateFiles);
    if (pendingFiles.length > 0) {
      addFiles(pendingFiles);
    }
    setShowDuplicateDialog(false);
    setPendingFiles([]);
    setDuplicateFiles([]);
  };

  const onDrop = useCallback(
    async (files: File[]) => {
      const duplicates: Array<{ name: string; file: File }> = [];
      const newFiles: File[] = [];

      for (const file of files) {
        if (notes?.some(doc => doc.name === file.name)) {
          duplicates.push({ name: file.name, file });
        } else {
          newFiles.push(file);
        }
      }

      if (duplicates.length > 0) {
        setDuplicateFiles(duplicates);
        setPendingFiles(newFiles);
        setShowDuplicateDialog(true);
      } else {
        addFiles(newFiles);
      }
    },
    [addFiles, notes],
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
    isDragActive,
    notes,
    isNoteListLoading,
    isDeleteLoading,
    isCreateLoading,
    showDuplicateDialog,
    duplicateFiles,
    isUpdatedNoteLoading,
    NoteListError,
    isNoteListWithError,
    setShowDuplicateDialog,
    setFilter,
    getRootProps,
    getInputProps,
    removeDocument,
    downloadDocument,
    handleConfirmDuplicates,
    handleCancelDuplicates,
  };
};
