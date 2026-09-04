import { createFileRoute } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CompanyCard } from "@/components/CompanyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { COLLEGE_NAME, COLLEGE_SHORT } from "@/config/college";
import { useCompanies } from "@/lib/companyApi";
import { CATEGORY_COLORS } from "@/lib/companyData";

const TITLE = `${COLLEGE_NAME} Companies Research & Placement Analytics Portal`;
const DESCRIPTION =
  "Research recruiting companies, explore 22 intelligence sections and map the skill ladder you need for campus placements.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${COLLEGE_SHORT} Placement Intelligence Hub` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const TIERS = ["All", "Super Dream", "Dream", "Standard", "Regular"] as const;

function Index() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [tier, setTier] = useState<(typeof TIERS)[number]>("All");
  const { data: companies = [], isLoading, isError, refetch } = useCompanies();

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: companies.length };
    for (const tierName of TIERS.slice(1)) {
      map[tierName] = companies.filter((c) => c.company_type === tierName).length;
    }
    return map;
  }, [companies]);

  const results = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return companies.filter((c) => {
      const matchesTier = tier === "All" || c.company_type === tier;
      const matchesQuery =
        !q ||
        `${c.name} ${c.short_name} ${c.category} ${c.headquarters_address}`
          .toLowerCase()
          .includes(q);
      return matchesTier && matchesQuery;
    });
  }, [companies, debounced, tier]);

  const reset = () => {
    setQuery("");
    setTier("All");
  };

  return (
    <main className="min-h-screen bg-card">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <span className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground">
            {COLLEGE_SHORT} · INTELLIGENCE PLATFORM
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {TITLE}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Your strategic edge for campus placements
          </p>

          <div className="relative mt-6 max-w-xl">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies, industries or locations"
              aria-label="Search companies"
              className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-10 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[color:hsl(var(--dream))] focus:ring-2 focus:ring-ring/30"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-secondary"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {TIERS.map((name) => {
            const color = CATEGORY_COLORS[name];
            const active = tier === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setTier(name)}
                className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm"
                style={{
                  color: active ? "#ffffff" : (color ?? "hsl(215 16% 47%)"),
                  backgroundColor: active
                    ? (color ?? "hsl(222 47% 11%)")
                    : color
                      ? `${color}12`
                      : "transparent",
                  borderColor: active
                    ? (color ?? "hsl(222 47% 11%)")
                    : color
                      ? `${color}33`
                      : "hsl(214 32% 91%)",
                }}
              >
                {name} · {counts[name] ?? 0}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="mt-10 rounded-xl border border-border bg-card p-10 text-center">
            <h2 className="text-lg font-semibold text-foreground">Could not load companies</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Check the Supabase configuration and try again.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Retry
            </button>
          </div>
        ) : results.length === 0 ? (
          <div className="mt-10 rounded-xl border border-border bg-card p-10 text-center">
            <h2 className="text-lg font-semibold text-foreground">No companies found</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search term or placement tier.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((company) => (
              <CompanyCard key={company.company_id} company={company} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
