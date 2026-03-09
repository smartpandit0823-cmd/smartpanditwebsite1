import type { QueryFilter } from "mongoose";
import connectDB from "@/lib/db/mongodb";
import Puja, { IPuja, PujaStatus } from "@/models/Puja";
import { BaseRepository, PaginatedResult, PaginationOptions } from "./base.repository";

export interface PujaListFilter {
  search?: string;
  status?: PujaStatus;
  category?: string;
  pujaType?: string;
}

export class PujaRepository extends BaseRepository<IPuja> {
  constructor() {
    super(Puja);
  }

  async list(filter: PujaListFilter, pagination: PaginationOptions): Promise<PaginatedResult<IPuja>> {
    await connectDB();
    const q: QueryFilter<IPuja> = {};

    if (filter.status && filter.status !== ("all" as PujaStatus)) q.status = filter.status;
    if (filter.category) q.category = filter.category;
    if (filter.pujaType) q.pujaType = filter.pujaType as IPuja["pujaType"];
    if (filter.search) {
      q.$or = [
        { name: { $regex: filter.search, $options: "i" } },
        { slug: { $regex: filter.search, $options: "i" } },
        { shortDescription: { $regex: filter.search, $options: "i" } },
      ];
    }

    return this.find(q, { sort: { createdAt: -1 } }, pagination) as Promise<PaginatedResult<IPuja>>;
  }

  async softDelete(id: string): Promise<IPuja | null> {
    return this.updateById(id, {
      status: "deleted",
      deletedAt: new Date(),
    } as unknown as Partial<IPuja>);
  }

  async getActive(): Promise<IPuja[]> {
    await connectDB();
    return Puja.find({ status: "active" }).sort({ featured: -1, totalBookings: -1 }).exec();
  }
}
