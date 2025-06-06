import { Brain, Calendar, Clock, BookOpen, Users, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Features() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Kairo</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/features"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Pricing
            </Link>
            <Link
              href="/auth/signin"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto max-w-[58rem] text-center">
            <h1 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">
              Features
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to succeed in your academic journey
            </p>
          </div>

          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <Brain className="h-8 w-8 text-primary" />
                  <h3 className="font-bold">Smart Assignment Weighting</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered task prioritization based on class difficulty, teacher expectations, and deadlines.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <Calendar className="h-8 w-8 text-primary" />
                  <h3 className="font-bold">Personalized Daily Plans</h3>
                  <p className="text-sm text-muted-foreground">
                    Get customized study schedules that adapt to your unique learning style and commitments.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <Clock className="h-8 w-8 text-primary" />
                  <h3 className="font-bold">Intelligent Rescheduling</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatic task redistribution when life happens, keeping you on track without stress.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-[58rem] text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Kairo makes academic planning simple and effective
            </p>
          </div>

          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    1
                  </div>
                  <h3 className="font-bold">Add Your Classes</h3>
                  <p className="text-sm text-muted-foreground">
                    Input your courses, their difficulty levels, and teacher expectations.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    2
                  </div>
                  <h3 className="font-bold">Add Your Tasks</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your assignments, projects, and study goals with deadlines.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    3
                  </div>
                  <h3 className="font-bold">Get Your Plan</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive a personalized schedule that adapts to your needs and preferences.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-[58rem] text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of students who are already using Kairo to achieve their academic goals.
            </p>
            <div className="mt-8">
              <Link
                href="/auth/signup"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Kairo</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
} 