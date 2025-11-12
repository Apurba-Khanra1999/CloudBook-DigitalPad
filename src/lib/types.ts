import type { LucideIcon } from 'lucide-react';

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  tags: string[];
  pinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  icon: LucideIcon;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}
