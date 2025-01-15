import { useCallback, useState, useEffect } from 'react';
import type { IDocument } from '../types/document-manager';
import { useDropzone } from 'react-dropzone';
import { fileToBase64 } from '../utils/functions';
import pluralize from 'pluralize';
import type { IPostNote } from '../types/note';
import { useErrorHandler } from './use-error-handler';
import { usePCFStore } from '../store/context-store';
import { useNotes } from '../services/notes-api-slice';

export const useDocumentManager = () => {
  const { error, handleError, clearError } = useErrorHandler();
  const { entityId, entityTypeName } = usePCFStore();
  const {
    notes,
    error: noteListError,
    createNote,
    updateNote,
    deleteNote,
    isNoteListLoading,
    isCreateLoading,
    isRefetching,
    isUpdateLoading,
    isDeleteLoading,
  } = useNotes();

  const [filter, setFilter] = useState('');
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateFiles, setDuplicateFiles] = useState<Array<{ name: string; file: File }>>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  console.log('🚀 ~ useDocumentManager :');
  // Validate PCF context
  useEffect(() => {
    if (!entityId || !entityTypeName) {
      console.warn('Missing PCF context:', { entityId, entityTypeName });
      handleError(new Error('Required PCF context values are missing'), 'Initialization');
    }
  }, [entityId, entityTypeName, handleError]);

  // Handle API errors
  useEffect(() => {
    if (noteListError) {
      handleError(noteListError, 'Loading Notes');
    }
  }, [noteListError, handleError]);

  const addFiles = useCallback(
    async (files: File[]) => {
      try {
        const promises = files.map(async file => {
          const base64String = (await fileToBase64(file)).split(',')[1];

          return createNote({
            filename: file.name,
            documentbody: base64String,
            mimetype: file.type,
            [`objectid_${entityTypeName}@odata.bind`]: `/${pluralize.plural(
              pluralize.isPlural(entityTypeName) ? `${entityTypeName}es` : `${entityTypeName}`,
            )}(${entityId})`,
          });
        });

        await Promise.all(promises);

        clearError();
      } catch (error) {
        handleError(error, 'File Upload');
      }
    },
    [createNote, entityId, entityTypeName, clearError, handleError],
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
          const patchNote: Omit<IPostNote, 'annotationId'> = {
            filename: file.name,
            documentbody: base64String,
            mimetype: file.type,
            [`objectid_${entityTypeName}@odata.bind`]: `/${pluralize.plural(
              pluralize.isPlural(entityTypeName) ? `${entityTypeName}es` : `${entityTypeName}`,
            )}(${entityId})`,
          };

          const updatedNote = await updateNote({ patchNote, id: oldDoc.annotationid });

          console.log('🚀 ~ updatedNote:', updatedNote);
          return updatedNote;
        });

        await Promise.all(updateNotePromises);
      } catch (error) {
        console.error('Error creating notes:', error);
      }
    },
    [updateNote, notes, entityId, entityTypeName],
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
      const deletedNote = await deleteNote(annotationId);
      console.log('🚀 ~ useDocumentManager ~ deletedNote:', deletedNote);
    },
    [deleteNote],
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
    showDuplicateDialog,
    duplicateFiles,
    noteListError,
    setShowDuplicateDialog,
    setFilter,
    getRootProps,
    getInputProps,
    removeDocument,
    downloadDocument,
    handleConfirmDuplicates,
    handleCancelDuplicates,
    error,
    clearError,
    isLoading: isNoteListLoading || isCreateLoading || isUpdateLoading || isDeleteLoading || isRefetching,
  };
};
