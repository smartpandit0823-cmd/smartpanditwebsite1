import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Product from "@/models/Product";
import { notFound } from "next/navigation";
import { ProductForm } from "../ProductForm";

export default async function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  await auth();
  const { id } = await params;
  await connectDB();
  const product = await Product.findById(id).lean() as any;
  if (!product) notFound();

  // Map full database object explicitly providing defaults for missing fields to avoid undefined crashes in ProductForm
  const data = JSON.parse(JSON.stringify({
    ...product,
    _id: product._id.toString(),
    pricing: product.pricing || { sellingPrice: product.sellingPrice || 0, mrp: product.mrp || 0, discount: product.discountPercentage || 0, gst: product.gstPercentage || 0, costPrice: product.costPrice || 0, offerTag: product.offerTag || "" },
    inventory: product.inventory || { stock: product.stockQuantity || 0, sku: product.sku || "", inStock: true, lowStockThreshold: product.lowStockAlert || 5, weight: product.weight || "", codAvailable: product.codAvailable ?? true, returnAllowed: product.returnAllowed ?? false },
    shipping: product.shipping || { deliveryCharge: 0, freeShipping: false, deliveryDays: 7 },
    seo: product.seo || { seoTitle: "", metaDescription: "", keywords: [] },
    visibility: product.visibility || { showInBestSellers: product.featured || false, showInTrending: product.trending || false, showInCombos: false, showInZodiac: false, showInSiddh: false, showInFeaturedRudraksha: false, showInVastu: false, showInPyramids: false, showOnHome: product.showOnHome || false },
    purposeTags: product.purposeTags || [],
    zodiacSigns: product.zodiacSigns || [],
    benefits: product.benefits || [],
    shortTitle: product.shortTitle || "",
    subCategory: product.subCategory || "",
    brand: product.brand || "",
    certificationImage: product.certificationImage || "",
    sizeChart: product.sizeChart || "",
    careInstructions: product.careInstructions || "",
    status: product.status || "draft",
    tags: product.tags || [],
    images: product.images || product.galleryImages || [],
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
