import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils/index";
import { OrderStatusForm } from "./OrderStatusForm";

export default async function OrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await auth();
    const { id } = await params;
    await connectDB();

    const order = await Order.findById(id).populate("userId", "phone name").lean();
    if (!order) notFound();

    const o = JSON.parse(JSON.stringify(order));

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="font-heading text-3xl font-bold text-warm-900">Order Detail</h1>
                <p className="mt-1 text-gray-600">Order ID: {o._id}</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Order Info</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Status</span>
                            <Badge>{o.status}</Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Payment</span>
                            <Badge variant={o.paymentStatus === "paid" ? "success" : "secondary"}>{o.paymentStatus}</Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total</span>
                            <span className="font-bold text-lg">{formatCurrency(o.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Date</span>
                            <span>{formatDate(o.createdAt)}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        <p className="font-medium">{o.shippingAddress?.name}</p>
                        <p className="text-sm text-gray-600">{o.shippingAddress?.phone}</p>
                        <p className="text-sm">{o.shippingAddress?.address}</p>
                        <p className="text-sm">
                            {o.shippingAddress?.city}, {o.shippingAddress?.state} - {o.shippingAddress?.pincode}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Items</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {o.items.map((item: { name: string; quantity: number; price: number; image?: string }, i: number) => (
                            <div key={i} className="flex items-center justify-between rounded-lg border border-gold-100 p-3">
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <OrderStatusForm orderId={o._id} currentStatus={o.status} />
        </div>
    );
}
