import connectDB from "@/lib/db/mongodb";
import Product from "@/models/Product";
import Review from "@/models/Review";
import { ProductDetailClient } from "./ProductDetailClient";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const product = await Product.findOne({ slug }).lean();

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | SanatanSetu`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const productDoc = await Product.findOne({ slug }).lean() as any;

  if (!productDoc) {
    notFound();
  }

  const sellingPrice = productDoc.pricing?.sellingPrice || productDoc.sellingPrice || 0;
  const mrp = productDoc.pricing?.mrp || productDoc.mrp || 0;

  // Transform to plain object to pass to client component
  const product = {
    id: productDoc._id.toString(),
    slug: productDoc.slug,
    name: productDoc.name,
    category: productDoc.category,
    images: productDoc.images?.length
      ? productDoc.images
      : productDoc.galleryImages?.length
        ? productDoc.galleryImages
        : productDoc.mainImage
          ? [productDoc.mainImage]
          : ["https://images.unsplash.com/photo-1601314167099-24b553556066?w=400"],
    price: sellingPrice,
    originalPrice: mrp > sellingPrice ? mrp : undefined,
    discount: productDoc.pricing?.discount || productDoc.discountPercentage || 0,
    rating: productDoc.averageRating || 4.8,
    reviewCount: productDoc.totalReviews || productDoc.totalSold || 0,
    benefits: productDoc.benefits?.length
      ? productDoc.benefits
      : productDoc.spiritualBenefits
        ? [productDoc.spiritualBenefits]
        : [
          "Protects from negative energy",
          "Brings peace and clarity",
          "Removes Vastu dosha",
        ],
    description:
      productDoc.fullDescription ||
      productDoc.shortDescription ||
      "Authentic spiritual item.",
    shortDescription: productDoc.shortDescription,
    howToUse: productDoc.howToUse || "",
    careInstructions: productDoc.careInstructions || "",
    inStock: productDoc.inventory?.inStock ?? true,
    isAuthentic: Boolean(productDoc.authenticityCertificate),
    soldCount: productDoc.totalSold || 0,
    variants: ["Standard"],
    shipping: {
      freeShipping: productDoc.shipping?.freeShipping ?? false,
      deliveryCharge: productDoc.shipping?.deliveryCharge ?? productDoc.shipping?.shippingCharge ?? 40,
      freeShippingAboveAmount: productDoc.shipping?.freeShippingAboveAmount ?? 499,
    }
  };

  // Fetch related products
  let relatedDocs = await Product.find({
    category: product.category,
    _id: { $ne: productDoc._id },
    status: "published",
  })
    .limit(6)
    .lean();

  if (!relatedDocs || relatedDocs.length === 0) {
    relatedDocs = await Product.find({
      _id: { $ne: productDoc._id },
      status: "published",
    })
      .limit(6)
      .lean();
  }

  const relatedProducts = relatedDocs.map((p: any) => ({
    id: p._id.toString(),
    slug: p.slug,
    name: p.name,
    image:
      p.images?.[0] ||
      p.mainImage ||
      "https://images.unsplash.com/photo-1601314167099-24b553556066?w=400",
    rating: p.averageRating || 4.7,
    reviewCount: p.totalReviews || p.totalSold || 0,
    sellingPrice: p.pricing?.sellingPrice || p.sellingPrice || 0,
    mrp: p.pricing?.mrp || p.mrp,
    discount: p.pricing?.discount || p.discountPercentage || 0,
    inStock: p.inventory?.inStock ?? true,
  }));

  // Fetch Reviews
  const rawReviews = await Review.find({ targetId: productDoc._id, status: "approved" })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const reviews = rawReviews.map((r: any) => ({
    id: r._id.toString(),
    customerName: r.customerName,
    rating: r.rating,
    comment: r.comment,
    date: r.createdAt.toISOString(),
    isVerifiedPurchase: !!r.isVerifiedPurchase,
  }));

  return (
    <ProductDetailClient
      product={product as any}
      relatedProducts={relatedProducts as any}
      reviews={reviews}
    />
  );
}
