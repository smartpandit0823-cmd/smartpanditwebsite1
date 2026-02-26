// WhatsApp Template Utility for SmartPandit Admin

export function generateWhatsAppLink(phone: string, message: string): string {
    const cleanPhone = phone.replace(/\D/g, "");
    const indianPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
    return `https://wa.me/${indianPhone}?text=${encodeURIComponent(message)}`;
}

export function bookingWhatsAppMessage({
    panditName,
    userName,
    userPhone,
    pujaName,
    packageName,
    date,
    time,
    address,
    amount,
    paymentType,
    amountPaid,
    addressMapUrl,
}: {
    panditName: string;
    userName: string;
    userPhone: string;
    pujaName: string;
    packageName: string;
    date: string;
    time: string;
    address: string;
    amount: number;
    paymentType?: string;
    amountPaid?: number;
    addressMapUrl?: string;
}): string {
    // Calculate remaining amount to collect from user (DON'T reveal advance to pandit)
    const remaining = paymentType === "advance"
        ? amount - (amountPaid || 0)
        : 0;

    const paymentLine = paymentType === "advance"
        ? `\n💳 *Payment Status:* Partial Payment Done\n💰 *आपको लेना है:* ₹${remaining.toLocaleString("en-IN")} (बाकी राशि पूजा के समय लें)`
        : `\n💳 *Payment: FULL PAID ✅*\n💰 आपको कुछ लेना नहीं है`;

    const mapLine = addressMapUrl
        ? `\n📍 *Google Maps:* ${addressMapUrl}`
        : "";

    return `🙏 *SmartPandit - New Puja Booking*

नमस्ते ${panditName} जी,

आपके लिए एक नई पूजा की बुकिंग आई है:

📋 *Booking Details:*
• पूजा: ${pujaName}
• पैकेज: ${packageName}
• तारीख: ${date}
• समय: ${time}
• कुल राशि: ₹${amount.toLocaleString("en-IN")}
${paymentLine}

👤 *Customer:*
• नाम: ${userName}
• फ़ोन: ${userPhone}
• पता: ${address}${mapLine}

कृपया confirm करें कि आप इस पूजा को कर सकते हैं।
Please reply YES to confirm.

— SmartPandit Team 🙏`;
}


export function astrologyWhatsAppMessage({
    astrologerName,
    userName,
    userPhone,
    birthDate,
    birthTime,
    birthPlace,
    sessionType,
    problem,
    preferredDate,
    preferredTime,
    amount,
}: {
    astrologerName: string;
    userName: string;
    userPhone: string;
    birthDate: string;
    birthTime?: string;
    birthPlace: string;
    sessionType: number;
    problem: string;
    preferredDate?: string;
    preferredTime?: string;
    amount: number;
}): string {
    return `🔮 *SmartPandit - Astrology Consultation*

नमस्ते ${astrologerName} जी,

आपके लिए एक नई ज्योतिष परामर्श की बुकिंग आई है:

📋 *Session Details:*
• Duration: ${sessionType} min
• Category: ${problem}
• Amount: ₹${amount.toLocaleString("en-IN")}
${preferredDate ? `• Preferred Date: ${preferredDate}` : ""}
${preferredTime ? `• Preferred Time: ${preferredTime}` : ""}

👤 *Client Details:*
• नाम: ${userName}
• फ़ोन: ${userPhone}
• जन्म तिथि: ${birthDate}  
${birthTime ? `• जन्म समय: ${birthTime}` : ""}
• जन्म स्थान: ${birthPlace}

कृपया confirm करें और call time बताएं।
Please reply with your available time.

— SmartPandit Team 🔮`;
}

export function paymentToPanditWhatsAppMessage(
    panditName: string,
    amount: number,
    pujaName: string,
    utrNumber?: string,
    notes?: string
): string {
    const trk = utrNumber ? `\n🧾 *Transaction ID / UTR:* ${utrNumber}` : "";
    const nts = notes ? `\n📝 *Note:* ${notes}` : "";

    return `🙏 *SmartPandit - Payment Received*

नमस्ते ${panditName} जी,

${pujaName} पूजा के लिए आपकी राशि *₹${amount.toLocaleString("en-IN")}* आपके खाते में भेज दी गई है। ✅${trk}${nts}

कृपया अपना बैंक/UPI अकाउंट चेक करें।

— SmartPandit Team 🙏`;
}
