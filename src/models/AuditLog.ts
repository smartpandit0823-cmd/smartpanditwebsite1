import mongoose, { Document, Model, Schema } from "mongoose";

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "restore"
  | "login"
  | "logout"
  | "approve"
  | "reject"
  | "assign"
  | "refund"
  | "status_change";

export interface IAuditLog extends Document {
  _id: mongoose.Types.ObjectId;
  adminId: mongoose.Types.ObjectId;
  adminName: string;
  adminEmail: string;
  action: AuditAction;
  entity: string;
  entityId?: string;
  description: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: "AdminUser", required: true },
    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true },
    action: {
      type: String,
      enum: [
        "create",
        "update",
        "delete",
        "restore",
        "login",
        "logout",
        "approve",
        "reject",
        "assign",
        "refund",
        "status_change",
      ],
      required: true,
    },
    entity: { type: String, required: true },
    entityId: { type: String },
    description: { type: String, required: true },
    before: { type: Schema.Types.Mixed },
    after: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true, capped: { size: 50 * 1024 * 1024, max: 10000 } }
);

AuditLogSchema.index({ adminId: 1 });
AuditLogSchema.index({ entity: 1, entityId: 1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ createdAt: -1 });

const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

export default AuditLog;
