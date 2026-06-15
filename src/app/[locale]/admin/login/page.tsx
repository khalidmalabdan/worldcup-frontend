"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function AdminLogin() {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const locale = useLocale();

  async function login() {
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Login failed");
      return;
    }

    // Store access token only (refresh token is HttpOnly cookie)
    localStorage.setItem("adminAccess", data.accessToken);

    router.push(`/${locale}/admin`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">Admin Login</h1>

        <div className="space-y-4">
          <input
            placeholder="Username"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            onChange={(e) => setUser(e.target.value)}
          />

          <input
            placeholder="Password"
            type="password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            onChange={(e) => setPass(e.target.value)}
          />

          <button
            onClick={login}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Login
          </button>

          {error && (
            <p className="text-red-600 text-center font-medium">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
