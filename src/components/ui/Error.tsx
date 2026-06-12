export default function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="text-red-500 text-sm mb-4 text-center font-medium">
      {message}
    </p>
  );
}
