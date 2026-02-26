export const BOOKING_STATUS = [
  "requested",
  "paid",
  "assigned",
  "inprogress",
  "completed",
  "submitted",
  "cancelled",
] as const;

export const ORDER_STATUS = ["created", "paid", "processing", "shipped", "delivered", "cancelled"] as const;

export const ASTRO_STATUS = [
  "requested",
  "paid",
  "assigned",
  "confirmed",
  "completed",
  "cancelled",
] as const;

export const PAYMENT_STATUS = ["pending", "paid", "partial", "refunded", "failed"] as const;

export const ENTITY_TYPE = ["booking", "order", "astro"] as const;
