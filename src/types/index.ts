/* ===== CredLens Type Definitions ===== */

/** Supported AI tools */
export type ToolId =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

/** Primary use case for AI tools */
export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

/** Plan information for a specific tool */
export interface ToolPlan {
  id: string;
  name: string;
  pricePerUser: number; // monthly price per user/seat
  isApiPlan?: boolean; // true for usage-based API plans
  features?: string[];
}

/** Tool definition with all available plans */
export interface ToolDefinition {
  id: ToolId;
  name: string;
  vendor: string;
  category: "ide" | "chat" | "api";
  icon: string;
  color: string;
  pricingUrl: string;
  plans: ToolPlan[];
}

/** User's input for a single tool they're using */
export interface ToolSpendInput {
  toolId: ToolId;
  planId: string;
  monthlySpend: number; // actual monthly spend
  seats: number; // number of seats/users
}

/** Complete spend form input */
export interface SpendFormData {
  tools: ToolSpendInput[];
  teamSize: number;
  useCase: UseCase;
}

/** Recommendation type */
export type RecommendationType =
  | "downgrade" // same vendor, cheaper plan
  | "switch" // different vendor, similar capability
  | "optimize" // same plan but fewer seats
  | "credex" // buy through Credex for discount
  | "keep"; // already optimal

/** Single tool audit result */
export interface ToolAuditResult {
  toolId: ToolId;
  toolName: string;
  currentPlan: string;
  currentMonthlySpend: number;
  recommendationType: RecommendationType;
  recommendedAction: string;
  recommendedPlan?: string;
  recommendedTool?: string;
  newMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
  credexDiscount?: number; // percentage discount available through Credex
}

/** Complete audit result */
export interface AuditResult {
  id?: string;
  shareId: string;
  createdAt: string;
  formData: SpendFormData;
  toolResults: ToolAuditResult[];
  totalCurrentMonthlySpend: number;
  totalRecommendedMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary?: string;
  savingsTier: "high" | "medium" | "low" | "optimal"; // >$500, $100-500, $1-100, $0
}

/** Lead capture data */
export interface LeadData {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditShareId: string;
  totalMonthlySavings: number;
  createdAt: string;
}
