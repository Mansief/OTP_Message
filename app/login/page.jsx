"use client";
import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setMessage(res.ok ? "Login successful!" : data.error);
  };

  return (
    <div style={{ maxWidth: 360, margin: "60px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required style={inputStyle} />
        <input name="phone" placeholder="Phone number" onChange={handleChange} required style={inputStyle} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={inputStyle} />
        <button type="submit" style={buttonStyle}>Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

const inputStyle = { width: "100%", padding: 10, margin: "6px 0", fontSize: 16 };
const buttonStyle = { width: "100%", padding: 10, marginTop: 10, background: "#111", color: "#fff", border: "none", borderRadius: 6 };