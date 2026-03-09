/**
 * Delhivery B2C Shipping Service
 * Complete integration for pincode check, warehouse, order creation, tracking, labels
 */

const DELHIVERY_TOKEN = process.env.DELHIVERY_API_TOKEN || "";
const BASE_URL = process.env.DELHIVERY_BASE_URL || "https://track.delhivery.com";
const PICKUP_LOCATION = process.env.DELHIVERY_PICKUP_LOCATION || "SanatanSetu Warehouse";

function headers() {
    return {
        Authorization: `Token ${DELHIVERY_TOKEN}`,
        "Content-Type": "application/json",
    };
}

// ─── 1. Pincode Serviceability & Expected TAT & Shipping Cost ──────────────────
export async function checkPincode(pincode: string, weightGrams: number = 500) {
    try {
        const res = await fetch(`${BASE_URL}/c/api/pin-codes/json/?filter_codes=${pincode}`, {
            headers: headers(),
        });

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            return { serviceable: true, cod: true, prepaid: true, city: "", state: "", estimatedDays: { min: 3, max: 7 }, _fallback: true, shippingCharge: null };
        }

        const data = await res.json();
        const info = data?.delivery_codes?.[0]?.postal_code;
        if (!info) {
            return { serviceable: false, cod: false, prepaid: false, city: "", state: "", estimatedDays: null, shippingCharge: null };
        }

        // Fetch Expected TAT (Turnaround Time)
        let minDays = 3;
        let maxDays = 5;
        const originPin = process.env.DELHIVERY_ORIGIN_PINCODE || "422001";
        try {
            const tatRes = await fetch(
                `${BASE_URL}/api/dc/expected_tat?origin_pin=${originPin}&destination_pin=${pincode}&mot=S&pdt=B2C`,
                { headers: headers() }
            );
            if (tatRes.ok) {
                const tatData = await tatRes.json();
                if (tatData?.data?.tat) {
                    const days = tatData.data.tat;
                    minDays = Math.max(1, days - 1);
                    maxDays = days + 1;
                } else if (tatData?.tat) {
                    const days = tatData.tat;
                    minDays = Math.max(1, days - 1);
                    maxDays = days + 1;
                } else if (tatData?.data?.[0]?.expected_delivery_date) {
                    const days = tatData.data[0].days || tatData.data[0].expected_delivery_days;
                    if (days) {
                        minDays = Math.max(1, days - 1);
                        maxDays = days + 1;
                    }
                } else if (tatData?.expected_delivery_date) {
                    const days = tatData.days || tatData.tat;
                    if (days) {
                        minDays = Math.max(1, days - 1);
                        maxDays = days + 1;
                    }
                }
            }
        } catch (e) {
            console.error("TAT API failed:", e);
        }

        // Fetch Live Shipping Cost
        let shippingCharge: number | null = null;
        try {
            const costRes = await fetch(
                `${BASE_URL}/api/kinko/v1/invoice/charges/.json?md=S&ss=Delivered&d_pin=${pincode}&o_pin=${originPin}&cgm=${weightGrams}&pt=Pre-paid`,
                { headers: headers() }
            );
            if (costRes.ok) {
                const costData = await costRes.json();
                if (Array.isArray(costData) && costData.length > 0 && costData[0].total_amount) {
                    shippingCharge = costData[0].total_amount;
                } else if (costData?.value && costData.value.length > 0 && costData.value[0].total_amount) {
                    shippingCharge = Math.ceil(costData.value[0].total_amount);
                } else if (costData?.[0]?.charge_DL) {
                    shippingCharge = costData[0].charge_DL;
                }
            }
        } catch (e) {
            console.error("Shipping Cost API failed:", e);
        }

        return {
            serviceable: true,
            cod: info.cod === "Y",
            prepaid: info.pre_paid === "Y",
            pickup: info.pickup === "Y",
            city: info.city || "",
            state: info.state_code || "",
            district: info.district || "",
            estimatedDays: { min: minDays, max: maxDays },
            shippingCharge
        };
    } catch (error) {
        console.error("Delhivery pincode check failed:", error);
        return {
            serviceable: true,
            cod: true,
            prepaid: true,
            city: "",
            state: "",
            estimatedDays: { min: 3, max: 7 },
            _fallback: true,
        };
    }
}


