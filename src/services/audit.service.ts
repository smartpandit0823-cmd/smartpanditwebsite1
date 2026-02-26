import connectDB from "@/lib/db/mongodb";
import AuditLog, { AuditAction } from "@/models/AuditLog";

export async function createAuditLog(params: {
  adminId: string;
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
}) {
  await connectDB();
  await AuditLog.create(params);
}
