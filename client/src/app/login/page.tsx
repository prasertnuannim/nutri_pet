"use client";

import Image from "next/image";
import { ShieldCheck, PawPrint } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/i18n/language-switcher";
import LoginForm from "./loginForm";

export default function LoginPage() {
  const { t } = useTranslation();
  const heroGradient = {
    backgroundImage:
      "linear-gradient(160deg, var(--background) 0%, var(--secondary) 52%, var(--card) 100%)",
  };
  const mascotGradient = {
    backgroundImage:
      "linear-gradient(160deg, var(--secondary) 0%, var(--primary-soft) 52%, var(--background) 100%)",
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="relative mx-auto flex min-h-[calc(100dvh-3rem)] max-w-5xl items-center justify-center">
        <div className="absolute right-0 top-0 z-10">
          <LanguageSwitcher />
        </div>
        <div className="grid w-full overflow-hidden rounded-[32px] border border-border bg-card shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:grid-cols-2">
          <section
            className="hidden flex-col justify-between px-10 py-12 lg:flex"
            style={heroGradient}
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
              <PawPrint className="h-4 w-4" />
              NutriPet
            </div>

            <div className="mt-10">
              <h1 className="max-w-md text-4xl font-semibold tracking-tight text-foreground">
                {t("loginPage.heroTitle")}
              </h1>

              <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
                {t("loginPage.heroDescription")}
              </p>
            </div>

            <div className="mt-12 rounded-[28px] border border-border bg-card/88 p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm">
              <div className="rounded-[24px] px-6 pt-6" style={mascotGradient}>
                <Image
                  src="/images/nutriPet.png"
                  alt={t("loginPage.mascotAlt")}
                  width={1024}
                  height={1536}
                  priority
                  className="mx-auto h-auto w-56 drop-shadow-[0_24px_40px_rgba(15,23,42,0.14)]"
                />
              </div>

              <p className="mt-5 text-sm leading-6 text-muted-foreground">
                {t("loginPage.heroCardDescription")}
              </p>
            </div>
          </section>

          <section className="flex items-center px-6 py-8 sm:px-8 lg:px-10">
            <div className="mx-auto w-full max-w-md">
              <div className="flex items-center justify-center lg:hidden">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-4 py-2 text-sm font-medium text-primary">
                  <PawPrint className="h-4 w-4" />
                  NutriPet
                </div>
              </div>

              <div className="mt-6 text-center lg:mt-0 lg:text-left">
                <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                  {t("loginPage.welcomeTitle")}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t("loginPage.welcomeDescription")}
                </p>
              </div>

              <div
                className="mt-8 rounded-[28px] border border-border p-5 shadow-sm lg:hidden"
                style={heroGradient}
              >
                <div className="rounded-[22px] bg-card/80 px-5 pt-5">
                  <Image
                    src="/images/nutriPet.png"
                    alt={t("loginPage.mascotAlt")}
                    width={1024}
                    height={1536}
                    priority
                    className="mx-auto h-auto w-40 drop-shadow-[0_18px_30px_rgba(15,23,42,0.14)]"
                  />
                </div>
                <p className="mt-4 text-center text-sm leading-6 text-muted-foreground">
                  {t("loginPage.mobileDescription")}
                </p>
              </div>

              <div className="mt-8 rounded-[24px] border border-border bg-card p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {t("loginPage.emailOnly")}
                </div>
                <LoginForm />
              </div>

              <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
                {t("loginPage.footer")}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