// ─── 2. Create Warehouse / Pickup Location ───────────────────
export async function createWarehouse(warehouseData: {
    name: string;
    address: string;
    city: string;
    pin: string;
    state: string;
    phone: string;
    email?: string;
    registeredName?: string;
}) {
    try {
        const payload = {
            name: warehouseData.name,
            address: warehouseData.address,
            city: warehouseData.city,
            pin: warehouseData.pin,
            country: "India",
            phone: warehouseData.phone,
            email: warehouseData.email || "",
            registered_name: warehouseData.registeredName || warehouseData.name,
            return_address: warehouseData.address,
            return_pin: warehouseData.pin,
            return_city: warehouseData.city,
            return_state: warehouseData.state,
            return_country: "India",
        };

        const res = await fetch(`${BASE_URL}/api/backend/clientwarehouse/create/`, {
            method: "POST",
            headers: headers(),
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
            return { success: false, error: data?.error || `Delhivery error (${res.status})`, data };
        }
        return { success: true, data };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

// ─── 2b. Update Warehouse ────────────────────────────────────
export async function updateWarehouse(warehouseData: {
    name: string;
    address?: string;
    pin?: string;
    phone?: string;
}) {
    try {
        const res = await fetch(`${BASE_URL}/api/backend/clientwarehouse/edit/`, {
            method: "POST",
            headers: headers(),
            body: JSON.stringify(warehouseData),
        });
        const data = await res.json();
        return { success: res.ok, data };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

// ─── 3. Generate Waybill (AWB Number) ───────────────────────
export async function generateWaybill(count: number = 1) {
    try {
        const url = count > 1
            ? `${BASE_URL}/waybill/api/bulk/json/?token=${DELHIVERY_TOKEN}&count=${count}`
            : `${BASE_URL}/waybill/api/fetch/json/?token=${DELHIVERY_TOKEN}`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json"
            },
        });
        const data = await res.json();
        const waybill = count > 1 ? data : data;
        return { success: true, waybills: waybill ? [waybill] : [] };
    } catch (error) {
        return { success: false, waybills: [] };
    }
}

// ─── 4. Create Shipment / Order ─────────────────────────────
export interface DelhiveryShipmentInput {
    orderId: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerCity: string;
    customerState: string;
    customerPincode: string;
    paymentMode: "COD" | "Prepaid";
    codAmount: number;
    totalAmount: number;
    productDesc: string;
    weight: number; // in grams
    quantity: number;
    length?: number; // cm
    breadth?: number; // cm
    height?: number; // cm
    sellerName?: string;
    sellerAddress?: string;
    sellerGstTin?: string;
}

export async function createShipment(input: DelhiveryShipmentInput) {
    try {
        const shipmentData = {
            shipments: [
                {
                    name: input.customerName,
                    add: input.customerAddress,
                    pin: input.customerPincode,
                    city: input.customerCity,
                    state: input.customerState,
                    country: "India",
                    phone: input.customerPhone,
                    order: input.orderId,
                    payment_mode: input.paymentMode,
                    cod_amount: input.paymentMode === "COD" ? input.codAmount : 0,
                    total_amount: input.totalAmount,
                    products_desc: input.productDesc,
                    quantity: input.quantity,
                    weight: input.weight || 10,
                    waybill: "", // let Delhivery auto-generate
                    shipment_length: input.length || 10,
                    shipment_breadth: input.breadth || 10,
                    shipment_height: input.height || 10,
                    seller_name: input.sellerName || "SanatanSetu",
                    seller_add: input.sellerAddress || "Ganesh Nagar, Near Mahaviar Shala, Lasalgaon, Maharashtra 423401",
                    seller_inv: "",
                    seller_cst: input.sellerGstTin || "",
                    return_add: input.sellerAddress || "Ganesh Nagar, Near Mahaviar Shala, Lasalgaon, Maharashtra 423401",
                    return_pin: "423401",
                    return_city: "Lasalgaon",
                    return_state: "Maharashtra",
                    return_country: "India",
                },
            ],
            pickup_location: {
                name: PICKUP_LOCATION,
            },
        };

        const payloadString = `format=json&data=${JSON.stringify(shipmentData)}`;

        const res = await fetch(
            `${BASE_URL}/api/cmu/create.json`,
            {
                method: "POST",
                headers: {
                    Authorization: `Token ${DELHIVERY_TOKEN}`,
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: payloadString,
            }
        );

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            return { success: false, error: `Delhivery returned non-JSON (${res.status}).` };
        }

        const data = await res.json();
        const pkg = data?.packages?.[0];
        if (pkg?.waybill) {
            return {
                success: true,
                waybill: pkg.waybill,
                sortCode: pkg.sort_code || "",
                status: pkg.status || "Success",
                remarks: pkg.remarks || "",
            };
        }

        return { success: false, error: pkg?.remarks || data?.rmk || "Shipment creation failed", data };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

// ─── 5. Get Packing Slip / Shipping Label ──────────────────────
export async function getPackingSlip(waybill: string, pdfSize: string = "A4") {
    try {
        const res = await fetch(
            `${BASE_URL}/api/p/packing_slip?wbns=${waybill}&pdf=true&pdf_size=${pdfSize}`,
            { headers: headers() }
        );

        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const data = await res.json();
            // Delhivery returns an S3 URL in JSON response
            const packages = data?.packages || data;
            if (Array.isArray(packages) && packages.length > 0 && packages[0]?.pdf_download_link) {
                return { success: true, url: packages[0].pdf_download_link };
            }
            return { success: true, url: `${BASE_URL}/api/p/packing_slip?wbns=${waybill}&pdf=true&pdf_size=${pdfSize}`, data };
        }

        // If it returns the PDF directly
        return { success: true, url: `${BASE_URL}/api/p/packing_slip?wbns=${waybill}&pdf=true&pdf_size=${pdfSize}` };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

// ─── 6. Create Pickup Request ─────────────────────────────────
export async function createPickupRequest(
    pickupDate: string,
    expectedPackageCount: number
) {
    try {
        const payload = {
            pickup_location: PICKUP_LOCATION,
            expected_package_count: expectedPackageCount,
            pickup_date: pickupDate,
            pickup_time: "12:00:00",
        };

        console.log("[Delhivery] Pickup request payload:", JSON.stringify(payload));

        const res = await fetch(`${BASE_URL}/fm/request/new/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${DELHIVERY_TOKEN}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(payload),
        });

        const contentType = res.headers.get("content-type") || "";
        let data: any;

        if (contentType.includes("application/json")) {
            data = await res.json();
        } else {
            const text = await res.text();
            data = { rawResponse: text.slice(0, 500) };
        }

        console.log("[Delhivery] Pickup response:", res.status, JSON.stringify(data));

        return { success: res.ok, data, error: res.ok ? undefined : (data?.error || data?.message || `HTTP ${res.status}`) };
    } catch (error) {
        console.error("[Delhivery] Pickup error:", error);
        return { success: false, error: String(error) };
    }
}

// ─── 7. Track Shipment ──────────────────────────────────────
export interface TrackingEvent {
    date: string;
    status: string;
    location: string;
    remarks: string;
    instructions: string;
}

export interface TrackingResult {
    success: boolean;
    waybill: string;
    currentStatus: string;
    estimatedDelivery: string;
    origin: string;
    destination: string;
    scans: TrackingEvent[];
    rawStatus: string;
}

export async function trackShipment(waybill: string): Promise<TrackingResult> {
    try {
        const res = await fetch(
            `${BASE_URL}/api/v1/packages/json/?waybill=${waybill}&verbose=true`,
            { headers: headers() }
        );

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            return {
                success: false, waybill, currentStatus: "Unavailable", estimatedDelivery: "",
                origin: "", destination: "", scans: [], rawStatus: "",
            };
        }

        const data = await res.json();
        const shipment = data?.ShipmentData?.[0]?.Shipment;
        if (!shipment) {
            return {
                success: false, waybill, currentStatus: "Not Found", estimatedDelivery: "",
                origin: "", destination: "", scans: [], rawStatus: "",
            };
        }

        const scans: TrackingEvent[] = (shipment.Scans || []).map((s: any) => ({
            date: s.ScanDetail?.ScanDateTime || "",
            status: s.ScanDetail?.Scan || "",
            location: s.ScanDetail?.ScannedLocation || "",
            remarks: s.ScanDetail?.Instructions || "",
            instructions: s.ScanDetail?.StatusCode || "",
        }));

        return {
            success: true,
            waybill: shipment.AWB || waybill,
            currentStatus: shipment.Status?.Status || "Unknown",
            estimatedDelivery: shipment.ExpectedDeliveryDate || "",
            origin: shipment.Origin || "",
            destination: shipment.Destination || "",
            scans,
            rawStatus: shipment.Status?.StatusCode || "",
        };
    } catch (error) {
        return {
            success: false, waybill, currentStatus: "Error", estimatedDelivery: "",
            origin: "", destination: "", scans: [], rawStatus: "",
        };
    }
}

// ─── 8. Cancel Shipment ──────────────────────────────────────
export async function cancelShipment(waybill: string) {
    try {
        const res = await fetch(`${BASE_URL}/api/p/edit`, {
            method: "POST",
            headers: headers(),
            body: JSON.stringify({
                waybill: waybill,
                cancellation: "true",
            }),
        });
        const data = await res.json();
        return { success: res.ok, data };
    } catch (error) {
        return { success: false, error };
    }
}

// ─── 9. Handle NDR (Non-Delivery Report) ─────────────────────
export async function handleNDR(waybill: string, action: "re-attempt" | "cancel" | "dispose", updatedDetails: any = {}) {
    try {
        const res = await fetch(`${BASE_URL}/api/backend/ordering/shipment/ndrAction/`, {
            method: "POST",
            headers: headers(),
            body: JSON.stringify({
                waybill,
                act: action,
                ...updatedDetails
            }),
        });
        const data = await res.json();
        return { success: res.ok, data };
    } catch (error) {
        return { success: false, error };
    }
}

// ─── Helper: Map Delhivery status to our Order status ────────
export function mapDelhiveryStatusToOrderStatus(delhiveryStatus: string): string {
    const statusMap: Record<string, string> = {
        "Manifested": "processing",
        "In Transit": "shipped",
        "Out For Delivery": "shipped",
        "Delivered": "delivered",
        "Pending": "processing",
        "RTO": "cancelled",
        "Returned": "cancelled",
        "Cancelled": "cancelled",
    };
    return statusMap[delhiveryStatus] || "processing";
}
