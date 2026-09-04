import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, Lock } from "lucide-react";
import { memo, useEffect, useState } from "react";

import { CompanyLogo } from "@/components/CompanyLogo";
import { COLLEGE_SHORT } from "@/config/college";
import { useCompany } from "@/context/CompanyContext";
import { BLOOM_META, type DashboardSkill } from "@/lib/companyData";

export const Route = createFileRoute("/company/skills")({
  head: () => ({
    meta: [
      { title: `Skill Intelligence · ${COLLEGE_SHORT} Placement Hub` },
      {
        name: "description",
        content:
          "Bloom-mapped skill expectations with criticality tiers and 10-level learning roadmaps for each recruiting company.",
      },
      { property: "og:title", content: "Skill Intelligence" },
      {
        property: "og:description",
        content: "Bloom levels, criticality tiers and 10-level roadmaps per skill.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SkillIntelligence,
});

const CRITICALITY_META = [
  {
    key: "Critical",
    color: "#ef4444",
    hint: "Target level 7+. Interviewers probe these deeply.",
  },
  {
    key: "Important",
    color: "#eab308",
    hint: "Target level 5-6. Expect applied questions.",
  },
  {
    key: "Baseline",
    color: "#22c55e",
    hint: "Target level 1-4. Awareness and fundamentals.",
  },
] as const;

const SkillCard = memo(function SkillCard({
  skill,
  topics,
}: {
  skill: DashboardSkill;
  topics: string[];
}) {
  const [open, setOpen] = useState(false);
  const bloom = BLOOM_META[skill.bloom];
  const criticality = CRITICALITY_META.find((c) => c.key === skill.criticality);

  return (
    <article className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-heading text-base font-semibold text-foreground">
          {skill.skill_set_name}
        </h3>
        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ color: bloom.color, backgroundColor: `${bloom.color}18` }}
          >
            {skill.bloom} · {bloom.label}
          </span>
          <span className="text-sm font-semibold text-foreground">{skill.required_level}/10</span>
        </div>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.min(skill.required_level, 10) * 10}%`,
            backgroundColor: bloom.color,
          }}
        />
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        <span style={{ color: criticality?.color }} className="font-medium">
          {skill.criticality}
        </span>
        {skill.required_proficiency ? ` · ${skill.required_proficiency}` : null}
      </p>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[color:hsl(var(--dream))] hover:underline"
        aria-expanded={open}
      >
        {open ? "Hide roadmap" : "View 10-level roadmap"}
        {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      </button>

      {open ? (
        <ol className="mt-3 space-y-1.5">
          {topics.map((topic, index) => {
            const level = index + 1;
            const locked = level > skill.required_level;
            return (
              <li
                key={level}
                className={`flex items-start gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm ${
                  locked ? "bg-secondary/50 text-muted-foreground" : "bg-background"
                }`}
              >
                <span className="mt-0.5 w-6 shrink-0 text-xs font-semibold text-muted-foreground">
                  L{level}
                </span>
                <span className="flex-1">{topic}</span>
                {locked ? (
                  <span className="flex shrink-0 items-center gap-1 text-xs italic">
                    <Lock className="size-3.5" aria-hidden="true" />
                    Beyond scope
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      ) : null}
    </article>
  );
});

function SkillIntelligence() {
  const { summary, skills, skillTopics, hydrated, skillsLoading, skillsError, retrySkills } =
    useCompany();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !summary && !skillsLoading && !skillsError) navigate({ to: "/" });
  }, [hydrated, summary, skillsLoading, skillsError, navigate]);

  if (skillsError) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        <p>Could not load skill intelligence.</p>
        <button
          type="button"
          onClick={() => void retrySkills()}
          className="mt-3 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground"
        >
          Retry
        </button>
      </div>
    );
  }

  if (skillsLoading || !summary) {
    return <div className="p-6 text-sm text-muted-foreground">Loading skill data…</div>;
  }

  const sorted = [...skills].sort((a, b) => b.required_level - a.required_level);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <header className="flex items-center gap-3 border-b border-border pb-4">
        <CompanyLogo
          name={summary.name}
          websiteUrl={summary.website_url}
          logoUrl={summary.logo_url}
          size={44}
        />
        <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
          {summary.name} Skill Intelligence
        </h1>
      </header>

      <section className="mt-5" aria-label="Bloom levels">
        <h2 className="font-heading text-sm font-semibold text-foreground">Bloom levels</h2>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {(Object.keys(BLOOM_META) as Array<keyof typeof BLOOM_META>).map((key) => (
            <div
              key={key}
              className="rounded-lg border border-border p-2.5 text-center"
              style={{ backgroundColor: `${BLOOM_META[key].color}12` }}
            >
              <p className="text-sm font-semibold" style={{ color: BLOOM_META[key].color }}>
                {key}
              </p>
              <p className="text-xs text-muted-foreground">{BLOOM_META[key].label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5" aria-label="Criticality">
        <h2 className="font-heading text-sm font-semibold text-foreground">Criticality</h2>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {CRITICALITY_META.map((item) => (
            <div key={item.key} className="rounded-lg border border-border bg-card p-3">
              <p className="text-sm font-semibold" style={{ color: item.color }}>
                {item.key}
              </p>
              <p className="text-xs text-muted-foreground">{item.hint}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2" aria-label="Skills">
        {sorted.map((skill) => (
          <SkillCard
            key={skill.skill_set_id}
            skill={skill}
            topics={skillTopics[skill.skill_set_id] ?? []}
          />
        ))}
      </section>
    </div>
  );
}
