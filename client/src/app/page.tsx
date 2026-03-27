"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/form/loading";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return <Loading />;
}
