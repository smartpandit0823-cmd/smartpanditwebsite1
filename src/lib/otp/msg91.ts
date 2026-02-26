const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY!;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;
const MSG91_OTP_EXPIRE_MIN = parseInt(process.env.MSG91_OTP_EXPIRE_MIN || "5", 10);

function normalizePhone(phone: string): string {
  const clean = phone.replace(/\D/g, "").slice(-10);
  return clean.length === 10 ? `91${clean}` : phone.replace(/\D/g, "");
}

export async function sendOtpViaMsg91(phone: string, otp: string): Promise<boolean> {
  if (!MSG91_AUTH_KEY) {
    console.warn("MSG91_AUTH_KEY not set, skipping OTP send");
    return false;
  }

  const mobile = normalizePhone(phone);
  const params = new URLSearchParams({
    authkey: MSG91_AUTH_KEY,
    mobile,
    otp,
    otp_expiry: String(MSG91_OTP_EXPIRE_MIN),
  });
  if (MSG91_TEMPLATE_ID) params.set("template_id", MSG91_TEMPLATE_ID);

  try {
    const res = await fetch(`https://api.msg91.com/api/sendotp.php?${params}`);
    const data = await res.json();
    return data?.type === "success";
  } catch (e) {
    console.error("MSG91 OTP send error:", e);
    return false;
  }
}

export async function sendOtpFallback(phone: string, otp: string): Promise<boolean> {
  console.log(`[DEV] OTP for ${phone}: ${otp}`);
  return true;
}

export function getOtpExpiryMinutes(): number {
  return MSG91_OTP_EXPIRE_MIN;
}
