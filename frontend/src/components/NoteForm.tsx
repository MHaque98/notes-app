import { useState, useEffect, FormEvent } from "react";
import { Note, NoteFormData } from "../types/note";

interface NoteFormProps {
  note?: Note | null;
  onSubmit: (noteData: NoteFormData) => void;
  onCancel?: () => void;
}

function NoteForm({ note, onSubmit, onCancel }: NoteFormProps) {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
    } else {
      setTitle("");
      setContent("");
    }
  }, [note]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) {
      return; // Don't submit empty notes
    }
    onSubmit({
      ...(note ? { id: note.id } : {}),
      title: title.trim(),
      content: content.trim(),
    });
    // Reset form if creating new note
    if (!note) {
      setTitle("");
      setContent("");
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    // Reset form
    setTitle("");
    setContent("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
    >
      <div className="mb-4">
        <label
          htmlFor="note-title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Title
        </label>
        <input
          id="note-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="note-content"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Content
        </label>
        <textarea
          id="note-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter note content..."
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-y"
        />
      </div>
      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!title.trim() && !content.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {note ? "Update Note" : "Create Note"}
        </button>
      </div>
    </form>
  );
}

export default NoteForm;
