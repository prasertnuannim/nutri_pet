"use client";

import clsx from "clsx";
import Link from "next/link";
import { useDeferredValue, useState } from "react";
import {
  ArrowRight,
  ClipboardList,
  Clock3,
  Plus,
  Search,
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getIntlLocale, resolveLanguage } from "@/lib/i18n/shared";

type OrderStatus = "awaitingReview" | "mixing" | "ready" | "completed";
type FulfillmentMethod = "pickup" | "localDelivery" | "courier";
type PaymentStatus = "pending" | "partial" | "paid";

type OrderRecord = {
  id: string;
  hn: string;
  patientName: string;
  speciesKey: string;
  ownerName: string;
  formulaName: string;
  bagCount: number;
  durationDays: number;
  fulfillment: FulfillmentMethod;
  status: OrderStatus;
  payment: PaymentStatus;
  total: number;
  updatedAt: string;
  scheduledAt: string;
  viewHref: string;
};

const orderRecords: OrderRecord[] = [
  {
    id: "ORD-260416-001",
    hn: "HN-A1024",
    patientName: "Momo",
    speciesKey: "registerPet.cat",
    ownerName: "Anong Rattanakul",
    formulaName: "GI Gentle Support",
    bagCount: 4,
    durationDays: 14,
    fulfillment: "pickup",
    status: "awaitingReview",
    payment: "pending",
    total: 1850,
    updatedAt: "2026-04-16T08:45:00+07:00",
    scheduledAt: "2026-04-16T17:30:00+07:00",
    viewHref: "/pets?focus=HN-A1024",
  },
  {
    id: "ORD-260416-002",
    hn: "HN-D2077",
    patientName: "Bao",
    speciesKey: "registerPet.dog",
    ownerName: "Kanda Prasert",
    formulaName: "Renal Balance Blend",
    bagCount: 3,
    durationDays: 10,
    fulfillment: "localDelivery",
    status: "mixing",
    payment: "partial",
    total: 2450,
    updatedAt: "2026-04-16T09:20:00+07:00",
    scheduledAt: "2026-04-16T18:15:00+07:00",
    viewHref: "/pets?focus=HN-D2077",
  },
  {
    id: "ORD-260416-003",
    hn: "HN-D3118",
    patientName: "Latte",
    speciesKey: "registerPet.dog",
    ownerName: "Suriyon Klinchan",
    formulaName: "Weight Control Formula",
    bagCount: 5,
    durationDays: 21,
    fulfillment: "courier",
    status: "ready",
    payment: "paid",
    total: 1990,
    updatedAt: "2026-04-16T10:10:00+07:00",
    scheduledAt: "2026-04-17T09:00:00+07:00",
    viewHref: "/pets?focus=HN-D3118",
  },
  {
    id: "ORD-260415-019",
    hn: "HN-C1140",
    patientName: "Nori",
    speciesKey: "registerPet.cat",
    ownerName: "Pimpa Wongchai",
    formulaName: "Hypoallergenic Turkey Recipe",
    bagCount: 2,
    durationDays: 7,
    fulfillment: "pickup",
    status: "completed",
    payment: "paid",
    total: 1620,
    updatedAt: "2026-04-15T16:40:00+07:00",
    scheduledAt: "2026-04-16T11:00:00+07:00",
    viewHref: "/pets?focus=HN-C1140",
  },
  {
    id: "ORD-260415-020",
    hn: "HN-D1299",
    patientName: "Tofu",
    speciesKey: "registerPet.dog",
    ownerName: "Kornkanok S.",
    formulaName: "Senior Mobility Mix",
    bagCount: 6,
    durationDays: 30,
    fulfillment: "localDelivery",
    status: "ready",
    payment: "paid",
    total: 3280,
    updatedAt: "2026-04-15T15:05:00+07:00",
    scheduledAt: "2026-04-16T19:00:00+07:00",
    viewHref: "/pets?focus=HN-D1299",
  },
  {
    id: "ORD-260414-018",
    hn: "HN-C2204",
    patientName: "Pudding",
    speciesKey: "registerPet.cat",
    ownerName: "Nicha Boonmee",
    formulaName: "Urinary Care Formula",
    bagCount: 3,
    durationDays: 14,
    fulfillment: "courier",
    status: "mixing",
    payment: "pending",
    total: 2140,
    updatedAt: "2026-04-14T13:25:00+07:00",
    scheduledAt: "2026-04-17T13:30:00+07:00",
    viewHref: "/pets?focus=HN-C2204",
  },
];

