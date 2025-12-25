export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteFormData {
  id?: string;
  title: string;
  content: string;
}
