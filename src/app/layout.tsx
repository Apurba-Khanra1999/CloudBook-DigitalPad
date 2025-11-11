import type {Metadata} from 'next';
import './globals.css';
import { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server";

export const metadata: Metadata = {
  title: 'CloudBook',
  description: 'A sophisticated digital notepad for focused note-taking.',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  applicationName: 'CloudBook',
  keywords: [
    'note taking app',
    'markdown notes',
    'minimal note editor',
    'folders and tags',
    'instant search',
    'productivity',
    'knowledge management',
    'PKM',
    'second brain',
    'zettelkasten',
    'Next.js notes',
    'cloud sync',
    'lucide icons',
    'tailwind ui',
    'shadcn ui'
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cloudbookx.vercel.app/'),
  openGraph: {
    title: 'CloudBook — CloudBook',
    description: 'Minimal, fast, and focused note-taking with folders, tags, and search.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cloudbookx.vercel.app/',
    siteName: 'CloudBook',
    images: [
      {
        url: 'https://temp.inktagon.com/assets/cloudbookx-digitalnotebook.png',
        width: 1200,
        height: 630,
        alt: 'CloudBook — minimal note taking',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CloudBook — Minimal Note-Taking',
    description: 'Write clearly and organize effortlessly with folders, tags, and search.',
    images: ['https://temp.inktagon.com/assets/cloudbookx-digitalnotebook.png'],
    creator: '@CloudBook',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
  category: 'productivity',
  themeColor: '#228B22',
  authors: [{ name: 'CloudBook' }],
  creator: 'CloudBook',
  publisher: 'CloudBook',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading...</div>}>
          <StackProvider app={stackServerApp}>
            <StackTheme>
              {children}
              <Toaster />
            </StackTheme>
          </StackProvider>
        </Suspense>
      </body>
    </html>
  );
}
