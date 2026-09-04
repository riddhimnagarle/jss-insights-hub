import { useQuery } from "@tanstack/react-query";

import {
  normalizeCompanyProfile,
  normalizeCompanySummary,
  normalizeDashboardSkills,
  type CompanyProfile,
  type CompanySummary,
  type DashboardSkill,
} from "@/lib/companyData";
import { supabase } from "@/lib/supabaseClient";

interface CompanyJsonRow {
  company_id: number;
  short_json: unknown;
  full_json?: unknown;
}

interface SkillLevelRow {
  company_id: number;
  skill_set_id: number;
  required_level: number;
  required_proficiency_level_id: number | null;
}

interface SkillSetRow {
  skill_set_id: number;
  skill_set_name: string;
  short_name: string | null;
}

interface ProficiencyRow {
  proficiency_level_id: number;
  proficiency_name: string;
  proficiency_code: string | null;
}

interface SkillTopicRow {
  skill_set_id: number;
  level_number: number;
  topics: unknown;
}

export interface CompanySkills {
  skills: DashboardSkill[];
  topics: Record<number, string[]>;
}

function throwIfError<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return result.data ?? ([] as T);
}

async function fetchCompanies(): Promise<CompanySummary[]> {
  const result = await supabase.from("company_json").select("company_id, short_json");
  return throwIfError(result).map((row: CompanyJsonRow) =>
    normalizeCompanySummary(row.short_json, row.company_id),
  );
}

async function fetchCompanyProfile(id: number): Promise<CompanyProfile> {
  const result = await supabase
    .from("company_json")
    .select("company_id, short_json, full_json")
    .eq("company_id", id)
    .maybeSingle();
  const row = throwIfError(result) as CompanyJsonRow | null;
  if (!row) throw new Error("Company profile was not found.");
  return normalizeCompanyProfile(row.full_json, row.short_json);
}

function topicValues(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (typeof value === "string") return [value];
  if (value && typeof value === "object") {
    return Object.values(value).filter((item): item is string => typeof item === "string");
  }
  return [];
}

async function fetchCompanySkills(id: number): Promise<CompanySkills> {
  const [levelsResult, setsResult, proficienciesResult, topicsResult] = await Promise.all([
    supabase
      .from("company_skill_levels")
      .select("company_id, skill_set_id, required_level, required_proficiency_level_id")
      .eq("company_id", id),
    supabase.from("skill_set_master").select("skill_set_id, skill_set_name, short_name"),
    supabase
      .from("proficiency_levels")
      .select("proficiency_level_id, proficiency_name, proficiency_code"),
    supabase.from("skill_set_topics").select("skill_set_id, level_number, topics"),
  ]);

  const levels = throwIfError(levelsResult) as SkillLevelRow[];
  const skillSets = throwIfError(setsResult) as SkillSetRow[];
  const proficiencies = throwIfError(proficienciesResult) as ProficiencyRow[];
  const topicRows = throwIfError(topicsResult) as SkillTopicRow[];
  const skillSetById = new Map(skillSets.map((row) => [row.skill_set_id, row]));
  const proficiencyById = new Map(proficiencies.map((row) => [row.proficiency_level_id, row]));

  const normalizedRows = levels.map((level) => ({
    skill_set_id: level.skill_set_id,
    skill_set_name: skillSetById.get(level.skill_set_id)?.skill_set_name ?? "",
    required_level: level.required_level,
    required_proficiency:
      proficiencyById.get(level.required_proficiency_level_id ?? -1)?.proficiency_name ?? "",
  }));

  const topics: Record<number, string[]> = {};
  for (const row of topicRows) {
    topics[row.skill_set_id] ??= [];
    topics[row.skill_set_id][row.level_number - 1] = topicValues(row.topics).join(" ");
  }

  return { skills: normalizeDashboardSkills(normalizedRows), topics };
}

export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
  });
}

export function useCompanyProfile(id: number | null) {
  return useQuery({
    queryKey: ["company-profile", id],
    queryFn: () => fetchCompanyProfile(id as number),
    enabled: id !== null,
  });
}

export function useCompanySkills(id: number | null) {
  return useQuery({
    queryKey: ["company-skills", id],
    queryFn: () => fetchCompanySkills(id as number),
    enabled: id !== null,
  });
}
