// Central place to send SMS. Swap the "real" implementation for whichever
// Bangladeshi provider you sign up with — the rest of the app never changes.

export async function sendOTP(phone, otp) {
  const mode = process.env.SMS_MODE || "dev";

  if (mode === "dev") {
    // No real SMS sent — just logs it so you can test the flow for free.
    console.log(`\n[DEV MODE] OTP for ${phone} is: ${otp}\n`);
    return { success: true };
  }

  if (mode === "bulksmsbd") {
    const apiKey = process.env.BULKSMSBD_API_KEY;
    const senderId = process.env.BULKSMSBD_SENDER_ID;
    const message = `Your verification code is ${otp}. It expires in 5 minutes.`;

    const url = `http://bulksmsbd.net/api/smsapi?api_key=${apiKey}&type=text&number=${phone}&senderid=${senderId}&message=${encodeURIComponent(
      message
    )}`;

    const res = await fetch(url);
    const data = await res.text();
    console.log("BulkSMSBD response:", data);
    return { success: true };
  }

  if (mode === "alphanet") {
    const apiKey = process.env.ALPHANET_API_KEY;
    const senderId = process.env.ALPHANET_SENDER_ID;

    if (!apiKey) {
      throw new Error("ALPHANET_API_KEY is missing in .env.local");
    }

    // sms.net.bd expects numbers as 880XXXXXXXXXX (no + and no leading 0)
    const formattedPhone = normalizeBangladeshPhone(phone);

    const message = `Your verification code is ${otp}. It expires in 5 minutes.`;

    const body = new URLSearchParams();
    body.append("api_key", apiKey);
    body.append("msg", message);
    body.append("to", formattedPhone);
    if (senderId) body.append("sender_id", senderId);

    console.log(`[SMS] Sending OTP to ${formattedPhone}...`);

    try {
      const res = await fetch("https://api.sms.net.bd/sendsms", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      const text = await res.text();
      console.log(`[SMS] Raw response (status ${res.status}):`, text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`SMS API returned non-JSON response: ${text}`);
      }

      if (data.error !== 0) {
        console.error("[SMS] Failed:", data.msg || data);
        throw new Error(data.msg || "SMS sending failed");
      }

      console.log("[SMS] Sent successfully. Request ID:", data.data?.request_id);
      return { success: true, requestId: data.data?.request_id };
    } catch (err) {
      console.error("[SMS] Network/error:", err.message);
      throw err;
    }
  }

  throw new Error("Unknown SMS_MODE: " + mode);
}

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
} 

export function normalizeBangladeshPhone(phone) {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.startsWith("880")) return digits;
  if (digits.startsWith("0")) return `880${digits.slice(1)}`;
  return `880${digits}`;
}