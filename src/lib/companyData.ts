// Pure normalizers. Inputs are the raw JSON shapes (short_json / full_json /
// skill_levels) so Phase 2 can pipe database rows in untouched.

export interface CompanySummary {
  company_id: number;
  name: string;
  short_name: string;
  logo_url: string;
  category: string;
  company_type: string;
  incorporation_year: string;
  employee_size: string;
  headquarters_address: string;
  operating_countries: string;
  office_locations: string;
  yoy_growth_rate: string;
  website_url: string;
}

export type CompanyProfile = Record<string, string>;

export interface DashboardSkill {
  skill_set_id: number;
  skill_set_name: string;
  required_level: number;
  required_proficiency: string;
  difficulty: "EXPERT" | "ADVANCED" | "PRO" | "BEGINNER";
  bloom: BloomLevel;
  criticality: "Critical" | "Important" | "Baseline";
}

export type BloomLevel = "CU" | "AP" | "AS" | "EV" | "CR";

const NULLISH = new Set([
  "na",
  "n/a",
  "none",
  "-",
  "null",
  "undefined",
  "not available",
  "",
]);

export function isNullish(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  return NULLISH.has(String(value).trim().toLowerCase());
}

export function asString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "string") return value.trim();
  return "";
}

export function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

/** Split a free-text field into list items on newlines, bullets, semicolons or periods. */
export function splitItems(value: unknown): string[] {
  const text = asString(value);
  if (!text) return [];
  return text
    .split(/\r?\n|[•●·]|;|(?<!\d)\.(?!\d)/g)
    .map((part) => part.replace(/^[\s\-–—*]+/, "").trim())
    .filter((part) => part.length > 0);
}

export function titleCaseFromCode(code: string): string {
  return code
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function scoreToDifficulty(score: number): DashboardSkill["difficulty"] {
  if (score >= 8) return "EXPERT";
  if (score >= 6) return "ADVANCED";
  if (score >= 4) return "PRO";
  return "BEGINNER";
}

export function proficiencyToBloom(level: number): BloomLevel {
  if (level <= 2) return "CU";
  if (level <= 4) return "AP";
  if (level <= 6) return "AS";
  if (level <= 8) return "EV";
  return "CR";
}

export function scoreToCriticality(score: number): DashboardSkill["criticality"] {
  if (score >= 7) return "Critical";
  if (score >= 5) return "Important";
  return "Baseline";
}

export function normalizeCompanySummary(
  short_json: unknown,
  company_id = 0,
): CompanySummary {
  const s = asRecord(short_json);
  return {
    company_id,
    name: asString(s.name),
    short_name: asString(s.short_name),
    logo_url: asString(s.logo_url),
    category: asString(s.category),
    company_type: asString(s.company_type) || "Regular",
    incorporation_year: asString(s.incorporation_year),
    employee_size: asString(s.employee_size),
    headquarters_address: asString(s.headquarters_address),
    operating_countries: asString(s.operating_countries),
    office_locations: asString(s.office_locations),
    yoy_growth_rate: asString(s.yoy_growth_rate),
    website_url: asString(s.website_url),
  };
}

export function normalizeCompanyProfile(
  full_json: unknown,
  short_json?: unknown,
): CompanyProfile {
  const merged = { ...asRecord(short_json), ...asRecord(full_json) };
  const profile: CompanyProfile = {};
  for (const [key, value] of Object.entries(merged)) {
    profile[key] = asString(value);
  }
  return profile;
}

export function normalizeDashboardSkills(skillLevels: unknown): DashboardSkill[] {
  if (!Array.isArray(skillLevels)) return [];
  return skillLevels
    .map((raw, index) => {
      const s = asRecord(raw);
      const level = Number(s.required_level) || 0;
      return {
        skill_set_id: Number(s.skill_set_id) || index + 1,
        skill_set_name: asString(s.skill_set_name) || `Skill ${index + 1}`,
        required_level: level,
        required_proficiency: asString(s.required_proficiency),
        difficulty: scoreToDifficulty(level),
        bloom: proficiencyToBloom(level),
        criticality: scoreToCriticality(level),
      } satisfies DashboardSkill;
    })
    .sort((a, b) => b.required_level - a.required_level);
}

export const CATEGORY_COLORS: Record<string, string> = {
  "Super Dream": "#7c3aed",
  Dream: "#2563eb",
  Standard: "#16a34a",
  Regular: "#d97706",
};

export const BLOOM_META: Record<BloomLevel, { label: string; color: string }> = {
  CU: { label: "Understand", color: "#3b82f6" },
  AP: { label: "Apply", color: "#22c55e" },
  AS: { label: "Analyse", color: "#eab308" },
  EV: { label: "Evaluate", color: "#ef4444" },
  CR: { label: "Create", color: "#a855f7" },
};
