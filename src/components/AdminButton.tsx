export default function AdminButton({ children, onClick, color = "blue" }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded text-white bg-${color}-600`}
    >
      {children}
    </button>
  );
}
