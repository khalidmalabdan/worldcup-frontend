import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "success" | "warning" | "secondary";
}

export default function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const base =
    "px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    warning: "bg-orange-600 text-white hover:bg-orange-700",
    secondary: "bg-gray-300 text-black hover:bg-gray-400",
  };

  return (
    <button className={clsx(base, variants[variant], className)} {...props} />
  );
}
