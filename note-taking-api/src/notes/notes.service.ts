import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { CreateNoteDto, Note, UpdateNoteDto } from './note.dto.js';

@Injectable()
export class NotesService {
  // In-memory store; notes are lost when the server restarts.
  private readonly notes = new Map<string, Note>();

  findAll(): Note[] {
    return [...this.notes.values()];
  }

  findOne(id: string): Note {
    const note = this.notes.get(id);
    if (!note) throw new NotFoundException(`Note ${id} not found`);
    return note;
  }

  create(dto: CreateNoteDto): Note {
    const title = this.validTitle(dto?.title);
    const now = new Date().toISOString();
    const note: Note = {
      id: randomUUID(),
      title,
      content: dto.content ?? '',
      createdAt: now,
      updatedAt: now,
    };
    this.notes.set(note.id, note);
    return note;
  }

  update(id: string, dto: UpdateNoteDto): Note {
    const note = this.findOne(id);
    if (dto?.title !== undefined) note.title = this.validTitle(dto.title);
    if (dto?.content !== undefined) note.content = dto.content;
    note.updatedAt = new Date().toISOString();
    return note;
  }

  remove(id: string): void {
    this.findOne(id);
    this.notes.delete(id);
  }

  private validTitle(title: unknown): string {
    if (typeof title !== 'string' || title.trim() === '') {
      throw new BadRequestException('title must be a non-empty string');
    }
    return title.trim();
  }
}
