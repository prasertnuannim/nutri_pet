import Navbar from "./navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
    </>
  );
}
