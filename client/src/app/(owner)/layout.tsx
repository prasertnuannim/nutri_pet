import Navbar from "@/app/(user)/navbar";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </>
  );
}
