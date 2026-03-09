"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db/mongodb";
import Coupon from "@/models/Coupon";
import { auth } from "@/auth";

export async function createCoupon(formData: FormData) {
    try {
        const session = await auth();
        if (session?.user?.role !== "admin") return { error: "Unauthorized" };

        await connectDB();

        const data: Record<string, any> = Object.fromEntries(formData.entries());

        // Convert string data back to appropriate types
        const parseNumber = (val: any, def = 0) => (val ? Number(val) : def);
        const parseBoolean = (val: any) => val === "true" || val === true;

        const couponData: any = {
            code: data.code?.toString().toUpperCase().trim(),
            name: data.name,
            description: data.description,
            type: data.type,
            discountValue: parseNumber(data.discountValue),
            maxDiscountAmount: data.maxDiscountAmount ? parseNumber(data.maxDiscountAmount) : undefined,
            minOrderAmount: parseNumber(data.minOrderAmount),
            maxOrderAmount: data.maxOrderAmount ? parseNumber(data.maxOrderAmount) : undefined,
            applicableOn: data.applicableOn || "all",

            startedAt: data.startsAt ? new Date(data.startsAt as string) : new Date(),
            expiresAt: new Date(data.expiresAt as string),
            autoExpire: parseBoolean(data.autoExpire),

            applyFor: data.applyFor || "all",
            perUserLimit: parseNumber(data.perUserLimit, 1),
            usageLimit: parseNumber(data.usageLimit, 100),
            showLeftCount: parseBoolean(data.showLeftCount),

            autoApply: parseBoolean(data.autoApply),
            showBanner: parseBoolean(data.showBanner),
            showOnHome: parseBoolean(data.showOnHome),
            marketingTag: data.marketingTag === "none" ? undefined : data.marketingTag,

            status: data.status || "active",
        };

        // Arrays (split by comma if passed from form inputs)
        const splitArray = (val: any) => (val && typeof val === "string" ? val.split(",").map(id => id.trim()).filter(Boolean) : []);

        // In a real form, we might send them differently, assuming comma separated for now
        couponData.includedProducts = splitArray(data.includedProducts);
        couponData.includedCategories = splitArray(data.includedCategories);
        couponData.excludedProducts = splitArray(data.excludedProducts);
        couponData.specificUsers = splitArray(data.specificUsers);

        // Basic validation
        if (!couponData.code) return { error: "Code is required" };
        if (!couponData.discountValue && data.type !== "free_shipping") return { error: "Discount value is required" };

        const existingCoupon = await Coupon.findOne({ code: couponData.code });
        if (existingCoupon) return { error: "Coupon code already exists" };

        await Coupon.create(couponData);

        revalidatePath("/admin/coupons");
        return { success: true };
    } catch (error: any) {
        console.error("Create coupon error:", error);
        return { error: error.message || "Failed to create coupon" };
    }
}

export async function updateCoupon(id: string, formData: FormData) {
    try {
        const session = await auth();
        if (session?.user?.role !== "admin") return { error: "Unauthorized" };

        await connectDB();

        const data: Record<string, any> = Object.fromEntries(formData.entries());

        const parseNumber = (val: any, def = 0) => (val ? Number(val) : def);
        const parseBoolean = (val: any) => val === "true" || val === true;

        const couponData: any = {
            name: data.name,
            description: data.description,
            status: data.status,
            autoApply: parseBoolean(data.autoApply),
            showBanner: parseBoolean(data.showBanner),
            showOnHome: parseBoolean(data.showOnHome),
        };

        if (data.expiresAt) couponData.expiresAt = new Date(data.expiresAt as string);

        await Coupon.findByIdAndUpdate(id, couponData, { new: true });

        revalidatePath("/admin/coupons");
        return { success: true };
    } catch (error: any) {
        console.error("Update coupon error:", error);
        return { error: error.message || "Failed to update coupon" };
    }
}

export async function deleteCoupon(id: string) {
    try {
        const session = await auth();
        if (session?.user?.role !== "admin") return { error: "Unauthorized" };

        await connectDB();
        await Coupon.findByIdAndDelete(id);

        revalidatePath("/admin/coupons");
        return { success: true };
    } catch (error: any) {
        console.error("Delete coupon error:", error);
        return { error: error.message || "Failed to delete coupon" };
    }
}

export async function getCoupons() {
    try {
        const session = await auth();
        if (session?.user?.role !== "admin") return { error: "Unauthorized" };

        await connectDB();

        // Self-update expired coupons
        await Coupon.updateMany(
            { expiresAt: { $lt: new Date() }, status: "active", autoExpire: true },
            { status: "expired" }
        );

        const coupons = await Coupon.find().sort({ createdAt: -1 });

        return { success: true, coupons: JSON.parse(JSON.stringify(coupons)) };
    } catch (error: any) {
        return { error: error.message || "Failed to fetch coupons" };
    }
}

export async function getCoupon(id: string) {
    try {
        const session = await auth();
        if (session?.user?.role !== "admin") return { error: "Unauthorized" };

        await connectDB();
        const coupon = await Coupon.findById(id);
        if (!coupon) return { error: "Coupon not found" };

        return { success: true, coupon: JSON.parse(JSON.stringify(coupon)) };
    } catch (error: any) {
        return { error: error.message || "Failed to fetch coupon" };
    }
}
