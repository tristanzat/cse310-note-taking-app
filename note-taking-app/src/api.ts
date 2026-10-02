export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface NoteInput {
  title: string
  content: string
}

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) {
    // Nest error bodies look like { message: string | string[] }
    const body = await res.json().catch(() => null)
    throw new Error(body?.message ?? `Request failed (${res.status})`)
  }
  // 204 No Content has no body to parse.
  return res.status === 204 ? (undefined as T) : res.json()
}

export const api = {
  list: () => request<Note[]>('/notes'),
  create: (input: NoteInput) =>
    request<Note>('/notes', { method: 'POST', body: JSON.stringify(input) }),
  update: (id: string, input: NoteInput) =>
    request<Note>(`/notes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
  remove: (id: string) => request<void>(`/notes/${id}`, { method: 'DELETE' }),
}
