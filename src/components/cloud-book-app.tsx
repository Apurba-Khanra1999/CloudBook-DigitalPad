
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Folder,
  Tag as TagIcon,
  Cloud,
  Plus,
  Search,
  Book,
  Inbox,
  Trash2,
  ChevronDown,
  StickyNote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { allFolders } from '@/lib/mock-data';
import type { Note, Folder as FolderType, Tag as TagType } from '@/lib/types';
import { NoteEditor } from './note-editor';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';


function Logo() {
  return (
    <div className="flex items-center gap-2 text-primary">
      <Cloud className="h-6 w-6" />
      <h1 className="text-lg font-bold text-foreground">CloudBook</h1>
    </div>
  );
}

const tagColors = [
    'text-blue-500',
    'text-green-500',
    'text-yellow-500',
    'text-red-500',
    'text-purple-500',
    'text-pink-500',
    'text-indigo-500',
    'text-gray-500',
];

function getRandomTagColor() {
    return tagColors[Math.floor(Math.random() * tagColors.length)];
}

type CloudBookUser = {
  displayName?: string;
  primaryEmail?: string;
  profileImageUrl?: string;
};

export function CloudBookApp({ user }: { user?: CloudBookUser }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders] = useState<FolderType[]>(allFolders);
  const [tags, setTags] = useState<TagType[]>([]);

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<{
    type: 'all' | 'folder' | 'tag';
    id: string | null;
  }>({ type: 'folder', id: 'notes' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTag, setSearchTag] = useState<string>('all');
  const { toast } = useToast();

  const filteredNotes = useMemo(() => {
    let notesToFilter = notes;

    // 1. Sidebar filter
    if (filter.type === 'folder') {
        if(filter.id !== 'all' && filter.id) {
             notesToFilter = notes.filter(n => n.folderId === filter.id);
        }
    } else if (filter.type === 'tag') {
      notesToFilter = notes.filter(n => n.tags.includes(filter.id!));
    }
    
    // 2. Search query filter
    if (searchQuery) {
        notesToFilter = notesToFilter.filter(
            note =>
              note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              note.content.toLowerCase().includes(searchQuery.toLowerCase())
          );
    }
    
    // 3. Search tag filter
    if (searchTag && searchTag !== 'all') {
        notesToFilter = notesToFilter.filter(note => note.tags.includes(searchTag));
    }

    return notesToFilter.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes, filter, searchQuery, searchTag]);
  
  useEffect(() => {
    // Fetch user-specific notes
    (async () => {
      try {
        const res = await fetch('/api/notes', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load notes');
        const data = await res.json();
        const loaded: Note[] = data?.notes || [];
        setNotes(loaded);
        // Derive tags from notes
        const uniqueTags = Array.from(new Set(loaded.flatMap(n => n.tags))).map((id) => ({
          id,
          name: id,
          color: getRandomTagColor(),
        }));
        setTags(uniqueTags);
        // Select first note by default
        if (!activeNoteId && loaded.length > 0) {
          setActiveNoteId(loaded[0].id);
        }
      } catch (e) {
        toast({ title: 'Error', description: 'Unable to load notes' });
      }
    })();
  }, []);

  useEffect(() => {
    // Maintain active selection within filtered list
    if (!activeNoteId && filteredNotes.length > 0) {
      setActiveNoteId(filteredNotes[0].id);
    }
    if (activeNoteId && !filteredNotes.some(n => n.id === activeNoteId)) {
      setActiveNoteId(null);
    }
  }, [activeNoteId, filteredNotes]);

  const handleSelectNote = (noteId: string) => {
    setActiveNoteId(noteId);
  };

  const handleNoteUpdate = async (updatedNote: Note) => {
    try {
      const res = await fetch(`/api/notes/${updatedNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: updatedNote.title,
          content: updatedNote.content,
          folderId: updatedNote.folderId,
          tags: updatedNote.tags,
        }),
      });
      if (!res.ok) throw new Error('Failed to update note');
      const data = await res.json();
      const saved: Note = data.note;
      setNotes(notes.map(n => (n.id === saved.id ? saved : n)).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
      // Refresh tags from all notes, preserving existing tag names/colors when possible
      const allTagIds = Array.from(new Set((notes.map(n => n.tags).flat()).concat(saved.tags)));
      const mergedTags: TagType[] = allTagIds.map(id => {
        const existing = tags.find(t => t.id === id);
        return existing ? existing : { id, name: id, color: getRandomTagColor() };
      });
      setTags(mergedTags);
    } catch (e) {
      toast({ title: 'Error', description: 'Unable to save changes' });
    }
  };
  
  const handleNoteDelete = async (noteId: string) => {
    try {
      const noteToDelete = notes.find(n => n.id === noteId);
      const res = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setNotes(notes => notes.filter(n => n.id !== noteId));
      toast({
        title: 'Note deleted',
        description: `The note "${noteToDelete?.title || 'Untitled'}" has been removed.`,
      });
      if (activeNoteId === noteId) {
        const remainingNotes = filteredNotes.filter(n => n.id !== noteId);
        if (remainingNotes.length > 0) {
          const currentIndex = filteredNotes.findIndex(n => n.id === noteId);
          const nextNote = remainingNotes[Math.min(currentIndex, remainingNotes.length - 1)];
          setActiveNoteId(nextNote.id);
        } else {
          setActiveNoteId(null);
        }
      }
    } catch (e) {
      toast({ title: 'Error', description: 'Unable to delete note' });
    }
  };

  const handleNewNote = async () => {
    try {
      const folderId = filter.type === 'folder' && filter.id && filter.id !== 'all' ? filter.id : 'notes';
      const tagsForNew = filter.type === 'tag' && filter.id ? [filter.id] : [];
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Note', content: '', folderId, tags: tagsForNew }),
      });
      if (!res.ok) throw new Error('Failed to create note');
      const data = await res.json();
      const created: Note = data.note;
      setNotes([created, ...notes]);
      setActiveNoteId(created.id);
      // add any new tag to tag list while preserving existing names/colors
      const allTagIds = Array.from(new Set([...tags.map(t => t.id), ...created.tags]));
      const mergedTags: TagType[] = allTagIds.map(id => {
        const existing = tags.find(t => t.id === id);
        return existing ? existing : { id, name: id, color: getRandomTagColor() };
      });
      setTags(mergedTags);
      toast({ title: 'Note created', description: 'A new note has been added.' });
    } catch (e) {
      toast({ title: 'Error', description: 'Unable to create note' });
    }
  };

  const handleTagCreate = (tagName: string) => {
    if (tagName && !tags.find(t => t.name.toLowerCase() === tagName.toLowerCase())) {
        const newTag: TagType = {
            id: tagName.toLowerCase().replace(/\s/g, '-'),
            name: tagName,
            color: getRandomTagColor(),
        };
        setTags([...tags, newTag]);
        toast({
            title: "Tag created",
            description: `The tag "${tagName}" has been created.`,
        });
        return newTag;
    }
    // If tag exists, return it to be added to the note
    return tags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
  };

  const handleTagRename = (tagId: string, newName: string) => {
    if (!newName.trim()) return;
    // Prevent renaming to an existing tag name (case-insensitive)
    const exists = tags.find(t => t.name.toLowerCase() === newName.trim().toLowerCase() && t.id !== tagId);
    if (exists) {
      toast({ title: 'Tag name in use', description: 'Choose a different name.' });
      return;
    }
    setTags(tags.map(t => (t.id === tagId ? { ...t, name: newName.trim() } : t)));
    toast({ title: 'Tag updated', description: `Tag renamed to "${newName.trim()}".` });
  };

  const handleTagDelete = async (tagId: string) => {
    // Remove tag from tag list
    setTags(prev => prev.filter(t => t.id !== tagId));
    // Remove tag from all notes and persist each change
    const notesWithTag = notes.filter(n => n.tags.includes(tagId));
    const updatedNotes = notes.map(n => (n.tags.includes(tagId) ? { ...n, tags: n.tags.filter(t => t !== tagId) } : n));
    setNotes(updatedNotes);
    try {
      await Promise.allSettled(
        notesWithTag.map(n =>
          fetch(`/api/notes/${n.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: n.title, content: n.content, folderId: n.folderId, tags: n.tags.filter(t => t !== tagId) }),
          })
        )
      );
      toast({ title: 'Tag deleted', description: 'Removed from tag list and affected notes.' });
    } catch (e) {
      toast({ title: 'Error', description: 'Unable to persist tag deletion for some notes.' });
    }
  };

  const activeNote = useMemo(() => notes.find(n => n.id === activeNoteId), [
    notes,
    activeNoteId,
  ]);
  
  const getFilterName = () => {
    if (filter.type === 'folder') {
        if(filter.id === 'all') return 'All Notes';
        return folders.find(f => f.id === filter.id)?.name;
    }
    if (filter.type === 'tag') {
        return tags.find(t => t.id === filter.id)?.name;
    }
    return 'All Notes';
  }

  const MainSidebar = () => (
     <div className="w-64 flex flex-col border-r bg-sidebar text-sidebar-foreground">
        <div className="h-14 flex items-center px-4">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto">
            <div className="p-4">
                <Button variant="default" className="w-full justify-center" onClick={handleNewNote}>
                <Plus className="mr-2 h-4 w-4" />
                New Note
                </Button>
            </div>
            <div className="px-4">
                <h3 className="px-2 text-xs font-medium text-muted-foreground mb-2">Folders</h3>
                <ul>
                <li>
                    <Button
                        variant={filter.type === 'folder' && filter.id === 'all' ? 'secondary': 'ghost'}
                        className="w-full justify-start group"
                        onClick={() => setFilter({ type: 'folder', id: 'all' })}
                    >
                        <span className={cn(
                          'mr-2 inline-flex h-6 w-6 items-center justify-center rounded-md transition-all duration-200',
                          filter.type === 'folder' && filter.id === 'all'
                            ? 'bg-primary/15 text-primary shadow-sm group-hover:shadow-md'
                            : 'bg-muted/40 text-muted-foreground group-hover:bg-muted/60'
                        )}>
                          <Book className="h-4 w-4" />
                        </span>
                        All Notes
                    </Button>
                </li>
                {folders.map(folder => (
                    <li key={folder.id}>
                    <Button
                        variant={filter.type === 'folder' && filter.id === folder.id ? 'secondary': 'ghost'}
                        className="w-full justify-start group"
                        onClick={() => setFilter({ type: 'folder', id: folder.id })}
                    >
                        <span className={cn(
                          'mr-2 inline-flex h-6 w-6 items-center justify-center rounded-md transition-all duration-200',
                          filter.type === 'folder' && filter.id === folder.id
                            ? 'bg-primary/15 text-primary shadow-sm group-hover:shadow-md'
                            : 'bg-muted/40 text-muted-foreground group-hover:bg-muted/60'
                        )}>
                          <folder.icon className="h-4 w-4" />
                        </span>
                        {folder.name}
                    </Button>
                    </li>
                ))}
                </ul>
            </div>
            <div className="px-4 mt-4">
                <h3 className="px-2 text-xs font-medium text-muted-foreground mb-2">Tags</h3>
                <ul>
                {tags.map(tag => (
                    <li key={tag.id}>
                    <Button
                        variant={filter.type === 'tag' && filter.id === tag.id ? 'secondary' : 'ghost'}
                        className="w-full justify-start group"
                        onClick={() => setFilter({ type: 'tag', id: tag.id })}
                    >
                        <span className={cn(
                          'mr-2 inline-flex h-6 w-6 items-center justify-center rounded-md transition-all duration-200 ring-1 ring-black/5',
                          filter.type === 'tag' && filter.id === tag.id
                            ? 'bg-primary/15 text-primary shadow-sm group-hover:shadow-md'
                            : 'bg-muted/40 group-hover:bg-muted/60',
                          tag.color
                        )}>
                          <TagIcon className="h-4 w-4" />
                        </span>
                        {tag.name}
                    </Button>
                    </li>
                ))}
                </ul>
            </div>
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              {user?.profileImageUrl ? (
                <AvatarImage src={user.profileImageUrl} alt={user.displayName || 'Profile'} />
              ) : (
                <AvatarImage src="https://picsum.photos/seed/1/100/100" alt="Profile" />
              )}
              <AvatarFallback>
                {(user?.displayName || 'U').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-semibold">
                {user?.displayName || 'User'}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user?.primaryEmail || 'user@cloudbook.com'}
              </span>
            </div>
            <Button asChild variant="outline" size="sm" className="shrink-0">
              <Link href="/handler/sign-out">Log out</Link>
            </Button>
          </div>
        </div>
      </div>
  )

  return (
    <div className="flex h-screen bg-background">
      <MainSidebar />
      <main className="flex-1 flex flex-col min-h-0">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex-1">
            <h1 className="text-lg font-semibold tracking-tight">
              {getFilterName()}
            </h1>
          </div>
          <div className="relative ml-auto flex-1 md:grow-0">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px] rounded-r-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-l-none -ml-px w-36 justify-between">
                    <span className="truncate">{searchTag === 'all' ? 'All Tags' : tags.find(t => t.id === searchTag)?.name}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter by tag</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={searchTag} onValueChange={setSearchTag}>
                    <DropdownMenuRadioItem value="all">All Tags</DropdownMenuRadioItem>
                    {tags.map(tag => (
                      <DropdownMenuRadioItem key={tag.id} value={tag.id}>{tag.name}</DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
            <div
                className={cn(
                    'w-full flex-col border-r bg-background/95 md:w-80 lg:w-96 flex'
                )}
            >
                <ScrollArea className="flex-1">
                    <div className="p-2">
                    {filteredNotes.length > 0 ? (
                    filteredNotes.map(note => (
                        <button
                        key={note.id}
                        onClick={() => handleSelectNote(note.id)}
                        className={cn(
                            'block w-full text-left p-3 rounded-lg transition-colors',
                            activeNoteId === note.id
                            ? 'bg-primary/10'
                            : 'hover:bg-accent'
                        )}
                        >
                        <h3 className="font-semibold text-sm truncate mb-1">{note.title || "Untitled Note"}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                            {note.content.replace(/#/g, '').trim().split('\n')[0] || "No additional content"}
                        </p>
                        <time className="text-xs text-muted-foreground/80 mt-1 block">
                            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                        </time>
                        </button>
                    ))
                    ) : (
                    <div className="text-center p-8 text-sm text-muted-foreground">
                        No notes found.
                    </div>
                    )}
                    </div>
                </ScrollArea>
            </div>
            <div
                className={cn(
                    'flex-1 flex flex-col'
                )}
            >
            <NoteEditor 
                note={activeNote} 
                onNoteUpdate={handleNoteUpdate} 
                onNoteDelete={handleNoteDelete}
                allTags={tags}
                onTagCreate={handleTagCreate}
                onTagRename={handleTagRename}
                onTagDelete={handleTagDelete}
            />
            </div>
        </div>
      </main>
    </div>
  );
}
