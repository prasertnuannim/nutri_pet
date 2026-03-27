import Sidebar from "./sidebar";
import Navbar from "./navbar";
import UserProviders from "./providers";
import { getAuthSession } from "@/services/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  const profile = session?.user
    ? {
        name: session.user.name ?? "User",
        email: session.user.email ?? null,
        role: session.user.role ?? null,
        image: session.user.image ?? null,
      }
    : null;

  return (
    <UserProviders>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar profile={profile} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </UserProviders>
  );
}
