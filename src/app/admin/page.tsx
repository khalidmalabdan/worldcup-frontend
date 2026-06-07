"use client";
import { useEffect, useState } from "react";

interface ResetLog {
  timestamp: string;
  type: "weekly" | "monthly";
  message: string;
}

export default function AdminDashboard() {
  const [msg, setMsg] = useState("");
  const [logs, setLogs] = useState<ResetLog[]>([]);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  async function call(endpoint: string) {
    const res = await fetch(`/api/admin/${endpoint}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setMsg(data.message);
    loadLogs();
  }

  async function loadLogs() {
    const res = await fetch(`/api/admin/reset-logs`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setLogs(data);
  }

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Dashboard</h1>

      <button onClick={() => call("sync")}>Sync Matches</button>
      <button onClick={() => call("reset-weekly")}>Reset Weekly</button>
      <button onClick={() => call("reset-monthly")}>Reset Monthly</button>

      <p>{msg}</p>

      <h2>Reset Logs</h2>
      <ul>
        {logs.map((log, i) => (
          <li key={i}>
            <strong>{log.type.toUpperCase()}</strong> — {log.message}
            <br />
            <small>{log.timestamp}</small>
          </li>
        ))}
      </ul>

      <a href="/admin/leagues">View All Leagues →</a>
    </div>
  );
}
