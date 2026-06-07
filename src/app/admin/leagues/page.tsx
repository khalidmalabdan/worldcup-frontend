"use client";
import { useEffect, useState } from "react";

export default function AdminLeagues() {
  const [leagues, setLeagues] = useState([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(() => {
    fetch("/api/leagues", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setLeagues);
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>All Leagues</h1>

      <ul>
        {leagues.map((l: any) => (
          <li key={l.id}>
            <a href={`/admin/leagues/${l.id}`}>{l.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
