import type { QueryFilter } from "mongoose";
import connectDB from "@/lib/db/mongodb";
import Pandit, { IPandit, PanditStatus } from "@/models/Pandit";
import { BaseRepository, PaginatedResult, PaginationOptions } from "./base.repository";

export interface PanditListFilter {
  status?: PanditStatus;
  verificationStatus?: string;
  search?: string;
}

export class PanditRepository extends BaseRepository<IPandit> {
  constructor() {
    super(Pandit);
  }

  async list(
    filter: PanditListFilter,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<IPandit>> {
    await connectDB();
    const q: QueryFilter<IPandit> = {};
    if (filter.status) q.status = filter.status;
    if (filter.verificationStatus) q.verificationStatus = filter.verificationStatus as IPandit["verificationStatus"];
    if (filter.search) {
      q.$or = [
        { name: { $regex: filter.search, $options: "i" } },
        { email: { $regex: filter.search, $options: "i" } },
        { phone: { $regex: filter.search, $options: "i" } },
        { city: { $regex: filter.search, $options: "i" } },
      ];
    }
    return this.find(q, { sort: { totalPujasCompleted: -1 } }, pagination) as Promise<PaginatedResult<IPandit>>;
  }

  async getActiveForAssignment(): Promise<IPandit[]> {
    await connectDB();
    return Pandit.find({ status: "active", verificationStatus: "verified" })
      .sort({ totalPujasCompleted: -1 })
      .exec();
  }
}
