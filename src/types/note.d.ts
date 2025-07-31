export interface Note {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  relatedTo?: {
    type: 'algorithm' | 'problem' | 'video';
    id: string;
  };
}

export type NoteCreatePayload = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;
export type NoteUpdatePayload = Partial<NoteCreatePayload>;
