import { useState } from "react";
import Layout from "./components/Layout";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import { Note, NoteFormData } from "./types/note";
import { useNotes, useNoteMutation, useDeleteNote } from "./hooks/useNotes";

function App() {
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  // React Query hooks
  const { data: notes = [], isLoading, error } = useNotes();
  const noteMutation = useNoteMutation();
  const deleteNoteMutation = useDeleteNote();

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleDelete = (noteId: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNoteMutation.mutate(noteId, {
        onSuccess: () => {
          if (editingNote?.id === noteId) {
            setEditingNote(null);
            setShowForm(false);
          }
        },
      });
    }
  };

  const handleFormSubmit = (noteData: NoteFormData) => {
    noteMutation
      .mutateAsync(noteData)
      .then(() => {
        setShowForm(false);
        setEditingNote(null);
      })
      .catch((error: Error) => {
        console.error("Failed to save note:", error);
        alert("Failed to save note. Please try again.");
      });
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingNote(null);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">My Notes</h2>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              + New Note
            </button>
          )}
        </div>

        {showForm && (
          <div>
            <NoteForm
              note={editingNote}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        <NoteList
          notes={notes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
          error={error?.message || null}
        />
      </div>
    </Layout>
  );
}

export default App;
