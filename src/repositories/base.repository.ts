import { Document, FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose";

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async find(
    filter: FilterQuery<T> = {},
    options?: QueryOptions,
    pagination?: PaginationOptions
  ): Promise<T[] | PaginatedResult<T>> {
    let query = this.model.find(filter);

    if (options?.sort) {
      query = query.sort(options.sort);
    }
    if (options?.select) {
      query = query.select(options.select);
    }
    if (options?.populate) {
      query = query.populate(options.populate as string | string[]);
    }

    if (pagination) {
      const page = Math.max(1, pagination.page ?? 1);
      const limit = Math.min(50, Math.max(1, pagination.limit ?? 20));
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        query.clone().skip(skip).limit(limit).lean().exec(),
        this.model.countDocuments(filter),
      ]);

      return {
        data: data as T[],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      };
    }

    return query.exec() as Promise<T[]>;
  }

  async create(data: Partial<T>): Promise<T> {
    const doc = await this.model.create(data);
    return doc as T;
  }

  async updateById(id: string, update: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}