const statusToneClasses: Record<OrderStatus, string> = {
  awaitingReview: "border-amber-200 bg-amber-50 text-amber-800",
  mixing: "border-primary/20 bg-primary-soft text-primary",
  ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
  completed: "border-border bg-muted text-muted-foreground",
};

const fulfillmentToneClasses: Record<FulfillmentMethod, string> = {
  pickup: "border-primary/20 bg-primary-soft text-primary",
  localDelivery: "border-sky-200 bg-sky-50 text-sky-700",
  courier: "border-violet-200 bg-violet-50 text-violet-700",
};

const paymentToneClasses: Record<PaymentStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  partial: "border-sky-200 bg-sky-50 text-sky-700",
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

function formatDateTime(locale: string, value: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function OrdersPage() {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(resolveLanguage(i18n.resolvedLanguage));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [fulfillmentFilter, setFulfillmentFilter] = useState<"all" | FulfillmentMethod>("all");
  const [paymentFilter, setPaymentFilter] = useState<"all" | PaymentStatus>("all");
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  const visibleOrders = orderRecords.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }

    if (fulfillmentFilter !== "all" && order.fulfillment !== fulfillmentFilter) {
      return false;
    }

    if (paymentFilter !== "all" && order.payment !== paymentFilter) {
      return false;
    }

    if (!deferredSearch) {
      return true;
    }

    const haystack = [
      order.id,
      order.hn,
      order.patientName,
      order.ownerName,
      order.formulaName,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(deferredSearch);
  });

  const activeCount = visibleOrders.filter((order) => order.status !== "completed").length;
  const reviewCount = visibleOrders.filter((order) => order.status === "awaitingReview").length;
  const handoffCount = visibleOrders.filter((order) => order.status === "ready").length;
  const projectedValue = visibleOrders.reduce((sum, order) => sum + order.total, 0);

  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  });

  const summaryCards: Array<{
    labelKey: string;
    value: string;
    icon: LucideIcon;
    valueClassName: string;
    iconWrapClassName: string;
    iconClassName: string;
  }> = [
    {
      labelKey: "userOrders.summary.active",
      value: String(activeCount),
      icon: ClipboardList,
      valueClassName: "text-foreground",
      iconWrapClassName: "bg-primary-soft",
      iconClassName: "text-primary",
    },
    {
      labelKey: "userOrders.summary.review",
      value: String(reviewCount),
      icon: Clock3,
      valueClassName: "text-amber-700",
      iconWrapClassName: "bg-amber-50",
      iconClassName: "text-amber-700",
    },
    {
      labelKey: "userOrders.summary.handoff",
      value: String(handoffCount),
      icon: Truck,
      valueClassName: "text-emerald-700",
      iconWrapClassName: "bg-emerald-50",
      iconClassName: "text-emerald-700",
    },
    {
      labelKey: "userOrders.summary.value",
      value: currencyFormatter.format(projectedValue),
      icon: Wallet,
      valueClassName: "text-foreground",
      iconWrapClassName: "bg-muted",
      iconClassName: "text-muted-foreground",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
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
                  <p className={clsx("mt-3 text-3xl font-semibold", card.valueClassName)}>
                    {card.value}
                  </p>
                </div>

                <div
                  className={clsx(
                    "flex h-11 w-11 items-center justify-center rounded-2xl",
                    card.iconWrapClassName,
                  )}
                >
                  <Icon className={clsx("h-5 w-5", card.iconClassName)} />
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm shadow-black/5">
        <div className="border-b border-border p-4 md:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary-soft px-3 py-1 text-xs font-semibold tracking-[0.08em] text-primary">
                <ClipboardList className="h-3.5 w-3.5" />
                {t("userOrders.pageEyebrow")}
              </div>
              <h1 className="mt-3 text-2xl font-semibold text-foreground">
                {t("userOrders.pageTitle")}
              </h1>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {t("userOrders.pageDescription")}
              </p>
            </div>

            <Button asChild className="gap-2 self-start">
              <Link href="/pets">
                <Plus className="h-4 w-4" />
                {t("userOrders.createOrder")}
              </Link>
            </Button>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_180px]">
            <label className="relative block">
              <span className="sr-only">{t("userOrders.searchPlaceholder")}</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("userOrders.searchPlaceholder")}
                className="h-10 pl-9"
              />
            </label>

            <label className="sr-only" htmlFor="order-status-filter">
              {t("userOrders.filters.status")}
            </label>
            <select
              id="order-status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as "all" | OrderStatus)}
              className="h-10 rounded-xl border border-border bg-card px-3 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
            >
              <option value="all">{t("userOrders.filters.allStatuses")}</option>
              <option value="awaitingReview">{t("userOrders.status.awaitingReview")}</option>
              <option value="mixing">{t("userOrders.status.mixing")}</option>
              <option value="ready">{t("userOrders.status.ready")}</option>
              <option value="completed">{t("userOrders.status.completed")}</option>
            </select>

            <label className="sr-only" htmlFor="order-fulfillment-filter">
              {t("userOrders.filters.fulfillment")}
            </label>
            <select
              id="order-fulfillment-filter"
              value={fulfillmentFilter}
              onChange={(event) =>
                setFulfillmentFilter(event.target.value as "all" | FulfillmentMethod)
              }
              className="h-10 rounded-xl border border-border bg-card px-3 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
            >
              <option value="all">{t("userOrders.filters.allFulfillment")}</option>
              <option value="pickup">{t("userOrders.fulfillment.pickup")}</option>
              <option value="localDelivery">{t("userOrders.fulfillment.localDelivery")}</option>
              <option value="courier">{t("userOrders.fulfillment.courier")}</option>
            </select>

            <label className="sr-only" htmlFor="order-payment-filter">
              {t("userOrders.filters.payment")}
            </label>
            <select
              id="order-payment-filter"
              value={paymentFilter}
              onChange={(event) => setPaymentFilter(event.target.value as "all" | PaymentStatus)}
              className="h-10 rounded-xl border border-border bg-card px-3 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
            >
              <option value="all">{t("userOrders.filters.allPayments")}</option>
              <option value="pending">{t("userOrders.payment.pending")}</option>
              <option value="partial">{t("userOrders.payment.partial")}</option>
              <option value="paid">{t("userOrders.payment.paid")}</option>
            </select>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            {t("userOrders.sourceHint")}
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/70 hover:bg-muted/70">
                <TableHead className="min-w-[150px]">{t("userOrders.columns.order")}</TableHead>
                <TableHead className="min-w-[200px]">{t("userOrders.columns.patient")}</TableHead>
                <TableHead className="min-w-[220px]">{t("userOrders.columns.formula")}</TableHead>
                <TableHead className="min-w-[180px]">
                  {t("userOrders.columns.fulfillment")}
                </TableHead>
                <TableHead className="min-w-[160px]">{t("userOrders.columns.status")}</TableHead>
                <TableHead className="min-w-[140px]">{t("userOrders.columns.total")}</TableHead>
                <TableHead className="w-[90px] text-center">
                  {t("userOrders.columns.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {visibleOrders.length > 0 ? (
                visibleOrders.map((order) => (
                  <TableRow key={order.id} className="h-[84px]">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-primary">{order.id}</span>
                        <span className="text-xs text-muted-foreground">
                          {t("userOrders.updatedAt", {
                            date: formatDateTime(locale, order.updatedAt),
                          })}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{order.patientName}</span>
                        <span className="text-sm text-muted-foreground">
                          {t(order.speciesKey)} • {order.hn}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {t("userOrders.ownerPrefix", { name: order.ownerName })}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{order.formulaName}</span>
                        <span className="text-sm text-muted-foreground">
                          {t("userOrders.bags", { count: order.bagCount })} •{" "}
                          {t("userOrders.days", { count: order.durationDays })}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <span
                          className={clsx(
                            "inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-semibold",
                            fulfillmentToneClasses[order.fulfillment],
                          )}
                        >
                          {t(`userOrders.fulfillment.${order.fulfillment}`)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {t("userOrders.scheduledAt", {
                            date: formatDateTime(locale, order.scheduledAt),
                          })}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <span
                          className={clsx(
                            "inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-semibold",
                            statusToneClasses[order.status],
                          )}
                        >
                          {t(`userOrders.status.${order.status}`)}
                        </span>
                        <span
                          className={clsx(
                            "inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-semibold",
                            paymentToneClasses[order.payment],
                          )}
                        >
                          {t(`userOrders.payment.${order.payment}`)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="font-semibold text-foreground">
                        {currencyFormatter.format(order.total)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-center">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          aria-label={t("userOrders.openOrder", { id: order.id })}
                          className="text-primary hover:bg-primary-soft hover:text-primary"
                        >
                          <Link href={order.viewHref}>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    {t("userOrders.empty")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
          {t("userOrders.showingOrders", {
            shown: visibleOrders.length,
            total: orderRecords.length,
          })}
        </div>
      </section>
    </div>
  );
}
