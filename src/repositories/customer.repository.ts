import type { QueryFilter } from "mongoose";
import connectDB from "@/lib/db/mongodb";
import Customer, { ICustomer, CustomerStatus } from "@/models/Customer";
import { BaseRepository, PaginatedResult, PaginationOptions } from "./base.repository";

export interface CustomerListFilter {
  status?: CustomerStatus;
  search?: string;
}

export class CustomerRepository extends BaseRepository<ICustomer> {
  constructor() {
    super(Customer);
  }

  async list(
    filter: CustomerListFilter,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<ICustomer>> {
    await connectDB();
    const q: QueryFilter<ICustomer> = {};
    if (filter.status) q.status = filter.status;
    if (filter.search) {
      q.$or = [
        { name: { $regex: filter.search, $options: "i" } },
        { email: { $regex: filter.search, $options: "i" } },
        { phone: { $regex: filter.search, $options: "i" } },
      ];
    }
    return this.find(q, { sort: { totalSpent: -1 } }, pagination) as Promise<PaginatedResult<ICustomer>>;
  }
}
