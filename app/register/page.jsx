"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OtpModal from "@/components/OtpModla";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setShowOtp(true); // registration data saved, now verify phone
  };

  return (
    <div style={{ maxWidth: 360, margin: "60px auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required style={inputStyle} />
        <input name="phone" placeholder="Phone number (01XXXXXXXXX)" onChange={handleChange} required style={inputStyle} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={inputStyle} />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required style={inputStyle} />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={buttonStyle}>Done</button>
      </form>

      {showOtp && (
        <OtpModal
          phone={form.phone}
          onSuccess={() => router.push("/login")}
          onClose={() => setShowOtp(false)}
        />
      )}
    </div>
  );
}

const inputStyle = { width: "100%", padding: 10, margin: "6px 0", fontSize: 16 };
const buttonStyle = { width: "100%", padding: 10, marginTop: 10, background: "#111", color: "#fff", border: "none", borderRadius: 6 };