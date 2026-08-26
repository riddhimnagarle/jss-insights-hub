import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { SEED_COMPANIES } from "@/data/seedCompanies";
import {
  normalizeCompanyProfile,
  normalizeCompanySummary,
  normalizeDashboardSkills,
  type CompanyProfile,
  type CompanySummary,
  type DashboardSkill,
} from "@/lib/companyData";

export const STORAGE_KEY = "selected-company";

export interface SelectedCompany {
  companyId: number;
  companyName: string;
  logoUrl: string;
}

interface CompanyContextValue {
  selected: SelectedCompany | null;
  summary: CompanySummary | null;
  profile: CompanyProfile | null;
  skills: DashboardSkill[];
  hydrated: boolean;
  selectCompany: (company: SelectedCompany) => void;
  clearCompany: () => void;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

export const COMPANY_SUMMARIES: CompanySummary[] = SEED_COMPANIES.map((row) =>
  normalizeCompanySummary(row.short_json, row.company_id),
);

function loadFromStorage(): SelectedCompany | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SelectedCompany>;
    const match = SEED_COMPANIES.find(
      (row) => row.company_id === Number(parsed.companyId),
    );
    if (!match) return null;
    const summary = normalizeCompanySummary(match.short_json, match.company_id);
    return {
      companyId: summary.company_id,
      companyName: summary.name,
      logoUrl: summary.logo_url,
    };
  } catch {
    return null;
  }
}

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<SelectedCompany | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSelected(loadFromStorage());
    setHydrated(true);
  }, []);

  const selectCompany = useCallback((company: SelectedCompany) => {
    setSelected(company);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(company));
    } catch {
      /* storage unavailable — state still updates */
    }
  }, []);

  const clearCompany = useCallback(() => {
    setSelected(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<CompanyContextValue>(() => {
    const row = selected
      ? SEED_COMPANIES.find((r) => r.company_id === selected.companyId)
      : undefined;
    return {
      selected,
      hydrated,
      summary: row ? normalizeCompanySummary(row.short_json, row.company_id) : null,
      profile: row ? normalizeCompanyProfile(row.full_json, row.short_json) : null,
      skills: row ? normalizeDashboardSkills(row.skill_levels) : [],
      selectCompany,
      clearCompany,
    };
  }, [selected, hydrated, selectCompany, clearCompany]);

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany(): CompanyContextValue {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
  return ctx;
}
