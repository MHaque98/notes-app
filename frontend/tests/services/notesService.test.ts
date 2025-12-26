import { describe, it, expect, vi, beforeEach } from "vitest";
import * as api from "../../src/services/api";
import {
  fetchNotes,
  fetchNote,
  createNote,
  updateNote,
  deleteNote,
  noteFormDataToRequest,
} from "../../src/services/notesService";
import { Note, NoteFormData } from "../../src/types/note";

// Mock the api module
vi.mock("../../src/services/api", () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  del: vi.fn(),
}));

describe("notesService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchNotes", () => {
    it("should fetch all notes", async () => {
      const mockNotes: Note[] = [
        {
          id: "1",
          title: "Note 1",
          content: "Content 1",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      ];

      vi.mocked(api.get).mockResolvedValue(mockNotes);

      const result = await fetchNotes();

      expect(api.get).toHaveBeenCalledWith("/notes");
      expect(result).toEqual(mockNotes);
    });
  });

  describe("fetchNote", () => {
    it("should fetch a single note by ID", async () => {
      const mockNote: Note = {
        id: "1",
        title: "Note 1",
        content: "Content 1",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };

      vi.mocked(api.get).mockResolvedValue(mockNote);

      const result = await fetchNote("1");

      expect(api.get).toHaveBeenCalledWith("/notes/1");
      expect(result).toEqual(mockNote);
    });
  });

  describe("createNote", () => {
    it("should create a new note", async () => {
      const requestData = {
        title: "New Note",
        content: "New Content",
      };

      const mockNote: Note = {
        id: "1",
        ...requestData,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };

      vi.mocked(api.post).mockResolvedValue(mockNote);

      const result = await createNote(requestData);

      expect(api.post).toHaveBeenCalledWith("/notes", requestData);
      expect(result).toEqual(mockNote);
    });
  });

  describe("updateNote", () => {
    it("should update an existing note", async () => {
      const requestData = {
        title: "Updated Note",
        content: "Updated Content",
      };

      const mockNote: Note = {
        id: "1",
        ...requestData,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
      };

      vi.mocked(api.put).mockResolvedValue(mockNote);

      const result = await updateNote("1", requestData);

      expect(api.put).toHaveBeenCalledWith("/notes/1", requestData);
      expect(result).toEqual(mockNote);
    });
  });

  describe("deleteNote", () => {
    it("should delete a note", async () => {
      const mockResponse = {
        message: "Note deleted successfully",
      };

      vi.mocked(api.del).mockResolvedValue(mockResponse);

      const result = await deleteNote("1");

      expect(api.del).toHaveBeenCalledWith("/notes/1");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("noteFormDataToRequest", () => {
    it("should convert NoteFormData to request format", () => {
      const formData: NoteFormData = {
        id: "1",
        title: "Test Title",
        content: "Test Content",
      };

      const result = noteFormDataToRequest(formData);

      expect(result).toEqual({
        title: "Test Title",
        content: "Test Content",
      });
      expect(result).not.toHaveProperty("id");
    });

    it("should handle NoteFormData without id", () => {
      const formData: NoteFormData = {
        title: "Test Title",
        content: "Test Content",
      };

      const result = noteFormDataToRequest(formData);

      expect(result).toEqual({
        title: "Test Title",
        content: "Test Content",
      });
    });
  });
});
