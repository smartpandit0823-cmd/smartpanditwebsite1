import type { QueryFilter } from "mongoose";
import connectDB from "@/lib/db/mongodb";
import Product, { IProduct } from "@/models/Product";
import { BaseRepository, PaginatedResult, PaginationOptions } from "./base.repository";

type ProductStatus = IProduct["status"];

export interface ProductListFilter {
  search?: string;
  status?: ProductStatus;
  category?: string;
  lowStock?: boolean;
}

export class ProductRepository extends BaseRepository<IProduct> {
  constructor() {
    super(Product);
  }

  async list(
    filter: ProductListFilter,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<IProduct>> {
    await connectDB();
    const q: QueryFilter<IProduct> = {};

    if (filter.status) q.status = filter.status;
    if (filter.category) q.category = filter.category;
    if (filter.lowStock) {
      q.$expr = { $lte: ["$inventory.stock", "$inventory.lowStockThreshold"] };
    }
    if (filter.search) {
      q.$or = [
        { name: { $regex: filter.search, $options: "i" } },
        { slug: { $regex: filter.search, $options: "i" } },
        { "inventory.sku": { $regex: filter.search, $options: "i" } },
      ];
    }

    return this.find(q, { sort: { createdAt: -1 } }, pagination) as Promise<PaginatedResult<IProduct>>;
  }

  async softDelete(id: string): Promise<IProduct | null> {
    return this.updateById(id, {
      status: "deleted",
      deletedAt: new Date(),
    } as unknown as Partial<IProduct>);
  }

  async getLowStock(): Promise<IProduct[]> {
    await connectDB();
    return Product.find({
      status: { $ne: "deleted" },
      $expr: { $lte: ["$inventory.stock", "$inventory.lowStockThreshold"] },
    })
      .sort({ "inventory.stock": 1 })
      .limit(10)
      .exec();
  }
}
