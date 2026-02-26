import { FilterQuery } from "mongoose";
import connectDB from "@/lib/db/mongodb";
import AuditLog, { IAuditLog } from "@/models/AuditLog";
import { BaseRepository, PaginatedResult, PaginationOptions } from "./base.repository";

export interface AuditListFilter {
  entity?: string;
  action?: string;
  adminId?: string;
}

export class AuditRepository extends BaseRepository<IAuditLog> {
  constructor() {
    super(AuditLog);
  }

  async list(filter: AuditListFilter, pagination: PaginationOptions): Promise<PaginatedResult<IAuditLog>> {
    await connectDB();
    const q: FilterQuery<IAuditLog> = {};
    if (filter.entity) q.entity = filter.entity;
    if (filter.action) q.action = filter.action as IAuditLog["action"];
    if (filter.adminId) q.adminId = filter.adminId as unknown as IAuditLog["adminId"];
    return this.find(q, { sort: { createdAt: -1 } }, pagination) as Promise<PaginatedResult<IAuditLog>>;
  }
}
