import mongoose, { Schema, Document, Model } from "mongoose";
import type { AuditResult } from "@/types";

export interface IAudit extends Omit<AuditResult, "id">, Document {}

const ToolAuditResultSchema = new Schema({
  toolId: { type: String, required: true },
  toolName: { type: String, required: true },
  currentPlan: { type: String, required: true },
  currentMonthlySpend: { type: Number, required: true },
  recommendationType: { type: String, required: true },
  recommendedAction: { type: String, required: true },
  recommendedPlan: { type: String },
  recommendedTool: { type: String },
  newMonthlySpend: { type: Number, required: true },
  monthlySavings: { type: Number, required: true },
  annualSavings: { type: Number, required: true },
  reason: { type: String, required: true },
  credexDiscount: { type: Number },
});

const ToolSpendInputSchema = new Schema({
  toolId: { type: String, required: true },
  planId: { type: String, required: true },
  monthlySpend: { type: Number, required: true },
  seats: { type: Number, required: true },
});

const SpendFormDataSchema = new Schema({
  tools: { type: [ToolSpendInputSchema], required: true },
  teamSize: { type: Number, required: true },
  useCase: { type: String, required: true },
});

const AuditSchema = new Schema(
  {
    shareId: { type: String, required: true, unique: true, index: true },
    createdAt: { type: String, required: true },
    formData: { type: SpendFormDataSchema, required: true },
    toolResults: { type: [ToolAuditResultSchema], required: true },
    totalCurrentMonthlySpend: { type: Number, required: true },
    totalRecommendedMonthlySpend: { type: Number, required: true },
    totalMonthlySavings: { type: Number, required: true },
    totalAnnualSavings: { type: Number, required: true },
    aiSummary: { type: String },
    savingsTier: {
      type: String,
      enum: ["high", "medium", "low", "optimal"],
      required: true,
    },
  },
  { timestamps: true }
);

export const Audit: Model<IAudit> =
  mongoose.models.Audit || mongoose.model<IAudit>("Audit", AuditSchema);
