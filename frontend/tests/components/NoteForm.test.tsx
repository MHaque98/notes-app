import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "../utils";
import userEvent from "@testing-library/user-event";
import NoteForm from "../../src/components/NoteForm";
import { Note } from "../../src/types/note";

describe("NoteForm", () => {
  it("renders form with title and content inputs", () => {
    render(<NoteForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
  });

  it("renders 'Create Note' button for new note", () => {
    render(<NoteForm onSubmit={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: /create note/i })
    ).toBeInTheDocument();
  });

  it("renders 'Update Note' button when editing existing note", () => {
    const note: Note = {
      id: "1",
      title: "Existing Note",
      content: "Existing content",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    render(<NoteForm note={note} onSubmit={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: /update note/i })
    ).toBeInTheDocument();
  });

  it("pre-fills form when editing existing note", () => {
    const note: Note = {
      id: "1",
      title: "Existing Note",
      content: "Existing content",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    render(<NoteForm note={note} onSubmit={vi.fn()} />);

    const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
    const contentInput = screen.getByLabelText(
      /content/i
    ) as HTMLTextAreaElement;

    expect(titleInput.value).toBe("Existing Note");
    expect(contentInput.value).toBe("Existing content");
  });

  it("calls onSubmit with form data when submitted", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<NoteForm onSubmit={onSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const contentInput = screen.getByLabelText(/content/i);
    const submitButton = screen.getByRole("button", { name: /create note/i });

    await user.type(titleInput, "New Note");
    await user.type(contentInput, "New content");
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: "New Note",
        content: "New content",
      });
    });
  });

  it("calls onSubmit with id when updating existing note", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const note: Note = {
      id: "1",
      title: "Existing Note",
      content: "Existing content",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    render(<NoteForm note={note} onSubmit={onSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole("button", { name: /update note/i });

    await user.clear(titleInput);
    await user.type(titleInput, "Updated Note");
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        id: "1",
        title: "Updated Note",
        content: "Existing content",
      });
    });
  });

  it("does not submit when both title and content are empty", async () => {
    const onSubmit = vi.fn();

    render(<NoteForm onSubmit={onSubmit} />);

    const submitButton = screen.getByRole("button", { name: /create note/i });
    expect(submitButton).toBeDisabled();

    // Try to submit empty form
    await userEvent.click(submitButton);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<NoteForm onSubmit={vi.fn()} onCancel={onCancel} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("does not render cancel button when onCancel is not provided", () => {
    render(<NoteForm onSubmit={vi.fn()} />);

    expect(
      screen.queryByRole("button", { name: /cancel/i })
    ).not.toBeInTheDocument();
  });

  it("trims whitespace from title and content on submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<NoteForm onSubmit={onSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const contentInput = screen.getByLabelText(/content/i);
    const submitButton = screen.getByRole("button", { name: /create note/i });

    await user.type(titleInput, "  Trimmed Title  ");
    await user.type(contentInput, "  Trimmed Content  ");
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: "Trimmed Title",
        content: "Trimmed Content",
      });
    });
  });
});
