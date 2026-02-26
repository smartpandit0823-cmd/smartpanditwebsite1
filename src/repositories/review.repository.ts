import { FilterQuery } from "mongoose";
import connectDB from "@/lib/db/mongodb";
import Review, { IReview, ReviewStatus } from "@/models/Review";
import { BaseRepository, PaginatedResult, PaginationOptions } from "./base.repository";

export interface ReviewListFilter {
  status?: ReviewStatus;
  targetModel?: string;
}

export class ReviewRepository extends BaseRepository<IReview> {
  constructor() {
    super(Review);
  }

  async list(filter: ReviewListFilter, pagination: PaginationOptions): Promise<PaginatedResult<IReview>> {
    await connectDB();
    const q: FilterQuery<IReview> = {};
    if (filter.status) q.status = filter.status;
    if (filter.targetModel) q.targetModel = filter.targetModel as IReview["targetModel"];
    return this.find(q, { sort: { createdAt: -1 } }, pagination) as Promise<PaginatedResult<IReview>>;
  }
}
