"use client";

import clsx from "clsx";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  Clock3,
  HeartPulse,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getIntlLocale, resolveLanguage } from "@/lib/i18n/shared";

const dashboardStats: Array<{
  labelKey: string;
  value: string;
  icon: LucideIcon;
  valueClassName: string;
  iconWrapClassName: string;
  iconClassName: string;
}> = [
  {
    labelKey: "userDashboard.stats.todayQueue",
    value: "5",
    icon: CalendarDays,
    valueClassName: "text-foreground",
    iconWrapClassName: "bg-primary-soft",
    iconClassName: "text-primary",
  },
  {
    labelKey: "userDashboard.stats.waiting",
    value: "1",
    icon: Clock3,
    valueClassName: "text-warning",
    iconWrapClassName: "bg-warning-soft",
    iconClassName: "text-warning",
  },
  {
    labelKey: "userDashboard.stats.inProgress",
    value: "2",
    icon: Activity,
    valueClassName: "text-primary",
    iconWrapClassName: "bg-primary-soft",
    iconClassName: "text-primary",
  },
  {
    labelKey: "userDashboard.stats.totalPets",
    value: "5",
    icon: HeartPulse,
    valueClassName: "text-foreground",
    iconWrapClassName: "bg-muted",
    iconClassName: "text-muted-foreground",
  },
];

const queueRows = [
  {
    id: 1,
    time: "09:00:00",
    hn: "HN001234",
    patientName: "Momo",
    speciesKey: "registerPet.cat",
    sexKey: "registerPet.female",
    ageYears: 3,
    weight: 4.5,
    doctor: "Dr. Sarah Wilson",
    departmentKey: "userDashboard.medicalRecords",
    billingAmount: 1000,
  },
];

export default function Page() {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(resolveLanguage(i18n.resolvedLanguage));
  const filterOptions = [
    [t("userDashboard.today"), t("userDashboard.thisWeek"), t("userDashboard.thisMonth")],
    [
      t("userDashboard.allStatus"),
      t("userDashboard.stats.waiting"),
      t("userDashboard.stats.inProgress"),
      t("userDashboard.completed"),
    ],
    [t("userDashboard.clinicMain"), t("userDashboard.clinicEast")],
    [
      t("userDashboard.medicalRecords"),
      t("userDashboard.laboratory"),
      t("userDashboard.pharmacy"),
    ],
  ];
  const billingFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  });

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.labelKey}
              className="rounded-lg border border-border bg-card p-4 shadow-sm shadow-black/5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">
                    {t(card.labelKey)}
                  </p>
                  <p className={clsx("mt-3 text-4xl font-semibold", card.valueClassName)}>
                    {card.value}
                  </p>
                </div>

                <div
                  className={clsx(
                    "flex h-11 w-11 items-center justify-center rounded-2xl",
                    card.iconWrapClassName
                  )}
                >
                  <Icon className={clsx("h-5 w-5", card.iconClassName)} />
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm shadow-black/5">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <h2 className="text-2xl font-semibold text-foreground">
            {t("userDashboard.queueTitle")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("userDashboard.queueDescription")}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              {t("userDashboard.filter")}
            </span>
            {filterOptions.map((options, index) => (
              <label key={options[0]} className="sr-only" htmlFor={`filter-${index}`}>
                {options[0]}
              </label>
            ))}
            {filterOptions.map((options, index) => (
              <select
                key={options[0]}
                id={`filter-${index}`}
                defaultValue={options[0]}
                className="min-w-[140px] rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ))}

            <button
              type="button"
              className="text-sm font-semibold text-primary transition hover:text-primary/80"
            >
              {t("common.actions.clearFilters")}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px]">
            <thead className="bg-muted/70 text-left">
              <tr className="text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                <th className="px-5 py-4 sm:px-6">{t("userDashboard.number")}</th>
                <th className="px-5 py-4">{t("userDashboard.checkInTime")}</th>
                <th className="px-5 py-4">{t("userPets.hn")}</th>
                <th className="px-5 py-4">{t("userDashboard.petName")}</th>
                <th className="px-5 py-4">{t("userDashboard.weightKg")}</th>
                <th className="px-5 py-4">{t("userDashboard.assignedDoctor")}</th>
                <th className="px-5 py-4">{t("userDashboard.department")}</th>
                <th className="px-5 py-4">{t("userDashboard.billing")}</th>
                <th className="px-5 py-4 text-right sm:px-6">{t("userDashboard.action")}</th>
              </tr>
            </thead>
            <tbody>
              {queueRows.map((row) => (
                <tr key={row.hn} className="border-t border-border text-sm text-muted-foreground">
                  <td className="px-5 py-5 sm:px-6">{row.id}</td>
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-muted-foreground" />
                      {row.time}
                    </div>
                  </td>
                  <td className="px-5 py-5 font-semibold text-primary">{row.hn}</td>
                  <td className="px-5 py-5">
                    <div className="font-semibold text-foreground">
                      {row.patientName}
                      <span className="ml-1 font-normal text-muted-foreground">
                        ({t(row.speciesKey)})
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {t(row.sexKey)} • {t("userPets.year", { count: row.ageYears })}
                    </div>
                  </td>
                  <td className="px-5 py-5">
                    {row.weight} {t("common.units.kg")}
                  </td>
                  <td className="px-5 py-5">{row.doctor}</td>
                  <td className="px-5 py-5">
                    <span className="inline-flex rounded-lg bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                      {t(row.departmentKey)}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    <div className="font-semibold text-foreground">
                      {billingFormatter.format(row.billingAmount)}
                    </div>
                    <div className="mt-1 text-xs font-medium text-destructive">
                      {t("userDashboard.unpaid")}
                    </div>
                  </td>
                  <td className="px-5 py-5 text-right sm:px-6">
                    <button
                      type="button"
                      aria-label={t("userDashboard.openPatient", { name: row.patientName })}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border bg-muted/70 px-5 py-4 text-sm text-muted-foreground sm:px-6">
          {t("userDashboard.showingPets", { shown: 1, total: 5 })}
        </div>
      </section>
    </div>
  );
}
