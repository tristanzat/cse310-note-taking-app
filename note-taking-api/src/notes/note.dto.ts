// Classes (not interfaces) so Nest's decorator metadata can reference them.
export class CreateNoteDto {
  title!: string;
  content?: string;
}

export class UpdateNoteDto {
  title?: string;
  content?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
