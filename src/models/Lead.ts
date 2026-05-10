import mongoose, { Schema, Document, Model } from "mongoose";
import type { LeadData } from "@/types";

export interface ILead extends LeadData, Document {}

const LeadSchema = new Schema(
  {
    email: { type: String, required: true },
    companyName: { type: String },
    role: { type: String },
    teamSize: { type: Number },
    auditShareId: { type: String, required: true },
    totalMonthlySavings: { type: Number, required: true },
    createdAt: { type: String, required: true },
  },
  { timestamps: true }
);

export const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);
