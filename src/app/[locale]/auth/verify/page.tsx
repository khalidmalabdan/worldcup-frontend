"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import api from "@/lib/client";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";

export default function VerifyEmailPage() {
  const router = useRouter();
  const locale = useLocale();
  const params = useSearchParams();

  const token = params.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    async function verify() {
      try {
        await api.post("/auth/verify-email", { token });
        setStatus("success");
        setTimeout(() => router.push(`/${locale}/auth/login`), 1500);
      } catch {
        setStatus("error");
      }
    }

    if (token) verify();
    else setStatus("error");
  }, [token]);

  return (
    <PageContainer size="sm">
      <PageHeader title="Verify Email" />

      {status === "loading" && (
        <p className="text-center mt-10">Verifying...</p>
      )}

      {status === "success" && (
        <p className="text-center text-green-600 mt-10">
          Email verified successfully.
        </p>
      )}

      {status === "error" && (
        <p className="text-center text-red-600 mt-10">
          Invalid or expired verification link.
        </p>
      )}
    </PageContainer>
  );
}
