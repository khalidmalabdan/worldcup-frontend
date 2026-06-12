export default function Skeleton({ className = "h-6 w-40" }) {
  return (
    <div
      className={`animate-pulse bg-gray-700 rounded ${className}`}
    />
  );
}
