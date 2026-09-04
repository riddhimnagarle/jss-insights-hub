import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ExternalLink, Linkedin } from "lucide-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";

import { CompanyLogo } from "@/components/CompanyLogo";
import { useCompany } from "@/context/CompanyContext";
import {
  buildIntelligenceSections,
  type IntelligenceField,
  type IntelligenceSection,
} from "@/data/intelligenceData";
import { COLLEGE_SHORT } from "@/config/college";
import { isNullish, splitItems } from "@/lib/companyData";

export const Route = createFileRoute("/company/intelligence")({
  head: () => ({
    meta: [
      { title: `Company Intelligence · ${COLLEGE_SHORT} Placement Hub` },
      {
        name: "description",
        content:
          "22 structured intelligence sections covering identity, financials, technology, culture, risk and contacts for a recruiting company.",
      },
      { property: "og:title", content: "Company Intelligence" },
      {
        property: "og:description",
        content: "Deep-dive company research for campus placement preparation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompanyIntelligence,
});

function NotAvailable() {
  return (
    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
      Not Available
    </span>
  );
}

function renderValue(field: IntelligenceField) {
  const value = field.value;
  if (isNullish(value)) return <NotAvailable />;

  if (/^https?:\/\//i.test(value)) {
    const isVideo = /youtube|youtu\.be|vimeo/i.test(value);
    return (
      <a
        href={value}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-1.5 break-all text-[color:hsl(var(--dream))] hover:underline"
      >
        {isVideo ? "Watch video" : value}
        <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
      </a>
    );
  }

  if (/^\d(\.\d)?\s*\/\s*5$/.test(value.trim())) {
    return (
      <span className="rounded-md bg-[color:hsl(var(--standard))]/10 px-2 py-1 text-sm font-medium text-[color:hsl(var(--standard))]">
        {value}
      </span>
    );
  }

  const parts = value.includes(";")
    ? value.split(";")
    : value.includes(",") && value.length < 160
      ? value.split(",")
      : [];
  const pills = parts.map((p) => p.trim()).filter(Boolean);
  if (pills.length > 1) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {pills.map((pill) => (
          <span
            key={pill}
            className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs text-foreground"
          >
            {pill}
          </span>
        ))}
      </div>
    );
  }

  const lines = splitItems(value);
  if (lines.length > 2) {
    return (
      <ul className="list-inside list-disc space-y-1 text-sm text-foreground">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    );
  }

  return <p className="text-sm leading-relaxed text-foreground">{value}</p>;
}

function FieldRow({ field }: { field: IntelligenceField }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-3 last:border-b-0 sm:flex-row sm:gap-4">
      <dt className="text-sm font-medium text-muted-foreground sm:w-1/3">{field.label}</dt>
      <dd className="text-sm text-foreground sm:w-2/3">{renderValue(field)}</dd>
    </div>
  );
}

const SectionCard = memo(function SectionCard({
  section,
  index,
  registerRef,
}: {
  section: IntelligenceSection;
  index: number;
  registerRef: (index: number, el: HTMLElement | null) => void;
}) {
  const Icon = section.icon;
  const filled = section.fields.filter((f) => !isNullish(f.value)).length;

  return (
    <section
      id={`section-${section.id}`}
      ref={(el) => registerRef(index, el)}
      className="scroll-mt-32 rounded-xl border border-border bg-card p-4 sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-foreground">
          <Icon className="size-4.5" aria-hidden="true" />
        </span>
        <h2 className="flex-1 text-base font-semibold text-foreground sm:text-lg">
          {section.title}
        </h2>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
          {filled}/{section.fields.length}
        </span>
      </div>
      <dl className="mt-3">
        {section.fields.map((field) => (
          <FieldRow key={field.key} field={field} />
        ))}
      </dl>
    </section>
  );
});

function CompanyIntelligence() {
  const { summary, profile, hydrated, profileLoading, profileError, retryProfile } = useCompany();
  const navigate = useNavigate();
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const isScrollingRef = useRef(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (hydrated && !summary && !profileLoading && !profileError) navigate({ to: "/" });
  }, [hydrated, summary, profileLoading, profileError, navigate]);

  const sections = useMemo(() => buildIntelligenceSections(profile), [profile]);

  useEffect(() => {
    const onScroll = () => {
      if (isScrollingRef.current) return;
      const offset = 180;
      let current = 0;
      sectionRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= offset) current = i;
      });
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections.length]);

  useEffect(() => {
    tabRefs.current[active]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  const scrollToSection = (idx: number) => {
    const el = sectionRefs.current[idx];
    if (!el) return;
    isScrollingRef.current = true;
    setActive(idx);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      isScrollingRef.current = false;
    }, 700);
  };

  if (profileError) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        <p>Could not load company intelligence.</p>
        <button
          type="button"
          onClick={() => void retryProfile()}
          className="mt-3 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground"
        >
          Retry
        </button>
      </div>
    );
  }

  if (profileLoading || !summary || !profile) {
    return <div className="p-6 text-sm text-muted-foreground">Loading company data…</div>;
  }

  return (
    <div className="bg-card">
      <div className="sticky top-0 z-20 border-b border-border bg-card">
        <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
          <CompanyLogo
            name={summary.name}
            websiteUrl={summary.website_url}
            logoUrl={summary.logo_url}
            size={40}
          />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
              {summary.name}
            </h1>
            <span className="mt-0.5 inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              {summary.category}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {summary.website_url && (
              <a
                href={summary.website_url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-secondary sm:text-sm"
              >
                <ExternalLink className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Website</span>
              </a>
            )}
            {profile["linkedin_url"] && !isNullish(profile["linkedin_url"]) && (
              <a
                href={profile["linkedin_url"]}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-secondary sm:text-sm"
              >
                <Linkedin className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
            )}
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto border-t border-border px-3 py-2">
          {sections.map((section, idx) => (
            <button
              key={section.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              type="button"
              onClick={() => scrollToSection(idx)}
              className={
                "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors " +
                (active === idx
                  ? "bg-[#EFF6FF] text-[#2563EB]"
                  : "text-muted-foreground hover:bg-secondary")
              }
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 px-4 py-6 sm:px-6">
        {sections.map((section, idx) => (
          <SectionCard
            key={section.id}
            section={section}
            index={idx}
            registerRef={(i, el) => {
              sectionRefs.current[i] = el;
            }}
          />
        ))}
      </div>
    </div>
  );
}
