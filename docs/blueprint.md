# CloudBook

An elegant, focused note-taking application built on Next.js. CloudBook emphasizes clarity, speed, and a minimalist writing experience with folders, tags, search, pinning, and theme control. Authentication is handled via Stack and JWT cookies, and data is stored in PostgreSQL.

## Overview

- Purpose: Provide a calm, structured notebook for everyday writing and organization.
- Scope: Notes, folders, tags, instant search, and simple, reliable editing.
- Current State: Notes are backed by PostgreSQL via Next.js API routes. Authentication uses Stack and JWT cookies. The UI includes pinning and a dark/light theme toggle.

## Tech Stack

- Framework: Next.js 15 (App Router, Turbopack)
- Language: TypeScript
- UI: ShadCN UI + Tailwind CSS + Lucide icons
- Auth: Stack (`@stackframe/stack`) + JWT cookies
- Storage: PostgreSQL (via `DATABASE_URL`), schema defined in `src/lib/db.ts`
- AI: Genkit (foundation present, optional)

## Environments & Configuration

Configure `.env.local` with:

- `NEXT_PUBLIC_STACK_PROJECT_ID`: Stack project ID
- `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`: Stack publishable key
- `STACK_SECRET_SERVER_KEY`: Stack server secret for server-side verification
- `DATABASE_URL`: PostgreSQL connection string

These are loaded at runtime; the app uses server-side cookies and Stack for session verification.

## Features (Current)

- Notes list with folders and tags.
- Instant local search over title, content, and tags.
- Focused editor with manual Save/Update and Delete actions.
- Tag creation and assignment from the editor.
- Pin notes to keep important items at the top.
- Dark/Light theme toggle in headers (light default, preference persisted).
- Auth pages for login and signup; redirect to dashboard.
- Landing page auto-redirects to dashboard when authenticated.

## Recent Changes

- Manual note saving introduced to replace autosave, improving typing performance and removing keystroke-induced network calls.
- Landing page now redirects authenticated users to the dashboard (`/app`).
- Added pinning system:
  - Database column `pinned BOOLEAN NOT NULL DEFAULT FALSE`.
  - `GET /api/notes` sorts by `pinned DESC, updated_at DESC`.
  - `POST/PUT` accept `pinned` and persist it.
- Added dark/light theme toggle in headers:
  - Uses `localStorage` to persist user preference.
  - Applies `dark` class on `document.documentElement` for Tailwind’s `dark` variant.

## Data Model

Defined in `src/lib/db.ts` (PostgreSQL):

- `users`

  - `id` (primary key)
  - `name`
  - `email` (unique)
  - `created_at` (timestamp)

- `notes`
  - `id` (primary key)
  - `user_id` (foreign key → `users.id`)
  - `title`
  - `content`
  - `folder_id` (string identifier for grouping)
  - `tags` (array of strings)
  - `pinned` (boolean, default `false`)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

Helpers include `getUserByEmail`, `createUser`, `ensureUserByEmail`, and basic note queries. Table creation ensures `users` is created before `notes` to avoid FK errors.

## Authentication Flow

- Login & Signup: `src/app/login/page.tsx`, `src/app/signup/page.tsx`
  - On success, set secure cookies and redirect to `/app`.
- Session verification: `src/lib/auth.ts` (`verifySession`) and Stack server helpers in `src/stack/server.ts`.
- Landing page (`src/app/page.tsx`): server-side check for Stack/JWT cookies; redirects authenticated users to `/app`.

## API

- `GET /api/notes` → List notes for the authenticated user.

  - Response: `Note[]` including `pinned`; ordered by `pinned DESC, updated_at DESC`.

- `POST /api/notes` → Create a note.

  - Body: `{ title, content, folderId?, tags?, pinned? }`

- `PUT /api/notes/:id` → Update a note.

  - Body: `{ title?, content?, folderId?, tags?, pinned? }`

- `DELETE /api/notes/:id` → Delete a note.

Ensure session validation in each route and map `user_id` from the verified session. Database operations should respect the schema above.

## Frontend Architecture

- Entry: `src/app/app/page.tsx` (dashboard)
- Main app: `src/components/cloud-book-app.tsx`
  - Local state for notes, folders, tags.
  - Filtering by folder/tag and instant search.
  - `handleNewNote`, `handleNoteUpdate`, and server-backed CRUD via `/api/notes`.
  - Sorting keeps pinned notes at the top of the current filter.
- Editor: `src/components/note-editor.tsx`
  - Local state for `title`, `content`, and tags.
  - Manual Save/Update button calls `onNoteUpdate` once, only when clicked.
  - Pin/Unpin button toggles `pinned` via `onTogglePinned`.
  - Delete uses a confirmation dialog.
 - Theme: `src/components/theme-toggle.tsx` in headers; persists theme and toggles Tailwind `dark` variant.

## UX Behavior

- Manual Save/Update: The button enables when there are unsaved changes. The label switches between "Save" (new) and "Update" (existing). No autosave occurs while typing.
- Tag management: Create tags inline, assign/unassign via popover in editor.
- Filters: Sidebar filter controls by folder/tag; search bar narrows the list by title/content/tags.
- Pinning: Clicking the pin icon toggles a note’s `pinned` status; pinned notes float to the top of the list.
- Theme: A header toggle switches between light and dark modes; selection persists across sessions.
- Feedback: Toasts for create and delete actions; human-friendly `updatedAt` display.

## Style Guidelines

- Background: Off-white `#F0F8FF` for a calm writing surface.
- Primary: Forest green `#228B22` for accents and focus elements.
- Accent: Light gray `#D3D3D3` for subtle UI contrast.
- Typography: `Inter` for body and headlines.
- Icons: Minimalist Lucide in forest green where appropriate.
- Layout: Clean, minimalist; subtle transitions and feedback animations.

## Development

- Install: `npm install`
- Dev server: `npm run dev` (Turbopack, typically `http://localhost:9002`)
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Build: `npm run build`
- Start: `npm run start`

## Deployment

- Firebase App Hosting: `apphosting.yaml` present; scale via `maxInstances`.
- Env management: Use `.env.local` for local dev; deploy secrets via platform config.

## Testing & Validation

- Manual: Verify login/signup flows, landing redirect, and note editor Save/Update.
- API (when enabled): Exercise `GET/POST/PUT/DELETE /api/notes` with an authenticated session.
- UI checks: Ensure filters, search, and toasts behave as expected.

## Security & Privacy

- Cookies: `secure` in production; HttpOnly for server-managed JWT; Stack SDK used for verification.
- Data: Notes scoped to `user_id`; avoid leaking data across users.
- Input: Sanitize content if rendering as Markdown; avoid XSS.

## Roadmap

- Replace mock data with live PostgreSQL reads/writes.
- Markdown formatting and preview in the editor.
- Full-text search via database features or a search service.
- Offline-friendly caching and optional cloud sync.
- Folder/tag management from a dedicated settings view.

---

This document reflects the current implementation and near-term plans. Use it as the source of truth for development, testing, and onboarding.
