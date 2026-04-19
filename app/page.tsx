import { HoleBackground } from "@/components/animate-ui/components/backgrounds/hole";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div className="relative min-h-[calc(100dvh-60px)] overflow-hidden px-4 pb-16 pt-12">
      <HoleBackground className="absolute inset-0 flex items-center justify-center rounded-xl -z-10 h-full" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(93,76,255,0.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(76,196,255,0.16),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(255,158,76,0.14),transparent_28%)] pointer-events-none" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12">
        <div className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Fresh stories, crafted by the community
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Create. Publish. Grow your audience.</h1>
              <p className="text-base text-muted-foreground sm:text-lg">
                Discover insightful articles, share your ideas, and connect with readers who care about what you build.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href={'/blog'}>
                <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-base font-semibold text-primary-foreground shadow-lg transition hover:shadow-primary/30">
                  Explore articles
                </button>
              </Link>

              {!session ? (
                <>
                  <Link href={'/auth/signup'}>
                    <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-base font-semibold transition hover:border-primary hover:bg-background/80">
                      Get started
                    </button>
                  </Link>
                </>
              ) : (
                <Link href={'/dashboard/createpost'}>
                  <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-base font-semibold transition hover:border-primary hover:bg-background/80">
                    Create a post
                  </button>
                </Link>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-card/70 px-4 py-3">
                <p className="font-semibold text-foreground">10k+</p>
                <p>Monthly readers</p>
              </div>
              <div className="rounded-xl border border-border bg-card/70 px-4 py-3">
                <p className="font-semibold text-foreground">2k+</p>
                <p>Published posts</p>
              </div>
              <div className="rounded-xl border border-border bg-card/70 px-4 py-3">
                <p className="font-semibold text-foreground">Global</p>
                <p>Creators & readers</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card/70 shadow-2xl backdrop-blur">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background/60" />
              <div className="relative grid gap-4 p-6">
                <div className="flex items-start justify-between rounded-2xl border border-border bg-background/80 p-4 shadow-sm">
                  <div>
                    <p className="text-sm text-muted-foreground">Featured</p>
                    <p className="mt-1 text-lg font-semibold">Designing with intention</p>
                    <p className="mt-1 text-sm text-muted-foreground">How to craft meaningful interfaces for readers.</p>
                  </div>
                  <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">5 min</span>
                </div>

                <div className="rounded-2xl border border-border bg-background/80 p-4 shadow-sm">
                  <p className="text-sm text-muted-foreground">Community picks</p>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">Scaling content workflows</span>
                      <span className="text-muted-foreground">4 min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">Stories that convert</span>
                      <span className="text-muted-foreground">6 min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">Building a loyal readership</span>
                      <span className="text-muted-foreground">8 min</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-background/80 p-4 shadow-sm">
                  <p className="text-sm text-muted-foreground">What you can do</p>
                  <ul className="mt-3 space-y-2 text-sm text-foreground">
                    <li>• Write long-form posts with a clean editor</li>
                    <li>• Interact via comments, likes, and replies</li>
                    <li>• Track engagement from your dashboard</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
