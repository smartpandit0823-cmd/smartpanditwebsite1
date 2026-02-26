import { FilterQuery } from "mongoose";
import connectDB from "@/lib/db/mongodb";
import FestivalCalendar, { IFestivalCalendar } from "@/models/FestivalCalendar";
import { BaseRepository, PaginatedResult, PaginationOptions } from "./base.repository";

export interface FestivalListFilter {
  type?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export class FestivalRepository extends BaseRepository<IFestivalCalendar> {
  constructor() {
    super(FestivalCalendar);
  }

  async list(
    filter: FestivalListFilter,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<IFestivalCalendar>> {
    await connectDB();
    const q: FilterQuery<IFestivalCalendar> = {};
    if (filter.type) q.type = filter.type as IFestivalCalendar["type"];
    if (filter.dateFrom || filter.dateTo) {
      q.date = {};
      if (filter.dateFrom) (q.date as Record<string, unknown>).$gte = filter.dateFrom;
      if (filter.dateTo) (q.date as Record<string, unknown>).$lte = filter.dateTo;
    }
    return this.find(q, { sort: { date: 1 } }, pagination) as Promise<PaginatedResult<IFestivalCalendar>>;
  }
}
