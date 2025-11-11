import { Folder, Note, Tag } from './types';
import { Inbox, Book, Edit3, Trash2, StickyNote } from 'lucide-react';
import { format } from 'date-fns';

export const allFolders: Folder[] = [
  { id: 'notes', name: 'Notes', icon: StickyNote },
  { id: 'projects', name: 'Projects', icon: Book },
  { id: 'trash', name: 'Trash', icon: Trash2 },
];

export const allTags: Tag[] = [
  { id: 'work', name: 'Work', color: 'text-blue-500' },
  { id: 'personal', name: 'Personal', color: 'text-green-500' },
  { id: 'ideas', name: 'Ideas', color: 'text-yellow-500' },
  { id: 'urgent', name: 'Urgent', color: 'text-red-500' },
];

const now = new Date();

export const allNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Project Proposal',
    content: `
# Project CloudBook Proposal

## 1. Introduction
A new paradigm in digital note-taking.

## 2. Features
- **Rich Text Editing**: Support for Markdown.
- **Organization**: Folders and tags.
- **Search**: Full-text search capabilities.
`,
    folderId: 'projects',
    tags: ['work', 'ideas'],
    createdAt: format(now, 'yyyy-MM-dd HH:mm'),
    updatedAt: format(now, 'yyyy-MM-dd HH:mm'),
  },
  {
    id: 'note-2',
    title: 'Meeting Notes',
    content: `
# Q2 Planning Meeting

## Attendees
- Alice
- Bob
- Charlie

## Action Items
1. Finalize budget for marketing campaign.
2. Draft blog post for new feature launch.
`,
    folderId: 'notes',
    tags: ['work', 'urgent'],
    createdAt: format(now, 'yyyy-MM-dd HH:mm'),
    updatedAt: format(now, 'yyyy-MM-dd HH:mm'),
  },
  {
    id: 'note-3',
    title: 'Grocery List',
    content: `
- Milk
- Bread
- Cheese
- Apples
`,
    folderId: 'notes',
    tags: ['personal'],
    createdAt: format(now, 'yyyy-MM-dd HH:mm'),
    updatedAt: format(now, 'yyyy-MM-dd HH:mm'),
  },
    {
    id: 'note-4',
    title: 'My novel idea',
    content: `A story about a cat who learns to code. It's a journey of self-discovery and debugging.`,
    folderId: 'notes',
    tags: ['personal', 'ideas'],
    createdAt: format(now, 'yyyy-MM-dd HH:mm'),
    updatedAt: format(now, 'yyyy-MM-dd HH:mm'),
  },
    {
    id: 'note-5',
    title: 'Old recipe',
    content: `An old lasagna recipe. Might need to update it.`,
    folderId: 'trash',
    tags: [],
    createdAt: format(now, 'yyyy-MM-dd HH:mm'),
    updatedAt: format(now, 'yyyy-MM-dd HH:mm'),
  },
];
