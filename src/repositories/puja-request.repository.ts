import { FilterQuery } from "mongoose";
import connectDB from "@/lib/db/mongodb";
import PujaRequest, { IPujaRequest, PujaRequestStatus } from "@/models/PujaRequest";
import { BaseRepository, PaginatedResult, PaginationOptions } from "./base.repository";

export interface PujaRequestListFilter {
  status?: PujaRequestStatus;
  pujaId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export class PujaRequestRepository extends BaseRepository<IPujaRequest> {
  constructor() {
    super(PujaRequest);
  }

  async list(
    filter: PujaRequestListFilter,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<IPujaRequest>> {
    await connectDB();
    const q: FilterQuery<IPujaRequest> = {};

    if (filter.status) q.status = filter.status;
    if (filter.pujaId) q.pujaId = filter.pujaId as unknown as IPujaRequest["pujaId"];
    if (filter.dateFrom || filter.dateTo) {
      q.date = {};
      if (filter.dateFrom) (q.date as Record<string, unknown>).$gte = filter.dateFrom;
      if (filter.dateTo) (q.date as Record<string, unknown>).$lte = filter.dateTo;
    }
    if (filter.search) {
      q.$or = [
        { "userInfo.name": { $regex: filter.search, $options: "i" } },
        { "userInfo.email": { $regex: filter.search, $options: "i" } },
        { "userInfo.phone": { $regex: filter.search, $options: "i" } },
      ];
    }

    return this.find(
      q,
      { sort: { createdAt: -1 }, populate: "pujaId assignedPanditId" },
      pagination
    ) as Promise<PaginatedResult<IPujaRequest>>;
  }

  async getTodayBookings(): Promise<IPujaRequest[]> {
    await connectDB();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return PujaRequest.find({
      date: { $gte: today, $lt: tomorrow },
      status: { $nin: ["cancelled"] },
    })
      .populate("pujaId assignedPanditId")
      .sort({ time: 1 })
      .exec();
  }
}
