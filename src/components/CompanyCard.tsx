import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, MapPin, TrendingDown, TrendingUp, Users } from "lucide-react";
import { memo } from "react";

import { CompanyLogo } from "@/components/CompanyLogo";
import { useCompany } from "@/context/CompanyContext";
import { CATEGORY_COLORS, isNullish, type CompanySummary } from "@/lib/companyData";

function Value({ text }: { text: string }) {
  if (isNullish(text)) {
    return <span className="italic text-muted-foreground">not publicly available</span>;
  }
  return <span>{text}</span>;
}

export const CompanyCard = memo(function CompanyCard({
  company,
}: {
  company: CompanySummary;
}) {
  const navigate = useNavigate();
  const { selectCompany } = useCompany();
  const color = CATEGORY_COLORS[company.company_type] ?? CATEGORY_COLORS["Regular"];
  const negativeGrowth = company.yoy_growth_rate.trim().startsWith("-");

  const handleClick = () => {
    selectCompany({
      companyId: company.company_id,
      companyName: company.name,
      logoUrl: company.logo_url,
    });
    navigate({ to: "/company/intelligence" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group flex h-full flex-col rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-[color:hsl(var(--dream))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <CompanyLogo
          name={company.name}
          websiteUrl={company.website_url}
          logoUrl={company.logo_url}
          size={44}
        />
        <span
          className="rounded-full px-2.5 py-1 text-xs font-medium"
          style={{ color, backgroundColor: `${color}14` }}
        >
          {company.company_type}
        </span>
      </div>

      <h3 className="mt-3 text-base font-semibold leading-tight text-foreground">
        {company.name}
      </h3>
      <p className="text-sm text-muted-foreground">
        <Value text={company.short_name} />
      </p>

      <dl className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          <Value text={company.headquarters_address} />
        </div>
        <div className="flex items-center gap-2">
          <Users className="size-4 shrink-0" aria-hidden="true" />
          <Value text={company.employee_size} />
        </div>
        <div className="flex items-center gap-2">
          {negativeGrowth ? (
            <TrendingDown
              className="size-4 shrink-0 text-destructive"
              aria-hidden="true"
            />
          ) : (
            <TrendingUp
              className="size-4 shrink-0 text-[color:hsl(var(--standard))]"
              aria-hidden="true"
            />
          )}
          <span className={negativeGrowth ? "text-destructive" : undefined}>
            <Value text={company.yoy_growth_rate} />
          </span>
        </div>
      </dl>

      <div className="mt-4 flex justify-end">
        <ArrowRight
          className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>
    </button>
  );
});
