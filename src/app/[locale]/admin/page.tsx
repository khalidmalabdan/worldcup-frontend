"use client";

import { useEffect, useState } from "react";
import api from "@/lib/client";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Loading from "@/components/Loading";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import { useLocale } from "next-intl/client";

interface ResetLog {
  timestamp: string;
  type: "weekly" | "monthly";
  message: string;
}

function normalizeLogs(list: any[]): ResetLog[] {
  return (list ?? []).map((l) => ({
    timestamp: l.timestamp ?? "",
    type: l.type ?? "weekly",
    message: l.message ?? "",
  }));
}

export default function AdminDashboard() {
  const [msg, setMsg] = useState("");
  const [logs, setLogs] = useState<ResetLog[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

  async function loadLogs() {
    try {
      const res = await api.get("/admin/reset-logs");
      setLogs(normalizeLogs(res.data ?? []));
    } catch (err) {
      console.error("Failed to load logs:", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }

  async function call(endpoint: string) {
    try {
      const res = await api.post(`/admin/${endpoint}`);
      setMsg(res.data?.message ?? "Action completed");
      await loadLogs();
    } catch (err) {
      console.error("Admin action failed:", err);
      setMsg("Error performing action");
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  if (loading) return <Loading />;

  return (
    <PageContainer size="md">
      <PageHeader title="Admin Dashboard" />

      <div className="flex gap-4">
        <Button variant="primary" onClick={() => call("sync")}>
          Sync Matches
        </Button>

        <Button variant="success" onClick={() => call("reset-weekly")}>
          Reset Weekly
        </Button>

        <Button variant="warning" onClick={() => call("reset-monthly")}>
          Reset Monthly
        </Button>
      </div>

      {msg && <p className="text-lg font-semibold text-gray-700">{msg}</p>}

      <div>
        <h2 className="text-xl font-bold mb-3">Reset Logs</h2>

        {logs.length === 0 ? (
          <EmptyState message="No logs yet." />
        ) : (
          <ul className="space-y-3">
            {logs.map((log, i) => (
              <li
                key={i}
                className="border p-3 rounded bg-white shadow-sm flex flex-col"
              >
                <span className="font-semibold uppercase">{log.type}</span>
                <span>{log.message}</span>
                <small className="text-gray-500">{log.timestamp}</small>
              </li>
            ))}
          </ul>
        )}
      </div>

      <a
        href={`/${locale}/admin/leagues`}
        className="inline-block mt-4 text-blue-600 hover:underline"
      >
        View All Leagues →
      </a>
    </PageContainer>
  );
}
