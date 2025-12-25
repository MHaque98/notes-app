import { Note } from "../types/note";
import NoteCard from "./NoteCard";

interface NoteListProps {
  notes: Note[];
  onEdit?: (note: Note) => void;
  onDelete?: (noteId: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

function NoteList({
  notes,
  onEdit,
  onDelete,
  isLoading,
  error,
}: NoteListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading notes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 font-medium">Error loading notes</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500 text-lg">No notes yet</p>
        <p className="text-gray-400 text-sm mt-2">
          Create your first note to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default NoteList;
