import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createRazorpayOrder(
  amount: number,
  currency: string,
  receipt: string,
  notes?: Record<string, string>
) {
  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency,
    receipt,
    notes,
  });
  return { orderId: order.id, amount: order.amount };
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = orderId + "|" + paymentId;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");
  return expected === signature;
}

export async function initiateRefund(
  paymentId: string,
  amount?: number,
  notes?: Record<string, string>
) {
  const refundData: { payment_id: string; amount?: number; notes?: Record<string, string> } = {
    payment_id: paymentId,
    notes,
  };
  if (amount && amount > 0) {
    refundData.amount = amount * 100;
  }
  return razorpay.payments.refund(paymentId, refundData);
}

export async function fetchPayment(paymentId: string) {
  return razorpay.payments.fetch(paymentId);
}

export async function fetchOrder(orderId: string) {
  return razorpay.orders.fetch(orderId);
}
