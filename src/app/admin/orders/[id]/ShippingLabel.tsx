"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface LabelItem {
    name: string;
    price: number;
    quantity: number;
}

interface LabelData {
    orderId: string;
    waybill?: string;
    paymentStatus: string;
    shippingAddress: {
        name: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
    };
    items: LabelItem[];
    totalAmount: number;
    shippingFee: number;
    createdAt: string;
}

const SELLER = {
    name: "SanatanSetu",
    address: "Ganesh Nagar, Near Mahavir Shala",
    city: "Lasalgaon",
    state: "Maharashtra",
    pincode: "422306",
    phone: "+91 84211 16801",
};

function formatCurrency(v: number) {
    return `₹${v.toLocaleString("en-IN")}`;
}

export function ShippingLabel({ order }: { order: LabelData }) {
    const ref = useRef<HTMLDivElement>(null);

    function handlePrint() {
        if (!ref.current) return;
        const printWindow = window.open("", "_blank", "width=420,height=630");
        if (!printWindow) return;

        printWindow.document.write(`
            <html><head><title>Shipping Label - ${order.orderId.slice(-8).toUpperCase()}</title>
            <style>
                @page { size: 4in 6in; margin: 0; }
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Arial', 'Helvetica', sans-serif; width: 4in; min-height: 6in; padding: 8px; color: #000; background: #fff; -webkit-print-color-adjust: exact; }
                .label { border: 2px solid #000; width: 100%; min-height: calc(6in - 16px); }
                .header { background: #000; color: #fff; padding: 6px 10px; display: flex; justify-content: space-between; align-items: center; }
                .header h1 { font-size: 14px; letter-spacing: 1px; }
                .header span { font-size: 9px; }
                .section { padding: 6px 10px; border-bottom: 1px dashed #999; }
                .section:last-child { border-bottom: none; }
                .section-title { font-size: 8px; text-transform: uppercase; letter-spacing: 1.5px; color: #555; font-weight: bold; margin-bottom: 4px; }
                .section p { font-size: 10px; line-height: 1.4; }
                .bold { font-weight: bold; }
                .big { font-size: 12px; font-weight: bold; }
                .grid { display: flex; gap: 0; }
                .grid > div { flex: 1; padding: 6px 10px; border-bottom: 1px dashed #999; }
                .grid > div:first-child { border-right: 1px dashed #999; }
                .badge { display: inline-block; padding: 2px 8px; border: 1px solid #000; font-size: 9px; font-weight: bold; letter-spacing: 0.5px; }
                .badge-prepaid { background: #000; color: #fff; }
                .badge-cod { background: #fff; color: #000; }
                .product-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3px; }
                .product-row .name { flex: 1; font-size: 10px; }
                .product-row .qty { width: 50px; text-align: center; font-size: 10px; }
                .product-row .price { width: 60px; text-align: right; font-size: 10px; font-weight: bold; }
                .product-header { font-size: 8px; color: #555; text-transform: uppercase; letter-spacing: 0.5px; font-weight: bold; margin-bottom: 4px; }
                .total-row { display: flex; justify-content: space-between; padding-top: 4px; border-top: 1px solid #ccc; margin-top: 4px; }
                .barcode { text-align: center; padding: 8px 10px; border-bottom: 1px dashed #999; }
                .barcode-text { font-family: 'Courier New', monospace; font-size: 14px; letter-spacing: 3px; font-weight: bold; }
                .barcode-bars { display: flex; justify-content: center; gap: 1px; margin-bottom: 4px; height: 36px; align-items: flex-end; }
                .barcode-bars span { display: inline-block; background: #000; }
                .footer { text-align: center; padding: 4px 10px; font-size: 7px; color: #777; }
            </style>
            </head><body>
            ${ref.current.innerHTML}
            <script>window.onload=function(){window.print();}<\/script>
            </body></html>
        `);
        printWindow.document.close();
    }

    const isPrepaid = order.paymentStatus === "paid";
    const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
    const shortId = order.orderId.slice(-8).toUpperCase();
    const subtotal = order.totalAmount - (order.shippingFee || 0);

    return (
        <>
            <Button
                onClick={handlePrint}
                variant="outline"
                className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-100 h-10"
            >
                <span className="flex items-center gap-2">
                    <Printer className="h-4 w-4" /> Print Shipping Label
                </span>
            </Button>

            <div className="hidden">
                <div ref={ref}>
                    <div className="label">
                        {/* Header */}
                        <div className="header">
                            <h1>SANATANSETU</h1>
                            <span>ORDER #{shortId}</span>
                        </div>

                        {/* Barcode area */}
                        <div className="barcode">
                            <div className="barcode-bars">
                                {shortId.split("").map((ch, i) => {
                                    const w = ((ch.charCodeAt(0) % 3) + 1);
                                    const h = 28 + (ch.charCodeAt(0) % 8);
                                    return <span key={i} style={{ width: `${w}px`, height: `${h}px` }} />;
                                })}
                                {shortId.split("").reverse().map((ch, i) => {
                                    const w = ((ch.charCodeAt(0) % 3) + 1);
                                    const h = 28 + (ch.charCodeAt(0) % 8);
                                    return <span key={`r${i}`} style={{ width: `${w}px`, height: `${h}px` }} />;
                                })}
                            </div>
                            <div className="barcode-text">{order.waybill || shortId}</div>
                        </div>

                        {/* Ship To + Payment */}
                        <div className="grid">
                            <div>
                                <div className="section-title">Ship To</div>
                                <p className="big">{order.shippingAddress.name}</p>
                                <p>📞 {order.shippingAddress.phone}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p className="bold">{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
                            </div>
                            <div>
                                <div className="section-title">Payment</div>
                                <p>
                                    <span className={`badge ${isPrepaid ? "badge-prepaid" : "badge-cod"}`}>
                                        {isPrepaid ? "PREPAID" : "COD"}
                                    </span>
                                </p>
                                <p style={{ marginTop: "6px" }}><span className="section-title">Order Date</span></p>
                                <p className="bold">{orderDate}</p>
                                {order.waybill && (
                                    <>
                                        <p style={{ marginTop: "4px" }}><span className="section-title">AWB No.</span></p>
                                        <p className="bold">{order.waybill}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Products */}
                        <div className="section">
                            <div className="section-title">Products</div>
                            <div className="product-header" style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ flex: 1 }}>Item</span>
                                <span style={{ width: "50px", textAlign: "center" }}>Qty</span>
                                <span style={{ width: "60px", textAlign: "right" }}>Price</span>
                            </div>
                            {order.items.map((item, i) => (
                                <div className="product-row" key={i}>
                                    <span className="name">{item.name}</span>
                                    <span className="qty">×{item.quantity}</span>
                                    <span className="price">{formatCurrency(item.price * item.quantity)}</span>
                                </div>
                            ))}
                            {(order.shippingFee || 0) > 0 && (
                                <div className="product-row" style={{ color: "#666" }}>
                                    <span className="name">Shipping</span>
                                    <span className="qty"></span>
                                    <span className="price">{formatCurrency(order.shippingFee)}</span>
                                </div>
                            )}
                            <div className="total-row">
                                <span className="bold" style={{ fontSize: "11px" }}>TOTAL</span>
                                <span className="bold" style={{ fontSize: "11px" }}>{formatCurrency(order.totalAmount)}</span>
                            </div>
                        </div>

                        {/* Seller */}
                        <div className="section">
                            <div className="section-title">Seller / Return Address</div>
                            <p className="bold">{SELLER.name}</p>
                            <p>{SELLER.address}</p>
                            <p className="bold">{SELLER.city}, {SELLER.state} – {SELLER.pincode}</p>
                            <p>📞 {SELLER.phone}</p>
                        </div>

                        {/* Footer */}
                        <div className="footer">
                            This is a computer-generated label. Thank you for shopping with SanatanSetu.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
