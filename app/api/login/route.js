import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, phone, password } = await req.json();
    await connectDB();

    const user = await User.findOne({ phone, name });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }
    if (!user.isVerified) {
      return NextResponse.json({ error: "Phone not verified yet" }, { status: 400 });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return NextResponse.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}