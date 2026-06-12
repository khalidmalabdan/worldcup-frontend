"use client";

export default function ErrorPage({ error, reset }: any) {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-red-500">Something went wrong</h1>
      <p className="text-gray-400">{error.message}</p>

      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Try Again
      </button>
    </div>
  );
}
