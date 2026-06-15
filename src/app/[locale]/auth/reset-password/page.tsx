"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import api from "@/lib/client";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/Error";

export default function ResetPasswordPage() {
  const router = useRouter();
  const locale = useLocale();
  const params = useSearchParams();

  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <PageContainer size="sm">
        <p className="text-center text-red-600 mt-10">
          Invalid or missing reset token.
        </p>
      </PageContainer>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/reset-password", {
        token,
        password,
      });

      setDone(true);
      setTimeout(() => router.push(`/${locale}/auth/login`), 1500);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to reset password."
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
          <PageHeader title="Reset Password" />

          {error && <ErrorMessage message={error} />}

          {done ? (
            <p className="text-green-600 text-center">
              Password updated successfully.
            </p>
          ) : (
            <>
              <div>
                <label className="block text-sm mb-1">New Password</label>
                <input
                  type="password"
                  className="border rounded w-full px-3 py-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="success" className="w-full">
                Update Password
              </Button>
            </>
          )}
        </form>
      </div>
    </PageContainer>
  );
}
