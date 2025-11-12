
'use client';

import React, { useState, useEffect } from 'react';
import type { Note, Tag } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Edit3, Tag as TagIcon, Trash2, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

interface NoteEditorProps {
  note: Note | undefined | null;
  onNoteUpdate: (updatedNote: Note) => void;
  onMoveToTrash: (noteId: string) => void;
  onRestore: (noteId: string) => void;
  onDeletePermanent: (noteId: string) => void;
  allTags: Tag[];
  onTagCreate: (tagName: string) => Tag | undefined;
  onTagRename: (tagId: string, newName: string) => void;
  onTagDelete: (tagId: string) => void;
}

export function NoteEditor({ note, onNoteUpdate, onMoveToTrash, onRestore, onDeletePermanent, allTags, onTagCreate, onTagRename, onTagDelete }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [localTags, setLocalTags] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState<string>('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setLocalTags(note.tags);
      setDirty(false);
    } else {
      setTitle('');
      setContent('');
      setLocalTags([]);
      setDirty(false);
    }
  }, [note]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (note) setDirty(true);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (note) setDirty(true);
  };
  
  const handleTagToggle = (tagId: string) => {
    if (!note) return;
    const newTags = localTags.includes(tagId)
      ? localTags.filter(t => t !== tagId)
      : [...localTags, tagId];
    setLocalTags(newTags);
    setDirty(true);
  };

  const handleCreateTag = () => {
    if (newTagName.trim()) {
        const newTag = onTagCreate(newTagName.trim());
        if (newTag && note) {
            const newTags = [...new Set([...localTags, newTag.id])];
            setLocalTags(newTags);
            setDirty(true);
        }
        setNewTagName('');
    }
  };

  const handleStartEditTag = (tagId: string, currentName: string) => {
    setEditingTagId(tagId);
    setEditingTagName(currentName);
  };

  const handleCommitEditTag = () => {
    if (!editingTagId) return;
    const trimmed = editingTagName.trim();
    if (!trimmed) return;
    onTagRename(editingTagId, trimmed);
    setEditingTagId(null);
    setEditingTagName('');
  };

  const handleDeleteTag = (tagId: string) => {
    onTagDelete(tagId);
    // Remove from local selection for current note
    setLocalTags(prev => prev.filter(t => t !== tagId));
    setDirty(true);
  };

  const handleMoveToTrash = () => {
    if (note) {
      onMoveToTrash(note.id);
    }
  };

  const handleRestore = () => {
    if (note) {
      onRestore(note.id);
    }
  };

  const handlePermanentDelete = () => {
    if (note) {
      onDeletePermanent(note.id);
    }
  };

  const handleSaveUpdate = async () => {
    if (!note || saving || !dirty) return;
    try {
      setSaving(true);
      onNoteUpdate({ ...note, title, content, tags: localTags, updatedAt: new Date().toISOString() });
      setDirty(false);
    } finally {
      setSaving(false);
    }
  };

  if (!note) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-background/95 p-8 text-center text-muted-foreground">
        <Edit3 className="h-16 w-16 text-primary/20" />
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-foreground">Select a note</h2>
          <p className="mx-auto max-w-xs text-sm">
            Choose a note from the list to view or edit it, or create a new one to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 bg-background/95">
      <div className="mx-auto w-full max-w-4xl p-4 md:p-6 lg:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
            <div>
                <Input
                value={title}
                onChange={handleTitleChange}
                placeholder="Note title"
                className="mb-2 h-auto border-none bg-transparent p-0 text-3xl font-bold shadow-none focus-visible:ring-0 lg:text-4xl"
                />
                <div className="text-sm text-muted-foreground">
                    Last updated: {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveUpdate}
                  disabled={!dirty || saving}
                >
                  {note.createdAt === note.updatedAt ? (dirty ? 'Save' : 'Saved') : (dirty ? 'Update' : 'Updated')}
                </Button>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <TagIcon className="h-5 w-5" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                        <div className="grid gap-4">
                            <h4 className="font-medium leading-none">Tags</h4>
                            <ScrollArea className="h-40">
                              <div className="grid gap-2 p-1">
                                  {allTags.map((tag) => (
                                      <div key={tag.id} className="flex items-center gap-2">
                                          <Checkbox
                                              id={`tag-${tag.id}`}
                                              checked={localTags.includes(tag.id)}
                                              onCheckedChange={() => handleTagToggle(tag.id)}
                                          />
                                          {editingTagId === tag.id ? (
                                            <div className="flex items-center gap-2 w-full">
                                              <Input
                                                className="h-8"
                                                value={editingTagName}
                                                onChange={(e) => setEditingTagName(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleCommitEditTag()}
                                              />
                                              <Button size="sm" variant="secondary" onClick={handleCommitEditTag}>Save</Button>
                                              <Button size="sm" variant="ghost" onClick={() => { setEditingTagId(null); setEditingTagName(''); }}>Cancel</Button>
                                            </div>
                                          ) : (
                                            <div className="flex items-center justify-between gap-2 w-full">
                                              <label
                                                htmlFor={`tag-${tag.id}`}
                                                className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                              >
                                                <TagIcon className={cn("h-4 w-4", tag.color)} />
                                                {tag.name}
                                              </label>
                                              <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleStartEditTag(tag.id, tag.name)}>
                                                  <Edit3 className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                  <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10">
                                                      <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                  </AlertDialogTrigger>
                                                  <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                      <AlertDialogTitle>Delete tag?</AlertDialogTitle>
                                                      <AlertDialogDescription>
                                                        This will remove the tag "{tag.name}" and untag affected notes.
                                                      </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                      <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleDeleteTag(tag.id)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                  </AlertDialogContent>
                                                </AlertDialog>
                                              </div>
                                            </div>
                                          )}
                                      </div>
                                  ))}
                              </div>
                            </ScrollArea>
                            <Separator />
                             <div className="space-y-2">
                                <p className="text-sm font-medium">New Tag</p>
                                <div className="flex gap-2">
                                    <Input 
                                        placeholder="Tag name" 
                                        value={newTagName} 
                                        onChange={(e) => setNewTagName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
                                    />
                                    <Button size="icon" variant="outline" onClick={handleCreateTag}><Plus className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                {note.folderId !== 'trash' ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-amber-600 hover:text-amber-700 hover:bg-amber-600/10">
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Move to Trash?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will move "{note.title}" to Trash. You can restore it later or delete permanently from Trash.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleMoveToTrash} className="bg-amber-600 hover:bg-amber-700">Move to Trash</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleRestore}>Restore</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete permanently?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. It will permanently delete "{note.title}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handlePermanentDelete} className="bg-destructive hover:bg-destructive/90">Delete Permanently</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
            </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
            {localTags.map(tagId => {
                const tag = allTags.find(t => t.id === tagId);
                if (!tag) return null;
                return <Badge key={tagId} variant="secondary" className="flex items-center gap-1.5"><TagIcon className={cn("h-3 w-3", tag.color)} />{tag.name}</Badge>
            })}
        </div>

        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing..."
          className="h-full min-h-[calc(100vh-250px)] w-full resize-none border-none bg-transparent p-0 text-base leading-relaxed shadow-none focus-visible:ring-0 lg:text-lg"
        />
      </div>
    </ScrollArea>
  );
}
