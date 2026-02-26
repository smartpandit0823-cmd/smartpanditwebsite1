import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Product from "@/models/Product";
import { notFound } from "next/navigation";
import { ProductForm } from "../ProductForm";

export default async function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  await auth();
  const { id } = await params;
  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product) notFound();

  const data = JSON.parse(JSON.stringify({
    _id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    fullDescription: product.fullDescription,
    category: product.category,
    brand: product.brand,
    tags: product.tags || [],
    mainImage: product.mainImage,
    images: product.images || [],
    video: product.video,
    pricing: product.pricing || { sellingPrice: 0, mrp: 0, discount: 0, gst: 0 },
    inventory: product.inventory || { stock: 0, sku: "", inStock: true, lowStockThreshold: 5 },
    shipping: product.shipping || { deliveryCharge: 0, freeShipping: false, deliveryDays: 7 },
    seo: product.seo || { seoTitle: "", metaDescription: "", keywords: [] },
    status: product.status,
    featured: product.featured,
    trending: product.trending,
    showOnHome: product.showOnHome,
    spiritualBenefits: product.spiritualBenefits,
    howToUse: product.howToUse,
    authenticityCertificate: product.authenticityCertificate,
    panditRecommended: product.panditRecommended,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-warm-900">Edit Product</h1>
        <p className="mt-1 text-gray-600">Update {product.name}</p>
      </div>
      <ProductForm product={data} />
    </div>
  );
}
