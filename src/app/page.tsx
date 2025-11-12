import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  NotebookPen,
  Search,
  Tags,
  ShieldCheck,
  BarChart3,
  Lightbulb,
  Folder,
  Clock,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack/server";

export default async function Home() {
  // Redirect authenticated users to dashboard
  const stackUser = await stackServerApp.getUser({ or: "return-null" });
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const payload = token ? verifySession(token) : null;
  if (stackUser || payload) {
    redirect("/app");
  }
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-background to-background">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold">CloudBook</span>
          </Link>
          <nav className="hidden gap-6 text-sm text-muted-foreground sm:flex">
            <Link href="#features" className="hover:text-foreground">Features</Link>
            <Link href="#insights" className="hover:text-foreground">Insights</Link>
            <Link href="#use-cases" className="hover:text-foreground">Use Cases</Link>
            <Link href="#faq" className="hover:text-foreground">FAQ</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/handler/sign-in" className="text-sm underline">Log in</Link>
            <Button asChild variant="outline" size="sm">
              <Link href="/handler/sign-up">Sign up</Link>
            </Button>
            <Button asChild size="sm" className="group">
              <Link href="/app">
                Open App
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 bg-gradient-to-tr from-primary/20 to-secondary/30 opacity-30"
            style={{ clipPath: "polygon(74% 44%, 100% 69%, 76% 94%, 38% 89%, 0 100%, 0 52%, 24% 0, 64% 0)" }}
          />
        </div>
      </div>

      {/* Hero */}
  <section className="px-6 py-20 sm:py-24 lg:px-8">
    <div className="mx-auto max-w-6xl text-center">
      <Badge variant="secondary" className="inline-flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" /> New: Manual Save/Update for smoother editing
      </Badge>
      <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
        CloudBook — Focused notes, crystal clarity
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-pretty text-muted-foreground sm:text-lg">
        Organize ideas with folders and tags, search instantly, and write in a delightful editor. Your thoughts, beautifully structured.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Button asChild size="lg" className="group">
          <Link href="/app">
            Open the App
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="#features">Explore Features</Link>
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link href="/handler/sign-up">Start for Free</Link>
        </Button>
      </div>
    </div>
  </section>

  {/* Social proof */}
  <section className="px-6 -mt-8 pb-6 lg:px-8">
    <div className="mx-auto max-w-6xl">
      <div className="rounded-xl border bg-card/60 p-4 sm:p-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-xs font-medium text-muted-foreground">Trusted by focused teams and independent thinkers</p>
            <div className="mt-1 flex items-center justify-center gap-1 sm:justify-start">
              {/* Simple star rating visual */}
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="inline-block h-3 w-3 rounded-sm bg-primary/80" />
              ))}
              <span className="ml-2 text-xs text-muted-foreground">4.8/5 average</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["LeafWorks", "CalmNote", "FocusLab", "GreenStack"].map((name) => (
              <div key={name} className="flex h-8 items-center justify-center rounded border bg-background px-3 text-[10px] font-medium text-muted-foreground">
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>

      {/* Preview panel */}
      <section className="px-6 pb-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border bg-card shadow-sm">
            <div className="border-b bg-muted/40 p-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>
            </div>
            <div className="grid gap-0 md:grid-cols-2">
              <div className="space-y-3 p-6">
                <div className="flex items-center gap-3">
                  <NotebookPen className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Clean, distraction-free editor</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Write fast with a minimal editor that keeps focus on your content. Organize with tags and folders. Save or update when you’re ready.
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  {[
                    "Instant updates as you type",
                    "Beautiful typography and spacing",
                    "Tag and filter notes in context",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t md:border-l md:border-t-0">
                <div className="p-6">
                  <div className="rounded-xl border bg-background p-4 shadow-sm">
                    <div className="mb-3 flex gap-2">
                      <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">work</span>
                      <span className="inline-flex items-center rounded-md bg-secondary/20 px-2 py-1 text-xs text-secondary-foreground">ideas</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-3/4 rounded bg-muted" />
                      <div className="h-3 w-full rounded bg-muted" />
                      <div className="h-3 w-5/6 rounded bg-muted" />
                      <div className="h-3 w-2/3 rounded bg-muted" />
                      <div className="h-3 w-4/5 rounded bg-muted" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insights / Stats */}
      <section id="insights" className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Insights that drive clarity</h2>
            <p className="mt-4 text-muted-foreground">Built for speed, focus, and effortless organization.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BarChart3, stat: "5×", label: "Faster note retrieval" },
              { icon: Clock, stat: "Instant", label: "Filter and search" },
              { icon: ShieldCheck, stat: "Private", label: "Local editing by default" },
              { icon: Lightbulb, stat: "Focused", label: "Minimal, distraction-free UI" },
            ].map(({ icon: Icon, stat, label }) => (
              <div key={label} className="group rounded-xl border bg-card p-6 shadow-sm transition hover:shadow-md">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">{label}</span>
                </div>
                <div className="mt-2 text-2xl font-bold">{stat}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Everything you need to think clearly</h2>
            <p className="mt-4 text-muted-foreground">CloudBook brings a calm, structured experience to note-taking.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: NotebookPen, title: "Delightful editor", desc: "Fast, minimal, and beautiful writing experience." },
              { icon: Tags, title: "Folders & tags", desc: "Organize by context; filter with a click." },
              { icon: Search, title: "Instant search", desc: "Find notes by title, content, or tag instantly." },
              { icon: ShieldCheck, title: "Private by design", desc: "Your notes stay on your device during editing." },
              { icon: Sparkles, title: "Smart filters", desc: "Combine text search with tag scoping to narrow quickly." },
              { icon: ArrowRight, title: "Seamless flow", desc: "Create, edit, and filter without breaking focus." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group rounded-xl border bg-card p-6 shadow-sm transition hover:shadow-md">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">{title}</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Made for your day-to-day</h2>
            <p className="mt-4 text-muted-foreground">CloudBook adapts to work, personal life, and ideas.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Folder, title: "Work", desc: "Meeting notes, project planning, and team updates." },
              { icon: Lightbulb, title: "Ideas", desc: "Capture sparks and iterate with tags and filters." },
              { icon: NotebookPen, title: "Personal", desc: "Journals, lists, and everyday organization." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">{title}</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
            <p className="mt-4 text-muted-foreground">Three simple steps to clear thinking.</p>
          </div>
          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { step: 1, title: "Write", desc: "Start typing in a clean editor. Save or update when you’re ready." },
              { step: 2, title: "Organize", desc: "Use folders and tags to create context and flow." },
              { step: 3, title: "Find", desc: "Search by title, content, or tags — instantly." },
            ].map(({ step, title, desc }) => (
              <li key={title} className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="text-xs font-semibold text-muted-foreground">Step {step}</div>
                <h3 className="mt-2 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Loved by focused thinkers</h2>
            <p className="mt-4 text-muted-foreground">What users say about CloudBook.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Ava",
                role: "Product Manager",
                quote: "CloudBook keeps my meeting notes clean and easy to find.",
                avatar: "https://picsum.photos/seed/ava/96/96",
              },
              {
                name: "Leo",
                role: "Engineer",
                quote: "The editor is distraction-free — I write more and stress less.",
                avatar: "https://picsum.photos/seed/leo/96/96",
              },
              {
                name: "Mia",
                role: "Writer",
                quote: "Tags + search save me hours when revisiting drafts.",
                avatar: "https://picsum.photos/seed/mia/96/96",
              },
            ].map(({ name, role, quote, avatar }) => (
              <div key={name} className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <img src={avatar} alt={name} className="h-10 w-10 rounded-full" />
                  <div>
                    <div className="text-sm font-semibold">{name}</div>
                    <div className="text-xs text-muted-foreground">{role}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm">“{quote}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Frequently asked questions</h2>
            <p className="mt-4 text-muted-foreground">Quick answers about CloudBook.</p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Do I need to set anything up?</AccordionTrigger>
                <AccordionContent>Nothing. Open the app and start writing — tags and folders are built in.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Can I organize notes by multiple tags?</AccordionTrigger>
                <AccordionContent>Yes. Add as many tags as you need and filter by any tag or folder.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is my content private?</AccordionTrigger>
                <AccordionContent>Editing happens locally in your browser; the UI is designed with privacy in mind.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl border bg-muted/40 p-8 text-center">
          <h3 className="text-2xl font-semibold">Ready to take better notes?</h3>
          <p className="mt-2 text-muted-foreground">Open the app and start writing. No setup required.</p>
          <div className="mt-6">
            <Button asChild size="lg" className="group">
              <Link href="/app">
                Open CloudBook
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-10 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} CloudBook. Crafted for focus.</p>
      </footer>
    </main>
  );
}
