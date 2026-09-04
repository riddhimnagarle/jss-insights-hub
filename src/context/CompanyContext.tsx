import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useCompanyProfile, useCompanies, useCompanySkills } from "@/lib/companyApi";
import { type CompanyProfile, type CompanySummary, type DashboardSkill } from "@/lib/companyData";

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
  skillTopics: Record<number, string[]>;
  hydrated: boolean;
  selectCompany: (company: SelectedCompany) => void;
  clearCompany: () => void;
  profileLoading: boolean;
  profileError: Error | null;
  retryProfile: () => void;
  skillsLoading: boolean;
  skillsError: Error | null;
  retrySkills: () => void;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

function loadFromStorage(): SelectedCompany | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SelectedCompany>;
    if (!Number.isFinite(Number(parsed.companyId))) return null;
    return {
      companyId: Number(parsed.companyId),
      companyName: String(parsed.companyName ?? ""),
      logoUrl: String(parsed.logoUrl ?? ""),
    };
  } catch {
    return null;
  }
}

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<SelectedCompany | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const companiesQuery = useCompanies();
  const profileQuery = useCompanyProfile(selected?.companyId ?? null);
  const skillsQuery = useCompanySkills(selected?.companyId ?? null);

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
    const summary =
      companiesQuery.data?.find((company) => company.company_id === selected?.companyId) ?? null;
    return {
      selected,
      hydrated,
      summary,
      profile: profileQuery.data ?? null,
      skills: skillsQuery.data?.skills ?? [],
      skillTopics: skillsQuery.data?.topics ?? {},
      selectCompany,
      clearCompany,
      profileLoading: profileQuery.isLoading,
      profileError: profileQuery.error,
      retryProfile: profileQuery.refetch,
      skillsLoading: skillsQuery.isLoading,
      skillsError: skillsQuery.error,
      retrySkills: skillsQuery.refetch,
    };
  }, [
    selected,
    hydrated,
    companiesQuery.data,
    profileQuery.data,
    profileQuery.isLoading,
    profileQuery.error,
    profileQuery.refetch,
    skillsQuery.data,
    skillsQuery.isLoading,
    skillsQuery.error,
    skillsQuery.refetch,
    selectCompany,
    clearCompany,
  ]);

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany(): CompanyContextValue {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
  return ctx;
}
