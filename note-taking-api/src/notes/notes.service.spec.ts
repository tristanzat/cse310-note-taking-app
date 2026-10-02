import { NotFoundException, BadRequestException } from '@nestjs/common';
import { NotesService } from './notes.service.js';

describe('NotesService', () => {
  let service: NotesService;

  beforeEach(() => {
    service = new NotesService();
  });

  it('creates and lists notes', () => {
    const note = service.create({ title: ' Hello ', content: 'World' });
    expect(note.title).toBe('Hello');
    expect(service.findAll()).toEqual([note]);
  });

  it('rejects an empty title', () => {
    expect(() => service.create({ title: '  ' })).toThrow(BadRequestException);
  });

  it('updates a note', () => {
    const note = service.create({ title: 'a' });
    const updated = service.update(note.id, { content: 'b' });
    expect(updated.content).toBe('b');
    expect(updated.title).toBe('a');
  });

  it('deletes a note', () => {
    const note = service.create({ title: 'a' });
    service.remove(note.id);
    expect(() => service.findOne(note.id)).toThrow(NotFoundException);
  });
});
