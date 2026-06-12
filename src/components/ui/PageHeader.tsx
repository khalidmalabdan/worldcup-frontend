export default function PageHeader({ title }: { title: string }) {
  return (
    <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
      {title}
    </h1>
  );
}
