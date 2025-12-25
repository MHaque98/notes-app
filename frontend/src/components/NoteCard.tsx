import { Note } from "../types/note";

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete?: (noteId: string) => void;
}

function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-900 truncate flex-1 mr-2">
          {note.title || "Untitled Note"}
        </h3>
        <div className="flex gap-2 flex-shrink-0">
          {onEdit && (
            <button
              onClick={() => onEdit(note)}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
              aria-label="Edit note"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(note.id)}
              className="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
              aria-label="Delete note"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      <p className="text-gray-700 mb-4 line-clamp-3 whitespace-pre-wrap">
        {note.content || ""}
      </p>
      <div className="flex flex-col justify-between items-start text-xs text-gray-500 pt-3 border-t border-gray-100">
        {note.createdAt && <span>Created: {formatDate(note.createdAt)}</span>}
        {note.updatedAt && note.updatedAt !== note.createdAt && (
          <span>Updated: {formatDate(note.updatedAt)}</span>
        )}
      </div>
    </div>
  );
}

export default NoteCard;
