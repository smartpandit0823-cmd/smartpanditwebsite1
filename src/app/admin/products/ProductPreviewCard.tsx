"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductPreviewCardProps {
    name: string;
    category: string;
    image: string;
    shortDescription: string;
    sellingPrice: number;
    mrp?: number;
    discount?: number;
    featured: boolean;
}

export function ProductPreviewCard({
    name,
    category,
    image,
    shortDescription,
    sellingPrice,
    mrp,
    discount,
    featured,
}: ProductPreviewCardProps) {
    return (
        <Card className="w-full max-w-sm overflow-hidden">
            <div className="relative aspect-square w-full bg-gray-100">
                {image ? (
                    <img src={image} alt={name} className="object-cover w-full h-full" />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                        No Image
                    </div>
                )}
                {featured && (
                    <Badge className="absolute top-2 left-2 bg-saffron-600">Featured</Badge>
                )}
                {discount && discount > 0 && (
                    <Badge className="absolute top-2 right-2 bg-green-600">{discount}% OFF</Badge>
                )}
            </div>
            <CardContent className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{category}</p>
                <h3 className="font-medium text-lg mb-1 truncate">{name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3 h-10">{shortDescription}</p>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">₹{sellingPrice.toLocaleString("en-IN")}</span>
                    {mrp && mrp > sellingPrice && (
                        <span className="text-sm text-gray-400 line-through">₹{mrp.toLocaleString("en-IN")}</span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
