import { useQuery, useMutation, useQueryClient } from 'react-query';
import type { INote, IPostNote } from '../types/note';
import type { IDocument } from '../types/document-manager';
import { base64ToBlob } from '../utils/functions';
import { usePCFStore } from '../store/context-store';

const createApiClient = (baseUrl: string) => ({
  getNotes: async (entityId: string) => {
    const response = await fetch(
      `${baseUrl}/api/data/v9.2/annotations?$select=annotationid,notetext,documentbody,filename,filesize,isdocument,mimetype,_objectid_value,subject&$filter=(isdocument eq true and _objectid_value eq ${entityId})`,
    );
    const data = await response.json();
    return data.value.map((note: INote) => ({
      annotationid: note.annotationid,
      name: note.filename,
      type: note.mimetype,
      url: URL.createObjectURL(base64ToBlob(note.documentbody, note.mimetype)),
    }));
  },

  createNote: async (note: Omit<IPostNote, 'annotationId'>) => {
    const response = await fetch(`${baseUrl}/api/data/v9.2/annotations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    return await response.json();
  },

  updateNote: async ({ patchNote, id }: { patchNote: Omit<IPostNote, 'annotationId'>; id: string }) => {
    const response = await fetch(`${baseUrl}/api/data/v9.2/annotations(${id})`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patchNote),
    });
    return response.ok;
  },

  deleteNote: async (annotationId: string) => {
    const response = await fetch(`${baseUrl}/api/data/v9.2/annotations(${annotationId})`, {
      method: 'DELETE',
    });
    return response.ok;
  },
});

export const useNotes = () => {
  const queryClient = useQueryClient();
  const { baseUrl, entityId } = usePCFStore();
  const api = createApiClient(baseUrl);

  const {
    data: notes,
    isLoading: isNoteListLoading,
    error,
    refetch: refetchNotes,
  } = useQuery<IDocument[]>({
    queryKey: ['notes', entityId],
    queryFn: () => api.getNotes(entityId),
    enabled: !!baseUrl && !!entityId,
  });

  const createNoteMutation = useMutation({
    mutationFn: api.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', entityId] });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: api.updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', entityId] });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: api.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', entityId] });
    },
  });

  return {
    notes,
    isNoteListLoading,
    error,
    refetchNotes,
    createNote: createNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
    deleteNote: deleteNoteMutation.mutate,
    isCreateLoading: createNoteMutation.isLoading,
    isUpdateLoading: updateNoteMutation.isLoading,
    isDeleteLoading: deleteNoteMutation.isLoading,
  };
};
