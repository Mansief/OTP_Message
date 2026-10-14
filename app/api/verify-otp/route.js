import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { normalizeBangladeshPhone } from "@/lib/sms";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { phone: rawPhone, otp } = await req.json();
    const phone = normalizeBangladeshPhone(rawPhone);
    await connectDB();

    const user = await User.findOne({ phone });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (user.isVerified) {
      return NextResponse.json({ error: "Already verified" }, { status: 400 });
    }
    if (user.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }
    if (user.otpExpires < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return NextResponse.json({ message: "Phone verified, registration complete" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}