import { http, HttpResponse } from "msw";
import { Note } from "../types/note";

// In-memory store for mock data
let notes: Note[] = [
  {
    id: "1",
    title: "Welcome to Notes App",
    content: "This is your first note. You can edit or delete it.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Base API URL - matches AWS API Gateway structure
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const handlers = [
  // GET /notes - List all notes
  http.get(`${API_BASE_URL}/notes`, () => {
    return HttpResponse.json(notes, { status: 200 });
  }),

  // GET /notes/:id - Get a single note
  http.get(`${API_BASE_URL}/notes/:id`, ({ params }) => {
    const { id } = params;
    const note = notes.find((n) => n.id === id);

    if (!note) {
      return HttpResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return HttpResponse.json(note, { status: 200 });
  }),

  // POST /notes - Create a new note
  http.post(`${API_BASE_URL}/notes`, async ({ request }) => {
    const body = (await request.json()) as { title: string; content: string };

    if (!body.title && !body.content) {
      return HttpResponse.json(
        { error: "Title or content is required" },
        { status: 400 }
      );
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: body.title || "",
      content: body.content || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    notes = [newNote, ...notes];
    return HttpResponse.json(newNote, { status: 201 });
  }),

  // PUT /notes/:id - Update an existing note
  http.put(`${API_BASE_URL}/notes/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as { title: string; content: string };

    const noteIndex = notes.findIndex((n) => n.id === id);

    if (noteIndex === -1) {
      return HttpResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (!body.title && !body.content) {
      return HttpResponse.json(
        { error: "Title or content is required" },
        { status: 400 }
      );
    }

    const updatedNote: Note = {
      ...notes[noteIndex],
      title: body.title || notes[noteIndex].title,
      content: body.content || notes[noteIndex].content,
      updatedAt: new Date().toISOString(),
    };

    notes[noteIndex] = updatedNote;
    return HttpResponse.json(updatedNote, { status: 200 });
  }),

  // DELETE /notes/:id - Delete a note
  http.delete(`${API_BASE_URL}/notes/:id`, ({ params }) => {
    const { id } = params;
    const noteIndex = notes.findIndex((n) => n.id === id);

    if (noteIndex === -1) {
      return HttpResponse.json({ error: "Note not found" }, { status: 404 });
    }

    notes = notes.filter((n) => n.id !== id);
    return HttpResponse.json(
      { message: "Note deleted successfully" },
      { status: 200 }
    );
  }),
];
