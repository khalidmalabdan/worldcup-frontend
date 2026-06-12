export default function EmptyState({ message }: { message: string }) {
  return (
    <p className="text-gray-500 text-center py-6">
      {message}
    </p>
  );
}
