"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("GLOBAL ERROR CAUGHT BY error.tsx:", error);

  return (
    <html>
      <body style={{ padding: 20, fontFamily: "system-ui" }}>
        <h1>Global Error</h1>
        <p><strong>Message:</strong></p>
        <pre style={{ whiteSpace: "pre-wrap" }}>{String(error.message)}</pre>

        <p><strong>Stack:</strong></p>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {error.stack ?? "No stack available"}
        </pre>

        {error.digest && (
          <>
            <p><strong>Digest:</strong></p>
            <pre>{error.digest}</pre>
          </>
        )}

        <button
          onClick={() => reset()}
          style={{
            marginTop: 16,
            padding: "8px 16px",
            borderRadius: 4,
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
