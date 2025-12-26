import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../utils";
import userEvent from "@testing-library/user-event";
import NoteCard from "../../src/components/NoteCard";
import { Note } from "../../src/types/note";

describe("NoteCard", () => {
  const mockNote: Note = {
    id: "1",
    title: "Test Note",
    content: "This is a test note content",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  };

  it("renders note title and content", () => {
    render(<NoteCard note={mockNote} />);

    expect(screen.getByText("Test Note")).toBeInTheDocument();
    expect(screen.getByText("This is a test note content")).toBeInTheDocument();
  });

  it("displays 'Untitled Note' when title is empty", () => {
    const noteWithoutTitle: Note = {
      ...mockNote,
      title: "",
    };
    render(<NoteCard note={noteWithoutTitle} />);

    expect(screen.getByText("Untitled Note")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(<NoteCard note={mockNote} onEdit={onEdit} />);

    const editButton = screen.getByLabelText("Edit note");
    await user.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(mockNote);
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("calls onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(<NoteCard note={mockNote} onDelete={onDelete} />);

    const deleteButton = screen.getByLabelText("Delete note");
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(mockNote.id);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("does not render edit button when onEdit is not provided", () => {
    render(<NoteCard note={mockNote} />);

    expect(screen.queryByLabelText("Edit note")).not.toBeInTheDocument();
  });

  it("does not render delete button when onDelete is not provided", () => {
    render(<NoteCard note={mockNote} />);

    expect(screen.queryByLabelText("Delete note")).not.toBeInTheDocument();
  });

  it("displays formatted creation date", () => {
    render(<NoteCard note={mockNote} />);

    expect(screen.getByText(/Created:/)).toBeInTheDocument();
  });

  it("displays updated date when different from creation date", () => {
    const updatedNote: Note = {
      ...mockNote,
      updatedAt: "2024-01-02T00:00:00Z",
    };
    render(<NoteCard note={updatedNote} />);

    expect(screen.getByText(/Created:/)).toBeInTheDocument();
    expect(screen.getByText(/Updated:/)).toBeInTheDocument();
  });

  it("does not display updated date when same as creation date", () => {
    render(<NoteCard note={mockNote} />);

    expect(screen.getByText(/Created:/)).toBeInTheDocument();
    expect(screen.queryByText(/Updated:/)).not.toBeInTheDocument();
  });
});
