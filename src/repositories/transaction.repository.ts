import { FilterQuery } from "mongoose";
import connectDB from "@/lib/db/mongodb";
import Transaction, { ITransaction, TransactionStatus, TransactionType } from "@/models/Transaction";
import { BaseRepository, PaginatedResult, PaginationOptions } from "./base.repository";

export interface TransactionListFilter {
  status?: TransactionStatus;
  type?: TransactionType;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export class TransactionRepository extends BaseRepository<ITransaction> {
  constructor() {
    super(Transaction);
  }

  async list(
    filter: TransactionListFilter,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<ITransaction>> {
    await connectDB();
    const q: FilterQuery<ITransaction> = {};
    if (filter.status) q.status = filter.status;
    if (filter.type) q.type = filter.type;
    if (filter.dateFrom || filter.dateTo) {
      q.createdAt = {};
      if (filter.dateFrom) (q.createdAt as Record<string, unknown>).$gte = filter.dateFrom;
      if (filter.dateTo) (q.createdAt as Record<string, unknown>).$lte = filter.dateTo;
    }
    if (filter.search) {
      q.$or = [
        { razorpayOrderId: { $regex: filter.search, $options: "i" } },
        { customerEmail: { $regex: filter.search, $options: "i" } },
        { customerName: { $regex: filter.search, $options: "i" } },
      ];
    }
    return this.find(q, { sort: { createdAt: -1 } }, pagination) as Promise<PaginatedResult<ITransaction>>;
  }

  async getRevenueStats(dateFrom: Date, dateTo: Date) {
    await connectDB();
    const result = await Transaction.aggregate([
      { $match: { status: "captured", createdAt: { $gte: dateFrom, $lte: dateTo } } },
      { $group: { _id: "$createdAt", total: { $sum: "$amount" } } },
    ]);
    return result;
  }
}
