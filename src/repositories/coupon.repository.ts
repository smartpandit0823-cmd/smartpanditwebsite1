import type { QueryFilter } from "mongoose";
import connectDB from "@/lib/db/mongodb";
import Coupon, { ICoupon, CouponStatus } from "@/models/Coupon";
import { BaseRepository, PaginatedResult, PaginationOptions } from "./base.repository";

export interface CouponListFilter {
  status?: CouponStatus;
  search?: string;
}

export class CouponRepository extends BaseRepository<ICoupon> {
  constructor() {
    super(Coupon);
  }

  async list(filter: CouponListFilter, pagination: PaginationOptions): Promise<PaginatedResult<ICoupon>> {
    await connectDB();
    const q: QueryFilter<ICoupon> = {};
    if (filter.status) q.status = filter.status;
    if (filter.search) q.code = { $regex: filter.search, $options: "i" };
    return this.find(q, { sort: { createdAt: -1 } }, pagination) as Promise<PaginatedResult<ICoupon>>;
  }
}
