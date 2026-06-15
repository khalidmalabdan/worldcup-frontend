"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import api from "@/lib/client";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/Error";

export default function ForgotPasswordPage() {
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to send reset email."
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
          <PageHeader title="Forgot Password" />

          {error && <ErrorMessage message={error} />}

          {sent ? (
            <p className="text-green-600 text-center">
              A reset link has been sent to your email.
            </p>
          ) : (
            <>
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

              <Button type="submit" variant="primary" className="w-full">
                Send Reset Link
              </Button>
            </>
          )}

          <p className="text-sm text-center">
            Back to{" "}
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
