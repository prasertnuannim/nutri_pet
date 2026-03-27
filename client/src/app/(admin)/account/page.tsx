import { redirect } from "next/navigation";
import AccountForm from "./accountForm";
import { getServerTranslation } from "@/lib/i18n/server";
import { getAuthSession } from "@/services/auth/session";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getAuthSession();
  const { t } = await getServerTranslation();
  if (!session?.user) redirect("/");
  if (session.user.role !== "admin") redirect("/");

  return (
    <main className="mx-auto">
      <div className="mb-1">
        <h1 className="text-3xl font-semibold">{t("accountPage.title")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("accountPage.description")}
        </p>
      </div>
      <AccountForm />
    </main>
  );
}
