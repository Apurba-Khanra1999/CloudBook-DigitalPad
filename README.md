# CloudBook: A Digital Note-Taking Application

CloudBook is a sophisticated and intuitive digital notepad designed for focused note-taking and seamless organization. Built with a modern tech stack, it provides a clean, responsive, and powerful interface for managing your notes, projects, and ideas.

## ✨ Key Features

- **Rich Text Editing**: A clean, distraction-free editor for writing and formatting your notes.
- **Efficient Organization**: Use folders and customizable tags to categorize and quickly find your notes.
- **Advanced Search & Filtering**: A powerful search bar with tag-based filtering to instantly locate specific notes.
- **Responsive Design**: A fully responsive interface that works beautifully on desktops, tablets, and mobile devices.
- **Modern UI/UX**: Built with ShadCN UI and Tailwind CSS for a polished and aesthetically pleasing user experience.
 - **Pin Notes**: Pin important notes to keep them at the top of lists.
 - **Dark/Light Theme Toggle**: Quickly switch themes from the header; light is default and preference is persisted.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **AI/Generative**: [Genkit](https://firebase.google.com/docs/genkit)
 - **Database**: PostgreSQL (Neon serverless), via `src/lib/db.ts`
 - **Auth**: Stack + JWT cookies

## 📂 Project Structure

The project follows a standard Next.js App Router structure. Key directories include:

```
.
├── src
│   ├── app/                # Main application routes and pages
│   │   ├── globals.css     # Global styles and Tailwind directives
│   │   ├── layout.tsx      # Root layout for the application
│   │   └── page.tsx        # Entry point for the main application UI
│   │
│   ├── components/         # Reusable React components
│   │   ├── ui/             # ShadCN UI components
│   │   ├── cloud-book-app.tsx  # Main application component
│   │   ├── note-editor.tsx # The component for editing notes
│   │   └── theme-toggle.tsx # Header theme toggle (dark/light)
│   │
│   ├── hooks/              # Custom React hooks
│   │
│   ├── lib/                # Utility functions, types, and mock data
│   │   ├── mock-data.ts    # Initial data for notes, folders, and tags
│   │   ├── types.ts        # TypeScript type definitions
│   │   └── utils.ts        # Utility functions (e.g., `cn` for classnames)
│   │
│   └── ai/                 # Genkit AI flows and configuration
│       ├── dev.ts          # Development server entrypoint for Genkit
│       └── genkit.ts       # Genkit initialization and configuration
│
├── public/                 # Static assets (images, fonts, etc.)
│
└── tailwind.config.ts      # Tailwind CSS configuration
```

## 🏁 Getting Started

To get the application running locally, follow these steps:

### 1. Install Dependencies

First, install the necessary npm packages:

```bash
npm install
```

### 2. Run the Development Server

Once the dependencies are installed, you can start the Next.js development server:

```bash
npm run dev
```

This will start the application, typically on `http://localhost:9002`.

## 📜 Available Scripts

- `npm run dev`: Starts the Next.js development server with Turbopack.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase using Next.js's built-in ESLint configuration.
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors.
- `npm run genkit:dev`: Starts the Genkit development server for AI flows.

## 🧠 Notes & API

- Notes are stored in PostgreSQL. The `notes` table includes `pinned` (boolean, default `false`) to support pinning.
- API endpoints:
  - `GET /api/notes` – returns notes for the authenticated user, ordered by `pinned DESC, updated_at DESC`.
  - `POST /api/notes` – creates a note; accepts `title`, `content`, `folderId`, `tags`, and optional `pinned`.
  - `PUT /api/notes/:id` – updates a note; accepts the same fields and conditionally updates `pinned`.
  - `DELETE /api/notes/:id` – deletes a note.

## 🎛️ Theme Toggle

- A `ThemeToggle` button is present in both the landing page header and the app header.
- Theme preference (dark/light) is persisted in `localStorage` and applied via the `dark` class on `document.documentElement`.
