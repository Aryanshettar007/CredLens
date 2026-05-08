import type { ToolDefinition } from "@/types";

/**
 * Official pricing data for all supported AI tools.
 * Sources verified May 2026 — see PRICING_DATA.md for URLs and dates.
 */
export const TOOL_DEFINITIONS: ToolDefinition[] = [
  // ─── IDE / Coding Assistants ────────────────────────
  {
    id: "cursor",
    name: "Cursor",
    vendor: "Anysphere",
    category: "ide",
    icon: "cursor",
    color: "#000000",
    pricingUrl: "https://www.cursor.com/pricing",
    plans: [
      { id: "cursor-hobby", name: "Hobby (Free)", pricePerUser: 0 },
      { id: "cursor-pro", name: "Pro", pricePerUser: 20 },
      { id: "cursor-pro-plus", name: "Pro+", pricePerUser: 60 },
      { id: "cursor-ultra", name: "Ultra", pricePerUser: 200 },
      { id: "cursor-business", name: "Business", pricePerUser: 40 },
    ],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    vendor: "GitHub / Microsoft",
    category: "ide",
    icon: "copilot",
    color: "#24292e",
    pricingUrl: "https://github.com/features/copilot/plans",
    plans: [
      { id: "copilot-free", name: "Free", pricePerUser: 0 },
      { id: "copilot-pro", name: "Pro", pricePerUser: 10 },
      { id: "copilot-pro-plus", name: "Pro+", pricePerUser: 39 },
      { id: "copilot-business", name: "Business", pricePerUser: 19 },
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    vendor: "Cognition AI",
    category: "ide",
    icon: "windsurf",
    color: "#0EA5E9",
    pricingUrl: "https://windsurf.com/pricing",
    plans: [
      { id: "windsurf-free", name: "Free", pricePerUser: 0 },
      { id: "windsurf-pro", name: "Pro", pricePerUser: 20 },
      { id: "windsurf-max", name: "Max", pricePerUser: 200 },
      { id: "windsurf-teams", name: "Teams", pricePerUser: 40 },
    ],
  },

  // ─── Chat / Assistants ──────────────────────────────
  {
    id: "chatgpt",
    name: "ChatGPT",
    vendor: "OpenAI",
    category: "chat",
    icon: "chatgpt",
    color: "#10A37F",
    pricingUrl: "https://openai.com/chatgpt/pricing/",
    plans: [
      { id: "chatgpt-free", name: "Free", pricePerUser: 0 },
      { id: "chatgpt-plus", name: "Plus", pricePerUser: 20 },
      { id: "chatgpt-team", name: "Team", pricePerUser: 25 },
      { id: "chatgpt-enterprise", name: "Enterprise", pricePerUser: 60 },
    ],
  },
  {
    id: "claude",
    name: "Claude",
    vendor: "Anthropic",
    category: "chat",
    icon: "claude",
    color: "#D4A574",
    pricingUrl: "https://www.anthropic.com/pricing",
    plans: [
      { id: "claude-free", name: "Free", pricePerUser: 0 },
      { id: "claude-pro", name: "Pro", pricePerUser: 20 },
      { id: "claude-max-5x", name: "Max 5x", pricePerUser: 100 },
      { id: "claude-max-20x", name: "Max 20x", pricePerUser: 200 },
      { id: "claude-team", name: "Team", pricePerUser: 25 },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    vendor: "Google",
    category: "chat",
    icon: "gemini",
    color: "#4285F4",
    pricingUrl: "https://one.google.com/about/ai-premium",
    plans: [
      { id: "gemini-free", name: "Free", pricePerUser: 0 },
      { id: "gemini-pro", name: "Google AI Pro", pricePerUser: 20 },
      { id: "gemini-ultra", name: "Google AI Ultra", pricePerUser: 250 },
    ],
  },

  // ─── APIs ───────────────────────────────────────────
  {
    id: "openai-api",
    name: "OpenAI API",
    vendor: "OpenAI",
    category: "api",
    icon: "openai",
    color: "#412991",
    pricingUrl: "https://openai.com/api/pricing/",
    plans: [
      {
        id: "openai-api-usage",
        name: "Pay-as-you-go",
        pricePerUser: 0,
        isApiPlan: true,
      },
    ],
  },
  {
    id: "anthropic-api",
    name: "Anthropic API",
    vendor: "Anthropic",
    category: "api",
    icon: "anthropic",
    color: "#191919",
    pricingUrl: "https://www.anthropic.com/pricing#api",
    plans: [
      {
        id: "anthropic-api-usage",
        name: "Pay-as-you-go",
        pricePerUser: 0,
        isApiPlan: true,
      },
    ],
  },
];

/** Quick lookup map: toolId → ToolDefinition */
export const TOOL_MAP = new Map(
  TOOL_DEFINITIONS.map((t) => [t.id, t])
);

/** Get tool definition by ID */
export function getToolDef(id: string): ToolDefinition | undefined {
  return TOOL_MAP.get(id as ToolDefinition["id"]);
}

/** Get plan by toolId + planId */
export function getPlan(toolId: string, planId: string) {
  const tool = getToolDef(toolId);
  return tool?.plans.find((p) => p.id === planId);
}

/** Use-case labels */
export const USE_CASE_OPTIONS: { value: string; label: string; description: string }[] = [
  { value: "coding", label: "Coding", description: "Software development & engineering" },
  { value: "writing", label: "Writing", description: "Content creation & copywriting" },
  { value: "data", label: "Data Analysis", description: "Data processing & insights" },
  { value: "research", label: "Research", description: "Deep research & exploration" },
  { value: "mixed", label: "Mixed / General", description: "Combination of use cases" },
];
