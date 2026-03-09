import type { QueryFilter } from "mongoose";
import connectDB from "@/lib/db/mongodb";
import AstrologyRequest, { IAstrologyRequest, AstrologyStatus } from "@/models/AstrologyRequest";
import { BaseRepository, PaginatedResult, PaginationOptions } from "./base.repository";

export interface AstrologyListFilter {
  status?: AstrologyStatus;
  priority?: string;
  search?: string;
}

export class AstrologyRepository extends BaseRepository<IAstrologyRequest> {
  constructor() {
    super(AstrologyRequest);
  }

  async list(
    filter: AstrologyListFilter,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<IAstrologyRequest>> {
    await connectDB();
    const q: QueryFilter<IAstrologyRequest> = {};
    if (filter.status) q.status = filter.status;
    if (filter.priority) q.priority = filter.priority as IAstrologyRequest["priority"];
    if (filter.search) {
      q.$or = [
        { name: { $regex: filter.search, $options: "i" } },
        { email: { $regex: filter.search, $options: "i" } },
        { phone: { $regex: filter.search, $options: "i" } },
      ];
    }
    return this.find(
      q,
      { sort: { createdAt: -1 }, populate: "assignedAstrologerId" },
      pagination
    ) as Promise<PaginatedResult<IAstrologyRequest>>;
  }
}
