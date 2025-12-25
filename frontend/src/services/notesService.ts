import { get, post, put, del } from "./api";
import { Note, NoteFormData } from "../types/note";

/**
 * Notes API service
 * Handles all API calls related to notes
 */

export interface CreateNoteRequest {
  title: string;
  content: string;
}

export interface UpdateNoteRequest {
  title: string;
  content: string;
}

export interface DeleteNoteResponse {
  message: string;
}

/**
 * Fetch all notes
 */
export async function fetchNotes(): Promise<Note[]> {
  return get<Note[]>("/notes");
}

/**
 * Fetch a single note by ID
 */
export async function fetchNote(id: string): Promise<Note> {
  return get<Note>(`/notes/${id}`);
}

/**
 * Create a new note
 */
export async function createNote(data: CreateNoteRequest): Promise<Note> {
  return post<Note>("/notes", data);
}

/**
 * Update an existing note
 */
export async function updateNote(
  id: string,
  data: UpdateNoteRequest
): Promise<Note> {
  return put<Note>(`/notes/${id}`, data);
}

/**
 * Delete a note
 */
export async function deleteNote(id: string): Promise<DeleteNoteResponse> {
  return del<DeleteNoteResponse>(`/notes/${id}`);
}

/**
 * Helper to convert NoteFormData to API request format
 */
export function noteFormDataToRequest(
  data: NoteFormData
): CreateNoteRequest | UpdateNoteRequest {
  return {
    title: data.title,
    content: data.content,
  };
}
