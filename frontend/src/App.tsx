import { useState } from "react";
import Layout from "./components/Layout";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import { Note, NoteFormData } from "./types/note";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleCreateNote = (noteData: NoteFormData) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: noteData.title,
      content: noteData.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setShowForm(false);
    setEditingNote(null);
  };

  const handleUpdateNote = (noteData: NoteFormData) => {
    if (!noteData.id) return;
    
    setNotes(
      notes.map((note) =>
        note.id === noteData.id
          ? { 
              ...note, 
              title: noteData.title,
              content: noteData.content,
              updatedAt: new Date().toISOString() 
            }
          : note
      )
    );
    setEditingNote(null);
    setShowForm(false);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleDelete = (noteId: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes(notes.filter((note) => note.id !== noteId));
      if (editingNote?.id === noteId) {
        setEditingNote(null);
        setShowForm(false);
      }
    }
  };

  const handleFormSubmit = (noteData: NoteFormData) => {
    if (editingNote) {
      handleUpdateNote(noteData);
    } else {
      handleCreateNote(noteData);
    }
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

        <NoteList notes={notes} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </Layout>
  );
}

export default App;

