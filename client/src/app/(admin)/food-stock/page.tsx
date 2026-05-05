"use client";

import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type FoodStockStatus = "out" | "low" | "ready";

type FoodStockItem = {
  id: string;
  name: string;
  category: "protein" | "carbohydrate" | "vegetable" | "oil" | "supplement";
  unit: string;
  inStock: number;
  reserved: number;
  reorderPoint: number;
  supplier: string;
  linkedFormulas: number;
  updatedAt: string;
  status: FoodStockStatus;
};

const FOOD_STOCK_ITEMS: FoodStockItem[] = [
  {
    id: "ING-001",
    name: "Chicken Breast Mince",
    category: "protein",
    unit: "kg",
    inStock: 42,
    reserved: 12,
    reorderPoint: 10,
    supplier: "FarmFresh Foods",
    linkedFormulas: 4,
    updatedAt: "2026-05-02 09:10",
    status: "ready",
  },
  {
    id: "ING-002",
    name: "Pumpkin Puree",
    category: "vegetable",
    unit: "kg",
    inStock: 18,
    reserved: 8,
    reorderPoint: 12,
    supplier: "Green Harvest",
    linkedFormulas: 3,
    updatedAt: "2026-05-02 08:40",
    status: "low",
  },
  {
    id: "ING-003",
    name: "Brown Rice",
    category: "carbohydrate",
    unit: "kg",
    inStock: 55,
    reserved: 10,
    reorderPoint: 15,
    supplier: "Pure Grain Mill",
    linkedFormulas: 5,
    updatedAt: "2026-05-01 17:30",
    status: "ready",
  },
  {
    id: "ING-004",
    name: "Salmon Oil",
    category: "oil",
    unit: "L",
    inStock: 6,
    reserved: 1,
    reorderPoint: 5,
    supplier: "Nordic Pet Source",
    linkedFormulas: 4,
    updatedAt: "2026-05-02 07:55",
    status: "low",
  },
  {
    id: "ING-005",
    name: "Hydrolyzed Protein Base",
    category: "supplement",
    unit: "kg",
    inStock: 0,
    reserved: 0,
    reorderPoint: 4,
    supplier: "VetLab Nutrition",
    linkedFormulas: 2,
    updatedAt: "2026-05-01 13:20",
    status: "out",
  },
  {
    id: "ING-006",
    name: "Duck Liver",
    category: "protein",
    unit: "kg",
    inStock: 14,
    reserved: 3,
    reorderPoint: 6,
    supplier: "FarmFresh Foods",
    linkedFormulas: 2,
    updatedAt: "2026-05-02 10:05",
    status: "ready",
  },
  {
    id: "ING-007",
    name: "Sweet Potato Mash",
    category: "carbohydrate",
    unit: "kg",
    inStock: 24,
    reserved: 7,
    reorderPoint: 10,
    supplier: "Green Harvest",
    linkedFormulas: 3,
    updatedAt: "2026-05-01 15:45",
    status: "ready",
  },
  {
    id: "ING-008",
    name: "Prebiotic Fiber Mix",
    category: "supplement",
    unit: "kg",
    inStock: 3.5,
    reserved: 1.2,
    reorderPoint: 2.5,
    supplier: "VetLab Nutrition",
    linkedFormulas: 4,
    updatedAt: "2026-05-02 08:15",
    status: "low",
  },
];

const STATUS_ORDER: Record<FoodStockStatus, number> = {
  out: 0,
  low: 1,
  ready: 2,
};

function formatQuantity(value: number, unit: string) {
  return `${Number.isInteger(value) ? value : value.toFixed(1)} ${unit}`;
}

export default function FoodStockPage() {
  const { t } = useTranslation();

  const rows = FOOD_STOCK_ITEMS
    .map((item) => ({
      ...item,
      available: Math.max(item.inStock - item.reserved, 0),
    }))
    .sort((left, right) => {
      const byStatus = STATUS_ORDER[left.status] - STATUS_ORDER[right.status];
      if (byStatus !== 0) {
        return byStatus;
      }

      return left.name.localeCompare(right.name);
    });

  return (
    <main className="mx-auto max-w-7xl">
      <section className="rounded-[28px] border border-border bg-card p-5 shadow-sm shadow-black/5">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {t("foodStockPage.table.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("foodStockPage.table.description")}
            </p>
          </div>
          <div className="rounded-2xl bg-primary-soft px-3 py-2 text-xs font-medium text-primary">
            {t("foodStockPage.table.totalLinkedFormulas", {
              count: rows.reduce((sum, item) => sum + item.linkedFormulas, 0),
            })}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("foodStockPage.table.headers.ingredient")}</TableHead>
              <TableHead>{t("foodStockPage.table.headers.category")}</TableHead>
              <TableHead>{t("foodStockPage.table.headers.available")}</TableHead>
              <TableHead>{t("foodStockPage.table.headers.reserved")}</TableHead>
              <TableHead>{t("foodStockPage.table.headers.reorderPoint")}</TableHead>
              <TableHead>{t("foodStockPage.table.headers.formulas")}</TableHead>
              <TableHead>{t("foodStockPage.table.headers.supplier")}</TableHead>
              <TableHead>{t("foodStockPage.table.headers.status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="whitespace-normal">
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.id}</p>
                  </div>
                </TableCell>
                <TableCell>{t(`foodStockPage.categories.${item.category}`)}</TableCell>
                <TableCell className="font-medium text-foreground">
                  {formatQuantity(item.available, item.unit)}
                </TableCell>
                <TableCell>{formatQuantity(item.reserved, item.unit)}</TableCell>
                <TableCell>{formatQuantity(item.reorderPoint, item.unit)}</TableCell>
                <TableCell>{item.linkedFormulas}</TableCell>
                <TableCell className="whitespace-normal">
                  <div>
                    <p>{item.supplier}</p>
                    <p className="text-xs text-muted-foreground">{item.updatedAt}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={statusBadgeClass(item.status)}>
                    {t(`foodStockPage.status.${item.status}`)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </main>
  );
}

function statusBadgeClass(status: FoodStockStatus) {
  if (status === "ready") {
    return "inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700";
  }

  if (status === "low") {
    return "inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700";
  }

  return "inline-flex rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700";
}
