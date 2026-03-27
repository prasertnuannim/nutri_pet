import { redirect } from "next/navigation";
import LanguageSwitcher from "@/components/i18n/language-switcher";
import ChangePasswordForm from "./change-password-form";
import { DEFAULT_ACCOUNT_PASSWORD } from "@/lib/auth/default-account-password";
import { getServerTranslation } from "@/lib/i18n/server";
import { getAuthSession } from "@/services/auth/session";

export default async function ChangePasswordPage() {
  const session = await getAuthSession();
  const { t } = await getServerTranslation();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="relative min-h-dvh bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute right-4 top-4 z-10 sm:right-6 lg:right-8">
        <LanguageSwitcher />
      </div>
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] max-w-4xl items-center justify-center">
        <div className="w-full overflow-hidden rounded-[32px] border border-border bg-card shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <section className="border-b border-border bg-[linear-gradient(160deg,var(--background)_0%,var(--secondary)_52%,var(--card)_100%)] px-6 py-8 sm:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                {t("changePasswordPage.badge")}
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground">
                {t("changePasswordPage.title")}
              </h1>

              <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
                {t("changePasswordPage.description")}
              </p>

              <div className="mt-8 rounded-[24px] border border-border bg-card/88 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                <p className="text-sm font-semibold text-foreground">
                  {t("changePasswordPage.temporaryPasswordLabel")}
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-primary">
                  {DEFAULT_ACCOUNT_PASSWORD}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {t("changePasswordPage.autoSignOutNote")}
                </p>
              </div>
            </section>

            <section className="px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
              <ChangePasswordForm />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
