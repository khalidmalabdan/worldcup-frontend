"use client";

import { useState } from "react";
import api, { setAuthToken } from "@/lib/client";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/Error";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.token;

      localStorage.setItem("token", token);
      setAuthToken(token);

      router.push("/matches");
    } catch (err) {
      setError("Invalid email or password");
    }
  }

  return (
    <PageContainer size="sm">
      <div className="flex items-center justify-center min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow-md w-full max-w-sm"
        >
          <PageHeader title="Login" />

          {error && <ErrorMessage message={error} />}

          <label className="block mb-4">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              className="mt-1 w-full border rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="block mb-6">
            <span className="text-gray-700">Password</span>
            <input
              type="password"
              className="mt-1 w-full border rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <Button type="submit" variant="primary" className="w-full">
            Login
          </Button>

          <p className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </PageContainer>
  );
}
