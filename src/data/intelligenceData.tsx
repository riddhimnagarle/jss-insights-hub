import {
  Award,
  BadgeCheck,
  Bot,
  Boxes,
  Briefcase,
  Building2,
  Bus,
  Contact,
  Cpu,
  Crown,
  Eye,
  Gauge,
  Gift,
  Globe2,
  GraduationCap,
  Handshake,
  Heart,
  LineChart,
  Newspaper,
  ShieldCheck,
  Target,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import type { CompanyProfile } from "@/lib/companyData";

export interface IntelligenceField {
  key: string;
  label: string;
  value: string;
}

export interface IntelligenceSection {
  id: string;
  title: string;
  icon: LucideIcon;
  fields: IntelligenceField[];
}

type FieldSpec = [key: string, label: string];

const SCHEMA: Array<{
  id: string;
  title: string;
  icon: LucideIcon;
  fields: FieldSpec[];
}> = [
  {
    id: "identity",
    title: "Company Identity",
    icon: Building2,
    fields: [
      ["name", "Legal Name"],
      ["short_name", "Common Name"],
      ["category", "Category"],
      ["company_type", "Placement Tier"],
      ["incorporation_year", "Founded"],
      ["nature_of_company", "Nature of Company"],
      ["company_maturity", "Company Maturity"],
    ],
  },
  {
    id: "overview",
    title: "Overview & Vision",
    icon: Eye,
    fields: [
      ["overview_text", "Overview"],
      ["vision_statement", "Vision"],
      ["mission_statement", "Mission"],
      ["core_values", "Core Values"],
      ["history_timeline", "History"],
      ["mission_clarity", "Mission Clarity"],
    ],
  },
  {
    id: "leadership",
    title: "Leadership",
    icon: Crown,
    fields: [
      ["ceo_name", "CEO"],
      ["ceo_linkedin_url", "CEO LinkedIn"],
      ["key_leaders", "Key Leaders"],
      ["board_members", "Board Members"],
      ["decision_maker_access", "Decision Maker Access"],
      ["warm_intro_pathways", "Warm Intro Pathways"],
    ],
  },
  {
    id: "funding",
    title: "Funding & Financials",
    icon: Wallet,
    fields: [
      ["annual_revenue", "Annual Revenue"],
      ["annual_profit", "Annual Profit"],
      ["revenue_mix", "Revenue Mix"],
      ["valuation", "Valuation"],
      ["yoy_growth_rate", "YoY Growth"],
      ["profitability_status", "Profitability"],
      ["key_investors", "Key Investors"],
      ["recent_funding_rounds", "Recent Funding"],
      ["total_capital_raised", "Capital Raised"],
      ["burn_rate", "Burn Rate"],
      ["runway_months", "Runway"],
      ["burn_multiplier", "Burn Multiplier"],
    ],
  },
  {
    id: "presence",
    title: "Global Presence",
    icon: Globe2,
    fields: [
      ["headquarters_address", "Headquarters"],
      ["operating_countries", "Operating Countries"],
      ["office_count", "Office Count"],
      ["office_locations", "Office Locations"],
      ["employee_size", "Employee Size"],
      ["global_exposure", "Global Exposure"],
    ],
  },
  {
    id: "products",
    title: "Products & Services",
    icon: Boxes,
    fields: [
      ["offerings_description", "Offerings"],
      ["focus_sectors", "Focus Sectors"],
      ["pain_points_addressed", "Pain Points Addressed"],
      ["product_pipeline", "Product Pipeline"],
      ["innovation_roadmap", "Innovation Roadmap"],
      ["case_studies", "Case Studies"],
    ],
  },
  {
    id: "technology",
    title: "Technology Stack",
    icon: Cpu,
    fields: [
      ["tech_stack", "Tech Stack"],
      ["ai_ml_adoption_level", "AI / ML Adoption"],
      ["r_and_d_investment", "R&D Investment"],
      ["intellectual_property", "Intellectual Property"],
      ["cybersecurity_posture", "Cybersecurity Posture"],
      ["tech_adoption_rating", "Tech Adoption Rating"],
      ["automation_level", "Automation Level"],
    ],
  },
  {
    id: "partnerships",
    title: "Partnerships & Ecosystem",
    icon: Handshake,
    fields: [
      ["technology_partners", "Technology Partners"],
      ["partnership_ecosystem", "Partnership Ecosystem"],
      ["industry_associations", "Industry Associations"],
      ["event_participation", "Event Participation"],
    ],
  },
  {
    id: "competition",
    title: "Competitive Landscape",
    icon: Target,
    fields: [
      ["key_competitors", "Key Competitors"],
      ["market_share_percentage", "Market Share"],
      ["competitive_advantages", "Competitive Advantages"],
      ["unique_differentiators", "Differentiators"],
      ["weaknesses_gaps", "Weaknesses & Gaps"],
      ["benchmark_vs_peers", "Benchmark vs Peers"],
    ],
  },
  {
    id: "market",
    title: "Market Opportunity",
    icon: LineChart,
    fields: [
      ["tam", "TAM"],
      ["sam", "SAM"],
      ["som", "SOM"],
      ["future_projections", "Future Projections"],
      ["strategic_priorities", "Strategic Priorities"],
      ["go_to_market_strategy", "Go-To-Market"],
      ["key_challenges_needs", "Challenges & Needs"],
    ],
  },
  {
    id: "value-esg",
    title: "Core Value Proposition & ESG",
    icon: BadgeCheck,
    fields: [
      ["core_value_proposition", "Value Proposition"],
      ["esg_ratings", "ESG Ratings"],
      ["sustainability_csr", "Sustainability & CSR"],
      ["carbon_footprint", "Carbon Footprint"],
      ["ethical_sourcing", "Ethical Sourcing"],
      ["ethical_standards", "Ethical Standards"],
    ],
  },
  {
    id: "culture",
    title: "Culture & Work Life",
    icon: Users,
    fields: [
      ["work_culture_summary", "Culture Summary"],
      ["manager_quality", "Manager Quality"],
      ["psychological_safety", "Psychological Safety"],
      ["feedback_culture", "Feedback Culture"],
      ["diversity_metrics", "Diversity Metrics"],
      ["diversity_inclusion_score", "Diversity & Inclusion"],
      ["burnout_risk", "Burnout Risk"],
      ["employee_turnover", "Employee Turnover"],
      ["avg_retention_tenure", "Average Tenure"],
      ["layoff_history", "Layoff History"],
      ["crisis_behavior", "Crisis Behaviour"],
      ["typical_hours", "Typical Hours"],
      ["overtime_expectations", "Overtime Expectations"],
      ["weekend_work", "Weekend Work"],
    ],
  },
  {
    id: "news",
    title: "Recent News & Milestones",
    icon: Newspaper,
    fields: [
      ["recent_news", "Recent News"],
      ["hiring_velocity", "Hiring Velocity"],
      ["exit_strategy_history", "Exit / M&A History"],
    ],
  },
  {
    id: "sales",
    title: "Sales & Customer Metrics",
    icon: Gauge,
    fields: [
      ["sales_motion", "Sales Motion"],
      ["top_customers", "Top Customers"],
      ["customer_concentration_risk", "Concentration Risk"],
      ["customer_acquisition_cost", "CAC"],
      ["customer_lifetime_value", "LTV"],
      ["cac_ltv_ratio", "CAC : LTV"],
      ["churn_rate", "Churn Rate"],
      ["net_promoter_score", "Net Promoter Score"],
      ["client_quality", "Client Quality"],
    ],
  },
  {
    id: "risk",
    title: "Risk & Compliance",
    icon: ShieldCheck,
    fields: [
      ["regulatory_status", "Regulatory Status"],
      ["legal_issues", "Legal Issues"],
      ["supply_chain_dependencies", "Supply Chain Dependencies"],
      ["geopolitical_risks", "Geopolitical Risks"],
      ["macro_risks", "Macro Risks"],
    ],
  },
  {
    id: "location",
    title: "Work Location & Commute",
    icon: Bus,
    fields: [
      ["remote_policy_details", "Remote Policy"],
      ["flexibility_level", "Flexibility"],
      ["location_centrality", "Location Centrality"],
      ["office_zone_type", "Office Zone"],
      ["public_transport_access", "Public Transport"],
      ["cab_policy", "Cab Policy"],
      ["airport_commute_time", "Airport Commute"],
    ],
  },
  {
    id: "safety",
    title: "Safety & Wellbeing",
    icon: Heart,
    fields: [
      ["area_safety", "Area Safety"],
      ["safety_policies", "Safety Policies"],
      ["infrastructure_safety", "Infrastructure Safety"],
      ["emergency_preparedness", "Emergency Preparedness"],
      ["health_support", "Health Support"],
    ],
  },
  {
    id: "career",
    title: "Career Growth & Learning",
    icon: GraduationCap,
    fields: [
      ["onboarding_quality", "Onboarding Quality"],
      ["training_spend", "Training Spend"],
      ["learning_culture", "Learning Culture"],
      ["mentorship_availability", "Mentorship"],
      ["internal_mobility", "Internal Mobility"],
      ["promotion_clarity", "Promotion Clarity"],
      ["role_clarity", "Role Clarity"],
      ["early_ownership", "Early Ownership"],
      ["work_impact", "Work Impact"],
      ["execution_thinking_balance", "Execution vs Thinking"],
      ["cross_functional_exposure", "Cross-Functional Exposure"],
      ["exposure_quality", "Exposure Quality"],
      ["tools_access", "Tools Access"],
      ["skill_relevance", "Skill Relevance"],
      ["exit_opportunities", "Exit Opportunities"],
      ["network_strength", "Network Strength"],
    ],
  },
  {
    id: "brand",
    title: "Brand & Reputation",
    icon: Award,
    fields: [
      ["brand_value", "Brand Value"],
      ["brand_sentiment_score", "Brand Sentiment"],
      ["awards_recognitions", "Awards & Recognition"],
      ["external_recognition", "External Recognition"],
      ["customer_testimonials", "Customer Testimonials"],
    ],
  },
  {
    id: "benefits",
    title: "Compensation & Benefits",
    icon: Gift,
    fields: [
      ["leave_policy", "Leave Policy"],
      ["fixed_vs_variable_pay", "Pay Structure"],
      ["bonus_predictability", "Bonus Predictability"],
      ["esops_incentives", "ESOPs & Incentives"],
      ["family_health_insurance", "Family Health Insurance"],
      ["relocation_support", "Relocation Support"],
      ["lifestyle_benefits", "Lifestyle Benefits"],
    ],
  },
  {
    id: "digital",
    title: "Digital Presence & Ratings",
    icon: Bot,
    fields: [
      ["website_url", "Website"],
      ["linkedin_url", "LinkedIn"],
      ["twitter_handle", "X / Twitter"],
      ["facebook_url", "Facebook"],
      ["instagram_url", "Instagram"],
      ["marketing_video_url", "Marketing Video"],
      ["website_quality", "Website Quality"],
      ["website_rating", "Website Rating"],
      ["website_traffic_rank", "Traffic Rank"],
      ["social_media_followers", "Social Followers"],
      ["glassdoor_rating", "Glassdoor Rating"],
      ["indeed_rating", "Indeed Rating"],
      ["google_rating", "Google Rating"],
    ],
  },
  {
    id: "contact",
    title: "Contact Information",
    icon: Contact,
    fields: [
      ["primary_contact_email", "Primary Email"],
      ["primary_phone_number", "Primary Phone"],
      ["contact_person_name", "Contact Person"],
      ["contact_person_title", "Contact Title"],
      ["contact_person_email", "Contact Email"],
      ["contact_person_phone", "Contact Phone"],
    ],
  },
];

export const SECTION_ICON_FALLBACK = Briefcase;

/** Build the 22-section field schema, merging in profile values when provided. */
export function buildIntelligenceSections(
  profile?: CompanyProfile | null,
): IntelligenceSection[] {
  return SCHEMA.map((section) => ({
    id: section.id,
    title: section.title,
    icon: section.icon ?? SECTION_ICON_FALLBACK,
    fields: section.fields.map(([key, label]) => ({
      key,
      label,
      value: profile?.[key] ?? "",
    })),
  }));
}
