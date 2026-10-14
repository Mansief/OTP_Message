import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendOTP, generateOTP, normalizeBangladeshPhone } from "@/lib/sms";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, phone: rawPhone, password, confirmPassword } = await req.json();
    const phone = normalizeBangladeshPhone(rawPhone);

    if (!name || !rawPhone || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ phone });
    if (existing && existing.isVerified) {
      return NextResponse.json({ error: "Phone number already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    if (existing && !existing.isVerified) {
      // Unfinished previous attempt — update it
      existing.name = name;
      existing.password = hashedPassword;
      existing.otp = otp;
      existing.otpExpires = otpExpires;
      await existing.save();
    } else {
      await User.create({ name, phone, password: hashedPassword, otp, otpExpires });
    }

    await sendOTP(phone, otp);

    return NextResponse.json({ message: "OTP sent" }, { status: 200 });
  } catch (err) {
    console.error("Register error:", err.message); // shows the real reason in your terminal
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
} 