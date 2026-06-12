export default function PageContainer({
  children,
  size = "md",
}: {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
  };

  return (
    <div className={`${sizes[size]} mx-auto p-6 md:p-10`}>
      {children}
    </div>
  );
}
