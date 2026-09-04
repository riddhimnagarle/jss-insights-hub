# JSS Insights Hub

## Phase 2 — Supabase

Paste `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` into `.env`, then run `npm install && npm run dev`.

The live app reads company data from `company_json` and skills from the four documented skill tables. The Phase 1 seed files remain in the repository as a documented fallback, but are not used by the live render path.

FINAL MASTER BUILD PROMPT (Phase 1, UI-only)

Before pasting into Lovable: replace the two placeholders on the first two lines of the prompt with your college's name and short tag. Everything else is paste-ready.

COLLEGE_NAME = <JSS Science and Technology>
COLLEGE_SHORT = <SJCE>

Build a mobile-first React + Vite + TypeScript + Tailwind v3 + shadcn/ui SPA called "{COLLEGE_NAME} Companies Research & Placement Analytics Portal" (a.k.a. "{COLLEGE_NAME} Placement Intelligence Hub"). Add React Router 6, React Query 5, framer-motion, lucide-react, recharts, and the standard shadcn component set.

=== PHASE 1 SCOPE — UI ONLY ===

- DO NOT create any database. DO NOT enable Lovable Cloud / Supabase. DO NOT create any tables, migrations, RLS policies, or edge functions.
- DO NOT create a Supabase client file. DO NOT add @supabase/supabase-js.
- All data comes from a single hardcoded TypeScript seed file: src/data/seedCompanies.ts (full content given below). The whole portal must render correctly from this seed alone.
- Supabase integration will be added in a separate Phase 2 prompt later — design the data layer so swapping seed → Supabase is a one-file change (normalizers in src/lib/companyData.ts accept the same JSON shapes as the future tables).

=== HARD CONSTRAINTS (NEVER violate) ===

