"use client";
import { useState } from "react";

export default function OtpModal({ phone, onSuccess, onClose }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    onSuccess();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.box}>
        <h3>Enter OTP</h3>
        <p>We sent a code to {phone}</p>
        <input
          style={styles.input}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="6-digit code"
          maxLength={6}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button style={styles.button} onClick={handleVerify} disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
        <button style={styles.cancel} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" },
  box: { background: "#fff", padding: 24, borderRadius: 8, width: 300, textAlign: "center" },
  input: { width: "100%", padding: 8, margin: "12px 0", fontSize: 18, textAlign: "center" },
  button: { width: "100%", padding: 10, background: "#111", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
  cancel: { marginTop: 8, background: "none", border: "none", color: "#666", cursor: "pointer" },
};