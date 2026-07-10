import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[#0E1628] text-white">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Signal lost</h2>
        <p className="mt-2 text-sm text-slate-450">
          This intelligence path no longer exists.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center rounded-full glow-btn px-5 py-2.5 text-sm font-medium"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[#0E1628] text-white">
      <div className="max-w-md text-center glass rounded-3xl p-8 border border-white/8 bg-[#151F35]/70">
        <h1 className="text-xl font-semibold">System interrupted</h1>
        <p className="mt-2 text-sm text-slate-450">Try again or return home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full glow-btn px-5 py-2.5 text-sm font-medium"
          >Retry</button>
          <a href="/" className="rounded-full border border-white/8 bg-white/[0.02] hover:bg-white/[0.08] hover:text-white transition px-5 py-2.5 text-sm">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CompetiLens AI — Competitive Intelligence, Reimagined" },
      { name: "description", content: "A luxurious AI competitive intelligence platform. Track competitors, detect signals, and generate editorial-grade strategy briefs in real time." },
      { property: "og:title", content: "CompetiLens AI" },
      { property: "og:description", content: "AI competitive intelligence — track competitors, detect signals, generate strategy briefs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