- NO LOGIN. No /login route, no AuthContext, no ProtectedRoute, no auth UI, no Supabase Auth. Every route is reachable by any visitor directly.
- NO COLLEGE LOGO asset. No public/*.jpg|png for the college. No <img> for the college anywhere. The hero uses text only — the {COLLEGE_NAME} wordmark and a "{COLLEGE_SHORT} · INTELLIGENCE PLATFORM" pill. Recruiting-company logos via Logo.dev are still allowed (NOT the college logo).
  Never display CTC, Stipend, or Selection Ratio anywhere in the platform.
  Mobile-first design.

Use a professional enterprise SaaS layout:

- Sidebar background: #F8FAFC
- Sidebar border: #E5E7EB
- Sidebar text: #334155
- Active navigation: #2563EB text on #EFF6FF background
- Main content background: #FFFFFF
- Cards: white with subtle borders
- Minimal shadows
- Clean enterprise styling

Avoid dark mode styling by default.

- Category colors (exact hex, do not substitute): Super Dream #7c3aed, Dream #2563eb, Standard #16a34a, Regular #d97706.
- Bloom level colors (exact): CU #3b82f6, AP #22c55e, AS #eab308, EV #ef4444, CR #a855f7.
  No hero gradients.

Use:

- White background
- Bottom border
- Large heading
- Small descriptive subtitle

Google Workspace style.

- Fonts: Outfit for all h1-h6 (font-heading), Inter for body (font-body), via Google Fonts.

=== DESIGN TOKENS (src/index.css, HSL) ===
--background 210 20% 98%; --foreground 222 84% 5%; --card 0 0% 100%;
--primary 222 47% 11%; --secondary 210 40% 96%; --muted-foreground 215 16% 47%;
--border 214 32% 91%; --radius 0.75rem;
--navy 222 47% 11%; --navy-light 217 33% 17%;
--super-dream 263 70% 58%; --dream 221 83% 53%; --standard 142 72% 29%; --regular 32 95% 44%;
--expert 0 72% 51%; --advanced 21 90% 48%; --pro 221 83% 53%; --beginner 142 72% 29%;
--sidebar-background 210 40% 98%;
--sidebar-foreground 215 25% 27%;
--sidebar-accent 214 100% 97%;
Add the matching dark-mode block and expose `navy`, `super-dream`, `dream`, `standard`, `regular`, `expert`, `advanced`, `pro`, `beginner` in tailwind.config.ts. Add a `glow` keyframe animation for the NEW badge (2s ease-in-out infinite).

=== ROUTES (MANDATORY EXACT IMPLEMENTATION) ===

Implement React Router 6 using nested routes EXACTLY as follows:

<Route path="/" element={<Index />} />

<Route path="/company" element={<AppLayout />}>
<Route index element={<Navigate to="intelligence" replace />} />
<Route path="intelligence" element={<CompanyIntelligence />} />
<Route path="skills" element={<SkillIntelligence />} />
</Route>

<Route path="*" element={<NotFound />} />

REQUIREMENTS:

- CompanyIntelligence MUST exist at:
  /company/intelligence

- SkillIntelligence MUST exist at:
  /company/skills

- Visiting /company MUST automatically redirect to:
  /company/intelligence

- AppLayout MUST contain an <Outlet />

- AppSidebar navigation links MUST use:
  /company/intelligence
  /company/skills

- CompanyCard click MUST use:
  navigate("/company/intelligence")

DO NOT create any /dashboard route.
DO NOT create any /login route.
DO NOT create any ProtectedRoute.

=== PROVIDERS (App.tsx outside→inside) ===
QueryClientProvider (staleTime 5min, gcTime 10min, retry 1, refetchOnWindowFocus false) → TooltipProvider → Toaster+Sonner → CompanyProvider → BrowserRouter → Suspense → Routes.
DO NOT include AuthProvider.

=== COMPANY CONTEXT ===

Persist:

{
companyId,
companyName,
logoUrl
}

to localStorage key:

"selected-company"

On application startup:

1. Read selected-company from localStorage.
2. Find matching company from SEED_COMPANIES.
3. Restore CompanyContext.

Route Guards:

- CompanyIntelligence and SkillIntelligence MUST work after browser refresh.
- They MUST load company data from localStorage + SEED_COMPANIES.
- If selected-company is missing:
  navigate("/").

Never render NotFound because company data is missing.

NotFound must ONLY be used for invalid URLs.

=== 22 INTELLIGENCE SECTIONS (in order) ===
Company Identity, Overview & Vision, Leadership, Funding & Financials, Global Presence, Products & Services, Technology Stack, Partnerships & Ecosystem, Competitive Landscape, Market Opportunity, Core Value Proposition & ESG, Culture & Work Life, Recent News & Milestones, Sales & Customer Metrics, Risk & Compliance, Work Location & Commute, Safety & Wellbeing, Career Growth & Learning, Brand & Reputation, Compensation & Benefits, Digital Presence & Ratings, Contact Information.
Build buildIntelligenceSections(profile?) in src/data/intelligenceData.tsx returning section/field schema (lucide icons, labels). Merge profile fields when passed.

=== PAGES (exact behavior) ===

Index (/):

- Hero:

- Clean white background
- Bottom border
- Large heading
- Small subtitle
- Search bar directly below

Professional enterprise SaaS styling., H1 "{COLLEGE_NAME} Companies Research & Placement Analytics Portal", subtitle "Your strategic edge for campus placements", search input (200ms debounce + clear X). NO Logout button, NO auth UI.

- 5 filter pills with live counts (All, Super Dream, Dream, Standard, Regular) using exact category colors.
- Grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 of memoized CompanyCard hoisted OUTSIDE the page: logo (CompanyLogo helper using VITE_LOGO_DEV_PUBLISHABLE_KEY if set, DB url fallback, initial-letter final fallback), company-type badge, name, short_name, MapPin (HQ), Users (size), TrendingUp/Down (yoy_growth_rate; red if starts with "-"), ArrowRight bottom-right. Match na/n/a/none/-/null/undefined → italic "not publicly available".
  CompanyCard click handler MUST:

1. Save selected-company to localStorage.
2. Update CompanyContext.
3. Navigate("/company/intelligence").

Do not rely solely on React state.
Selection must survive page refresh.

- 8-card skeleton, empty state with Reset CTA.

CompanyIntelligence (/company/intelligence):
Sticky top information bar:

Left:

- Company logo
- Company name
- Industry badge

Right:

- Website button
- LinkedIn button

No hero section.
No gradient background.

- Sticky tab bar (22 tabs) with scroll-spy + scrollToSection(idx) using isScrollingRef guard; auto-center active tab.
- Each section: memoized card w/ icon, title, count badge, FieldRow (label sm:w-1/3, value sm:w-2/3). renderValue handles url|video|rating|list|paragraph|auto-pill detection on ; and ,. isNullish collapses na/n/a/null/-/none → "Not Available" pill.

SkillIntelligence (/company/skills):

- Header: company logo + "{Company} Skill Intelligence".
- Bloom 5-col legend (CU/AP/AS/EV/CR tints).
- Criticality 3-card legend (Critical/Important/Baseline).
- Skill cards sorted desc: name + Bloom badge + score/10, colored progress bar, criticality label, expandable 10-level roadmap. Locked rows above target → lock icon + "Beyond scope".
- proficiencyToBloom: 1-2→CU, 3-4→AP, 5-6→AS, 7-8→EV, 9-10→CR. scoreToCriticality: ≥7 Critical, ≥5 Important, else Baseline.

=== SHELL ===

- AppLayout: SidebarProvider + AppSidebar + main (header w/ mobile SidebarTrigger + breadcrumbs showing company name) + <Outlet>.
  AppSidebar: collapsible="icon", 2 nav items

- Company Intelligence
- Skill Intelligence

Footer:

- All Companies

NO user profile section.
NO logout button.

=== DATA LAYER (src/lib/companyData.ts) ===
Pure normalizers, exported TS interfaces:

- normalizeCompanySummary(short_json) → CompanySummary
- normalizeCompanyProfile(full_json, short_json) → CompanyProfile (all 163 fields)
- normalizeDashboardSkills(skillLevels[]) → DashboardSkill[]
  Helpers: asString, asRecord, splitItems (split on newlines, periods, semicolons, bullets), titleCaseFromCode, scoreToDifficulty (≥8 EXPERT, ≥6 ADVANCED, ≥4 PRO, else BEGINNER).
  These normalizers MUST read from the seed in Phase 1 — but their inputs are the raw JSON shapes (short_json / full_json) so Phase 2 can pipe Supabase rows in untouched.

=== SEED DATA (src/data/seedCompanies.ts) ===
Create this file with exactly ONE company so every page renders fully on first load. Use the following data verbatim (it is a real company — Accenture — provided as the reference dataset). All keys map 1:1 to the future JSONB columns described above.

export const SEED_COMPANIES = [
{
company_id: 1,
short_json: {
name: "Accenture plc",
short_name: "Accenture",
logo_url: "https://www.accenture.com/_acnmedia/Accenture/Dev/RedesigNAcc_Logo_Black.svg",
category: "Enterprise",
company_type: "Dream", // map to Super Dream/Dream/Standard/Regular as appropriate for {COLLEGE_NAME}
incorporation_year: 1989,
employee_size: "740,000 employees",
headquarters_address: "Dublin, Ireland",
operating_countries: "United States; United Kingdom; India; Germany; France; Japan; Australia; Canada; Brazil; Singapore",
office_locations: "New York, United States; London, United Kingdom; Bangalore, India; Paris, France; Tokyo, Japan; Toronto, Canada; Sydney, Australia; Frankfurt, Germany",
yoy_growth_rate: "3%",
website_url: "https://www.accenture.com"
},
full_json: {
// ===== Identity & overview =====
name: "Accenture plc", short_name: "Accenture", category: "Enterprise", incorporation_year: 1989, nature_of_company: "Public",
overview_text: "Accenture is a global professional services company providing strategy, consulting, digital, technology, and operations services, serving large enterprises and governments across more than 120 countries with a strong focus on cloud, AI, and digital transformation.",
headquarters_address: "Dublin, Ireland",
operating_countries: "United States; United Kingdom; India; Germany; France; Japan; Australia; Canada; Brazil; Singapore",
office_count: "200+",
office_locations: "New York, United States; London, United Kingdom; Bangalore, India; Paris, France; Tokyo, Japan; Toronto, Canada; Sydney, Australia; Frankfurt, Germany",
employee_size: "740,000 employees",
vision_statement: "To drive continuous innovation and help the world's leading organizations build their digital core and achieve greater value.",
mission_statement: "Deliver on the promise of technology and human ingenuity to create value and shared success for clients, people, shareholders, partners, and communities.",
core_values: "Client value creation; Integrity; Respect for individuals; Innovation; Stewardship; Best people",
history_timeline: "One of the largest employers of tech talent globally; Invests over $1B annually in R&D and innovation",
      recent_news: "2024, Invested $3B in generative AI strategy; 2024, Acquired multiple cloud and AI consulting firms in Europe",
// ===== Digital presence =====
website_url: "https://www.accenture.com", linkedin_url: "https://www.linkedin.com/company/accenture",
twitter_handle: "@Accenture", facebook_url: "https://www.facebook.com/accenture", instagram_url: "https://www.instagram.com/accenture",
primary_contact_email: "contact@accenture.com", primary_phone_number: "NA",
// ===== Risk & compliance =====
regulatory_status: "ISO 27001; SOC 2; GDPR Compliance; HIPAA Compliance",
legal_issues: "Periodic labor and contract disputes; no major unresolved global litigation",
esg_ratings: "Net-zero commitment by 2025; Science Based Targets; Diversity equity programs",
supply_chain_dependencies: "Cloud providers; Software vendors; Talent workforce",
geopolitical_risks: "Trade regulations; Data privacy laws; Regional conflicts",
macro_risks: "Global recession; Enterprise IT budget cuts",
carbon_footprint: "Actively reducing via renewable energy sourcing",
ethical_sourcing: "Supplier code of conduct; ESG audits",
// ===== Brand & ratings =====
marketing_video_url: "https://www.youtube.com/@Accenture",
customer_testimonials: "Unilever transformation story; Microsoft cloud case",
website_quality: "Enterprise-grade, high clarity, strong thought leadership, polished UX",
website_rating: "NA", website_traffic_rank: "Global 12,000; US 4,000",
social_media_followers: "15000000", glassdoor_rating: "4.1/5", indeed_rating: "4.2/5", google_rating: "4.3/5",
awards_recognitions: "Fortune Global 500; Great Place to Work Certified; Gartner Magic Quadrant Leader; Forbes Most Admired Companies",
brand_sentiment_score: "Very Positive, strong global brand, high enterprise trust",
event_participation: "World Economic Forum; Microsoft Ignite; AWS re:Invent; Global Fintech Fest",
// ===== Products & services =====
pain_points_addressed: "Digital transformation complexity; Legacy IT modernization; Cloud migration risk; Talent and skill gaps; Cybersecurity threats; Operational inefficiency",
focus_sectors: "Financials; Health Care; Consumer Discretionary; Industrials; Energy; Telecommunications; Public Sector; Technology",
offerings_description: "Management Consulting; Technology Services; Cloud Solutions; AI & Analytics; Cybersecurity; Business Process Outsourcing; Digital Engineering",
top_customers: "Fortune 500 Enterprises; Global Banks; Government Agencies; Healthcare Systems; Telecom Operators; Energy Majors",
core_value_proposition: "End-to-end transformation; Global delivery scale; Deep industry expertise; Strong technology partnerships; Innovation leadership",
unique_differentiators: "Global delivery network; Industry-specific consulting; Strong alliance ecosystem; Proprietary AI and analytics platforms",
competitive_advantages: "Brand leadership; Scale and geographic reach; Deep enterprise relationships; Strong partner network",
weaknesses_gaps: "High cost structure; Dependency on large enterprise spending cycles; Complex organizational structure",
key_challenges_needs: "Talent retention; Pricing pressure from competitors; Rapid AI disruption; Regulatory compliance across regions",
key_competitors: "IBM Consulting; Deloitte; TCS; Infosys; Capgemini; Cognizant; Wipro; PwC; EY",
market_share_percentage: "6–7% of global IT services market",
sales_motion: "Enterprise Field Sales",
customer_concentration_risk: "No, highly diversified client base",
exit_strategy_history: "Mature public enterprise; Strategic acquisitions",
benchmark_vs_peers: "Higher revenue than Capgemini; Comparable margins to IBM Consulting; Stronger cloud alliances than TCS",
future_projections: "Revenue projected $70B by 2027",
      strategic_priorities: "Generative AI leadership; Cloud transformation; Sustainability consulting; Emerging markets growth",
      industry_associations: "World Economic Forum; NASSCOM; Business Roundtable",
      case_studies: "Microsoft cloud modernization; Unilever digital supply chain",
      go_to_market_strategy: "Enterprise account teams; Strategic alliances; Thought leadership marketing",
      innovation_roadmap: "GenAI platforms; Industry cloud solutions; Cyber resilience tools",
      product_pipeline: "AI copilots; Industry SaaS accelerators",
      tam: "$1.5T global IT and business services", sam: "$400B enterprise digital transformation", som: "7%",
      // ===== Culture & benefits =====
      leave_policy: "Paid leave; Mental health days", health_support: "Health insurance; Mental wellness",
      fixed_vs_variable_pay: "Mostly fixed", bonus_predictability: "Moderate",
      esops_incentives: "Stock grants; Performance shares", family_health_insurance: "Dependents covered; OPD",
      relocation_support: "Housing; Travel reimbursement", lifestyle_benefits: "Wellness programs; Meals; Fitness",
      hiring_velocity: "Technology ~15,000 open roles; Consulting ~8,000 open roles; Operations ~6,000 open roles; Sales ~2,000 open roles",
      employee_turnover: "15% annually (industry benchmark estimate)", avg_retention_tenure: "4.5 years",
      diversity_metrics: "47% women workforce; Global DEI programs",
      work_culture_summary: "Collaborative; Performance-driven", manager_quality: "Strong coaching focus",
      psychological_safety: "High", feedback_culture: "Continuous feedback; Annual reviews",
      diversity_inclusion_score: "Gender equity; Inclusive leadership", ethical_standards: "High integrity; Compliance-driven",
      burnout_risk: "Moderate", layoff_history: "Periodic restructuring", mission_clarity: "High",
      sustainability_csr: "Net-zero goals; Community programs", crisis_behavior: "Transparent and compliance-driven",
      // ===== Funding & financials =====
      annual_revenue: "$64.1B (FY2024)", annual_profit: "$7.2B net income (FY2024)",
      revenue_mix: "Consulting 55%; Managed Services 45%", valuation: "$220B market capitalization",
yoy_growth_rate: "3%", profitability_status: "Profitable",
key_investors: "Vanguard Group; BlackRock; State Street",
recent_funding_rounds: "Public equity markets, ongoing institutional investment",
total_capital_raised: "Public market funded",
customer_acquisition_cost: "$100K+ per enterprise", customer_lifetime_value: "$5M+",
cac_ltv_ratio: "NA", churn_rate: "<3%", net_promoter_score: "60",
burn_rate: "Not Applicable, cash-flow positive", runway_months: "Not Applicable", burn_multiplier: "<1.0",
// ===== Work location =====
remote_policy_details: "Hybrid, 60% flexible", typical_hours: "Flexible",
overtime_expectations: "Occasional during project peaks", weekend_work: "Rare",
flexibility_level: "Remote; Hybrid", location_centrality: "Central business districts",
public_transport_access: "Metro; Bus; Train", cab_policy: "Ride-hailing; Company transport",
airport_commute_time: "45 minutes", office_zone_type: "IT hub",
area_safety: "Secure; Well-monitored", safety_policies: "Late-night transport; Workplace safety",
infrastructure_safety: "Fire compliant; Secure access", emergency_preparedness: "Medical support; Fire drills",
// ===== Leadership =====
ceo_name: "Julie Sweet", ceo_linkedin_url: "https://www.linkedin.com/in/juliesweet",
key_leaders: "Julie Sweet, Chair & CEO; Manish Sharma, CEO; Jack Azagury, Group Chief Executive",
warm_intro_pathways: "Fortune 500 board connections; Alumni network; Technology partner ecosystems",
decision_maker_access: "Low, Large enterprise structure with formal procurement and partner-led access",
contact_person_name: "Julie Sweet", contact_person_title: "CEO",
contact_person_email: "prabhakar.d.phatak@accenture.com", contact_person_phone: "793 1578",
board_members: "Julie Sweet; David Rowland; Former global executives",
// ===== Career growth =====
training_spend: "$1,500 per employee/year", onboarding_quality: "Industry-leading",
      learning_culture: "Internal LMS; Certifications", exposure_quality: "High",
      mentorship_availability: "Leadership mentors; Peer mentors", internal_mobility: "High",
      promotion_clarity: "Merit-based; Transparent", tools_access: "Enterprise software; Cloud platforms",
      role_clarity: "High", early_ownership: "Medium", work_impact: "Client-facing; Revenue-linked",
      execution_thinking_balance: "Balanced", automation_level: "High",
      cross_functional_exposure: "Consulting; Technology; Sales", company_maturity: "Mature enterprise",
      brand_value: "Global top-tier brand", client_quality: "Fortune 500; Governments",
      exit_opportunities: "Big Tech; Global consultancies; Industry leadership roles",
      skill_relevance: "Very High", external_recognition: "Strong global credibility",
      network_strength: "Global alumni network; Executive connections",
      global_exposure: "Global clients; International teams",
      // ===== Tech =====
      technology_partners: "Microsoft; SAP; Oracle; AWS; Google Cloud; Salesforce; NVIDIA",
      intellectual_property: "Accenture Labs IP; Industry AI frameworks; Proprietary cloud accelerators",
      r_and_d_investment: "$1.5B annually",
ai_ml_adoption_level: "High, generative AI platforms, AI-led consulting, automation for delivery optimization",
tech_stack: "SAP; Salesforce; AWS; Microsoft Azure; ServiceNow; Kubernetes; Python",
cybersecurity_posture: "ISO 27001; SOC 2; Global cyber defense centers",
partnership_ecosystem: "Microsoft; SAP; Oracle; Google; AWS; Salesforce",
tech_adoption_rating: "High, Industry Leader; Top-tier among peers"
},
skill_levels: [
{ skill_set_id: 1, skill_set_name: "Data Structures & Algorithms", required_level: 8, required_proficiency: "Expert" },
{ skill_set_id: 2, skill_set_name: "Object-Oriented Programming", required_level: 7, required_proficiency: "Advanced" },
{ skill_set_id: 3, skill_set_name: "SQL & Databases", required_level: 7, required_proficiency: "Advanced" },
{ skill_set_id: 4, skill_set_name: "Cloud Fundamentals (AWS/Azure)", required_level: 6, required_proficiency: "Proficient" },
{ skill_set_id: 5, skill_set_name: "Operating Systems", required_level: 6, required_proficiency: "Proficient" },
{ skill_set_id: 6, skill_set_name: "Computer Networks", required_level: 5, required_proficiency: "Proficient" },
{ skill_set_id: 7, skill_set_name: "Aptitude & Logical Reasoning", required_level: 7, required_proficiency: "Advanced" },
{ skill_set_id: 8, skill_set_name: "Communication & Behavioral", required_level: 7, required_proficiency: "Advanced" },
{ skill_set_id: 9, skill_set_name: "Web Development Basics", required_level: 5, required_proficiency: "Proficient" },
{ skill_set_id: 10, skill_set_name: "System Design (Intro)", required_level: 4, required_proficiency: "Intermediate" },
{ skill_set_id: 11, skill_set_name: "Git & Version Control", required_level: 5, required_proficiency: "Proficient" },
{ skill_set_id: 12, skill_set_name: "Generative AI Basics", required_level: 4, required_proficiency: "Intermediate" }
]
}
];

For each of the 12 skills above, also generate a 10-level topics roadmap (level_number 1..10, short topic string per level) in src/data/skillTopics.ts so SkillIntelligence renders the full ladder. The first three levels should be fundamentals, mid levels intermediate, top levels advanced/applied — keep each topic string short (≤ 90 chars).

=== ENV VARS (Phase 1) ===
Only VITE_LOGO_DEV_PUBLISHABLE_KEY (optional). DO NOT add VITE_SUPABASE_* — Phase 1 has no Supabase. If Logo.dev key is missing, CompanyLogo falls back to the seed logo_url, then to an initial-letter circle.

=== DELIVERABLES ===

- Full source tree as described, with {COLLEGE_NAME} / {COLLEGE_SHORT} substituted everywhere.
- src/data/seedCompanies.ts containing the Accenture record exactly as given so every page renders fully on first load.
- src/data/skillTopics.ts with 10-level topic ladders for all 12 seed skills.
- Vitest configured with one smoke test.
- README explaining: (a) Phase 1 is UI-only with hardcoded seed data, (b) the portal is fully public (no login), (c) which COLLEGE_NAME was used, (d) Phase 2 will swap the data layer to Supabase using the JSON shapes already produced by the normalizers.
- NO college logo file in public/ and NO reference to one in code.
- NO Supabase client, NO migrations, NO tables.

Build it now end-to-end. After build, verify:

1. Visiting / loads the company grid with the Accenture card visible.
2. Clicking the card navigates to /company/intelligence and persists selection across reload.
3. The hero reads "{COLLEGE_NAME} Companies Research & Placement Analytics Portal".
4. /company/intelligence renders all 22 sections populated from the Accenture full_json.
5. /company/skills renders all 12 skill cards with expandable 10-level roadmaps.
6. NO /login route, NO Logout button, NO college logo file anywhere.
7. NO CTC/Stipend/Selection-Ratio fields.

=== ROUTING VALIDATION (MANDATORY) ===

Before considering the build complete verify all:

✓ Visiting "/" shows company cards

✓ Clicking Accenture navigates to:
/company/intelligence

✓ Browser refresh on:
/company/intelligence

still loads company data

✓ Browser refresh on:
/company/skills

still loads company data

✓ Visiting:
/company

redirects to:
/company/intelligence

✓ Sidebar links navigate correctly

✓ No route produces 404 except genuinely invalid URLs

✓ No /dashboard route exists

✓ No /login route exists

✓ NotFound only handles unmatched URLs

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9e870911-255d-4735-bf04-7c18b81c1b44).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
