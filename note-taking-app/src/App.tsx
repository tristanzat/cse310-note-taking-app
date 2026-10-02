import { useEffect, useState, type SubmitEvent } from "react";
import { api, type Note } from "./api";
import "./App.css";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .list()
      .then(setNotes)
      .catch((e: Error) => setError(e.message));
  }, []);

  function resetForm() {
    setTitle("");
    setContent("");
    setEditingId(null);
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        const updated = await api.update(editingId, { title, content });
        setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      } else {
        const created = await api.create({ title, content });
        setNotes((prev) => [...prev, created]);
      }
      resetForm();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    try {
      await api.remove(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function startEdit(note: Note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  }

  return (
    <main className="notes">
      <h1>Notes</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something..."
          rows={4}
        />
        <div className="actions">
          <button type="submit">{editingId ? "Save" : "Add note"}</button>
          {editingId && (
            <button type="button" className="secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && <p className="error">{error}</p>}

      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <div className="actions">
              <button type="button" onClick={() => startEdit(note)}>
                Edit
              </button>
              <button type="button" className="danger" onClick={() => handleDelete(note.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
        {notes.length === 0 && <p className="empty">No notes yet.</p>}
      </ul>
    </main>
  );
}

export default App;
