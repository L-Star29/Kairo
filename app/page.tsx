import Link from "next/link"
import { ArrowRight, Calendar, Brain, Clock, BookOpen, Users, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Kairo</span>
          </div>
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
        {/* Hero Section */}
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              Your AI-Powered
              <span className="text-primary"> Academic Coach</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Kairo helps you stay ahead without burning out. Get personalized study plans,
              smart task distribution, and intelligent scheduling.
            </p>
            <div className="space-x-4">
              <Link
                href="/auth/signup"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/features"
                className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
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
        </section>

        {/* How It Works Section */}
        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto max-w-[58rem] text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">
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
        </section>

        {/* Testimonials Section */}
        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto max-w-[58rem] text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">
              What Students Say
            </h2>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    "Kairo has completely transformed how I manage my academic workload. I'm more organized and less stressed than ever!"
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10" />
                    <div>
                      <p className="text-sm font-medium">Sarah M.</p>
                      <p className="text-xs text-muted-foreground">High School Junior</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    "The AI-powered scheduling is incredible. It knows exactly how to balance my AP classes with my extracurricular activities."
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10" />
                    <div>
                      <p className="text-sm font-medium">Michael T.</p>
                      <p className="text-xs text-muted-foreground">College Freshman</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    "Finally, a planner that understands the unique challenges of being a student. Kairo has been a game-changer for me!"
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10" />
                    <div>
                      <p className="text-sm font-medium">Emma R.</p>
                      <p className="text-xs text-muted-foreground">Middle School Student</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto max-w-[58rem] text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">
              Ready to Transform Your Academic Journey?
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
                <ArrowRight className="ml-2 h-4 w-4" />
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