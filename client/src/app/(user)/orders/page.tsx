"use client";

import { ClipboardList } from "lucide-react";
import SectionPlaceholder from "../section-placeholder";

export default function OrdersPage() {
  return (
    <SectionPlaceholder
      title="userPlaceholder.ordersTitle"
      description="userPlaceholder.ordersDescription"
      icon={ClipboardList}
    />
  );
}
