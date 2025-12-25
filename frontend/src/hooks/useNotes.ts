import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotes,
  fetchNote,
  createNote,
  updateNote,
  deleteNote,
  noteFormDataToRequest,
} from "../services/notesService";
import { NoteFormData } from "../types/note";

/**
 * Query keys for React Query
 */
export const noteKeys = {
  all: ["notes"] as const,
  lists: () => [...noteKeys.all, "list"] as const,
  list: (filters: string) => [...noteKeys.lists(), { filters }] as const,
  details: () => [...noteKeys.all, "detail"] as const,
  detail: (id: string) => [...noteKeys.details(), id] as const,
};

/**
 * Hook to fetch all notes
 */
export function useNotes() {
  return useQuery({
    queryKey: noteKeys.lists(),
    queryFn: fetchNotes,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single note by ID
 */
export function useNote(id: string) {
  return useQuery({
    queryKey: noteKeys.detail(id),
    queryFn: () => fetchNote(id),
    enabled: !!id, // Only fetch if ID is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to create a new note
 */
export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NoteFormData) => {
      const request = noteFormDataToRequest(data);
      return createNote(request);
    },
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
      queryClient.setQueryData(noteKeys.detail(newNote.id), newNote);
    },
  });
}

/**
 * Hook to update an existing note
 */
export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: NoteFormData }) => {
      const request = noteFormDataToRequest(data);
      return updateNote(id, request);
    },
    onSuccess: (updatedNote) => {
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
      queryClient.setQueryData(noteKeys.detail(updatedNote.id), updatedNote);
    },
  });
}

/**
 * Hook to delete a note
 */
export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: (_, deletedId) => {
      // Remove the note from cache
      queryClient.removeQueries({ queryKey: noteKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
    },
  });
}

/**
 * Combined hook for note mutations (create/update)
 * Provides a unified interface for form submissions
 */
export function useNoteMutation() {
  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote();

  const mutate = (data: NoteFormData) => {
    if (data.id) {
      return updateMutation.mutate({ id: data.id, data });
    } else {
      return createMutation.mutate(data);
    }
  };

  const mutateAsync = (data: NoteFormData) => {
    if (data.id) {
      return updateMutation.mutateAsync({ id: data.id, data });
    } else {
      return createMutation.mutateAsync(data);
    }
  };

  return {
    mutate,
    mutateAsync,
    isLoading: createMutation.isPending || updateMutation.isPending,
    isError: createMutation.isError || updateMutation.isError,
    error: createMutation.error || updateMutation.error,
    isSuccess: createMutation.isSuccess || updateMutation.isSuccess,
  };
}
