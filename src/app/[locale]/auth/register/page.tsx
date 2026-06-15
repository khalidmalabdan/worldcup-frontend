"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import api from "@/lib/client";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/Error";

export default function RegisterPage() {
  const router = useRouter();
  const locale = useLocale();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      // Backend returns accessToken or token depending on version
      const token =
        res.data?.accessToken ||
        res.data?.token ||
        res.data?.jwt ||
        null;

      if (token) {
        localStorage.setItem("token", token);
      }

      // Redirect to localized login page
      router.push(`/${locale}/auth/login`);
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Registration failed. Please try again."
      );
    }
  }

  return (
    <PageContainer size="sm">
      <div className="min-h-screen flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white border rounded p-6 shadow space-y-4"
        >
          <PageHeader title="Create Account" />

          {error && <ErrorMessage message={error} />}

          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              className="border rounded w-full px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="border rounded w-full px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="border rounded w-full px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" variant="success" className="w-full">
            Create Account
          </Button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <a
              href={`/${locale}/auth/login`}
              className="text-blue-600 underline"
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </PageContainer>
  );
}
