import { FilterQuery } from "mongoose";
import connectDB from "@/lib/db/mongodb";
import Blog, { IBlog, BlogStatus } from "@/models/Blog";
import { BaseRepository, PaginatedResult, PaginationOptions } from "./base.repository";

export interface BlogListFilter {
  status?: BlogStatus;
  category?: string;
  search?: string;
}

export class BlogRepository extends BaseRepository<IBlog> {
  constructor() {
    super(Blog);
  }

  async list(filter: BlogListFilter, pagination: PaginationOptions): Promise<PaginatedResult<IBlog>> {
    await connectDB();
    const q: FilterQuery<IBlog> = {};
    if (filter.status) q.status = filter.status;
    if (filter.category) q.category = filter.category;
    if (filter.search) {
      q.$or = [
        { title: { $regex: filter.search, $options: "i" } },
        { content: { $regex: filter.search, $options: "i" } },
      ];
    }
    return this.find(q, { sort: { createdAt: -1 } }, pagination) as Promise<PaginatedResult<IBlog>>;
  }
}
