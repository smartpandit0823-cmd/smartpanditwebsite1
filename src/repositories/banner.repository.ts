import { FilterQuery } from "mongoose";
import connectDB from "@/lib/db/mongodb";
import Banner, { IBanner } from "@/models/Banner";
import { BaseRepository, PaginatedResult, PaginationOptions } from "./base.repository";

export interface BannerListFilter {
  position?: string;
  status?: string;
}

export class BannerRepository extends BaseRepository<IBanner> {
  constructor() {
    super(Banner);
  }

  async list(
    filter: BannerListFilter,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<IBanner>> {
    await connectDB();
    const q: FilterQuery<IBanner> = {};
    if (filter.position) q.position = filter.position as IBanner["position"];
    if (filter.status) q.status = filter.status as IBanner["status"];
    return this.find(q, { sort: { order: 1, createdAt: -1 } }, pagination) as Promise<PaginatedResult<IBanner>>;
  }
}
