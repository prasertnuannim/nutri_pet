"use client";

import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type PlanCode = "REGULAR" | "SILVER" | "GOLD";
type PlanKey = "regular" | "silver" | "gold";
type FeatureKey =
  | "userManagement"
  | "requirement"
  | "diseaseIntersection"
  | "rawMaterials"
  | "shippingFee"
  | "messengerConsult"
  | "update"
  | "premixOnly";

type Hospital = {
  id: string;
  name: string;
  planCode: PlanCode;
};

type PlanDefinition = {
  code: PlanCode;
  key: PlanKey;
  price: string;
  accentClassName: string;
  badgeClassName: string;
};

const hospitals: Hospital[] = [
  {
    id: "hosp-001",
    name: "Rajpipat Hospital",
    planCode: "GOLD",
  },
  {
    id: "hosp-002",
    name: "Bangkok Pet Hospital",
    planCode: "SILVER",
  },
  {
    id: "hosp-003",
    name: "Demo Animal Hospital",
    planCode: "REGULAR",
  },
];

const comparisonFeatures: FeatureKey[] = [
  "userManagement",
  "requirement",
  "diseaseIntersection",
  "rawMaterials",
  "shippingFee",
  "messengerConsult",
  "update",
  "premixOnly",
];

const plans: PlanDefinition[] = [
  {
    code: "REGULAR",
    key: "regular",
    price: "89 ฿/M",
    accentClassName:
      "border-[#efc24f] bg-[linear-gradient(135deg,rgba(255,247,216,1),rgba(255,241,191,1))] text-[#bf8611] shadow-[#f3d47d]/50",
    badgeClassName:
      "border-[#efc24f] bg-[linear-gradient(180deg,rgba(255,250,232,1),rgba(255,236,181,1))] text-[#bf8611]",
  },
  {
    code: "SILVER",
    key: "silver",
    price: "189฿/M",
    accentClassName:
      "border-slate-400 bg-[linear-gradient(135deg,rgba(248,249,250,1),rgba(220,223,228,1))] text-slate-500 shadow-slate-300/40",
    badgeClassName:
      "border-slate-400 bg-[linear-gradient(180deg,rgba(250,251,252,1),rgba(214,217,222,1))] text-slate-500",
  },
  {
    code: "GOLD",
    key: "gold",
    price: "489฿/M",
    accentClassName:
      "border-[#e2b018] bg-[linear-gradient(135deg,rgba(255,247,188,1),rgba(255,230,125,1))] text-[#c48b00] shadow-[#f0cf64]/50",
    badgeClassName:
      "border-[#e2b018] bg-[linear-gradient(180deg,rgba(255,251,220,1),rgba(255,231,130,1))] text-[#c48b00]",
  },
];

const planCodeToKey: Record<PlanCode, PlanKey> = {
  REGULAR: "regular",
  SILVER: "silver",
  GOLD: "gold",
};

function PlanHeaderButton({
  label,
  fullName,
  price,
  accentClassName,
  badgeClassName,
  isSelected,
  selectedLabel,
  onClick,
}: {
  label: string;
  fullName: string;
  price: string;
  accentClassName: string;
  badgeClassName: string;
  isSelected: boolean;
  selectedLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={cn(
        "flex min-h-[88px] items-center gap-3 rounded-[26px] border px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5",
        accentClassName,
        isSelected ? "ring-2 ring-amber-400 ring-offset-2" : "opacity-90",
      )}
    >
      <div
        className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center border text-center text-[8px] font-semibold uppercase tracking-[0.18em]",
          "[clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]",
          badgeClassName,
        )}
      >
        {label}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-90">
          {fullName}
        </p>
        <p className="mt-1 text-3xl font-semibold leading-none tracking-tight">
          {price}
        </p>
        {isSelected ? (
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em]">
            {selectedLabel}
          </p>
        ) : null}
      </div>
    </button>
  );
}

export default function HospitalPlanSample() {
  const { t } = useTranslation();
  const [hospitalList, setHospitalList] = useState(hospitals);
  const [selectedHospitalId, setSelectedHospitalId] = useState(hospitals[0].id);

  const selectedHospital = hospitalList.find(
    (hospital) => hospital.id === selectedHospitalId,
  );
  const selectedPlanKey = selectedHospital
    ? planCodeToKey[selectedHospital.planCode]
    : null;

  const handleChangePlan = (planCode: PlanCode) => {
    setHospitalList((prev) =>
      prev.map((hospital) =>
        hospital.id === selectedHospitalId ? { ...hospital, planCode } : hospital,
      ),
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            {t("ownerAccountPage.badge")}
          </div>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            {t("ownerAccountPage.title")}
          </h1>
          <p className="mt-2 max-w-3xl text-slate-500">
            {t("ownerAccountPage.description")}
          </p>
        </div>

        <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              {t("ownerAccountPage.selector.label")}
            </span>

            <select
              value={selectedHospitalId}
              onChange={(event) => setSelectedHospitalId(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-amber-400"
            >
              {hospitalList.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-4 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              {t("ownerAccountPage.selector.currentPackage")}
            </p>
            <p className="text-xl font-bold text-amber-600">
              {selectedPlanKey
                ? t(`ownerAccountPage.plans.${selectedPlanKey}.name`)
                : "-"}
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
          <div className="hidden gap-3 lg:grid lg:grid-cols-[minmax(210px,1.15fr)_repeat(3,minmax(0,1fr))]">
            <div className="flex items-end rounded-[26px] border border-dashed border-slate-300 bg-slate-50 p-5">
              <h2 className="text-3xl font-medium tracking-tight text-slate-900">
                {t("ownerAccountPage.comparison.title")}
              </h2>
            </div>

            {plans.map((plan) => (
              <PlanHeaderButton
                key={plan.code}
                label={t(`ownerAccountPage.plans.${plan.key}.name`)}
                fullName={t(`ownerAccountPage.plans.${plan.key}.fullName`)}
                price={plan.price}
                accentClassName={plan.accentClassName}
                badgeClassName={plan.badgeClassName}
                isSelected={selectedHospital?.planCode === plan.code}
                selectedLabel={t("ownerAccountPage.plans.selected")}
                onClick={() => handleChangePlan(plan.code)}
              />
            ))}

            {comparisonFeatures.map((feature) => (
              <Fragment key={feature}>
                <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-[15px] font-medium leading-6 text-slate-900">
                    {t(`ownerAccountPage.comparison.features.${feature}`)}
                  </p>
                </div>

                {plans.map((plan) => (
                  <div
                    key={`${feature}-${plan.code}`}
                    className={cn(
                      "flex items-center rounded-2xl border px-5 py-4",
                      selectedHospital?.planCode === plan.code
                        ? "border-amber-200 bg-amber-50/70"
                        : "border-slate-200 bg-white",
                    )}
                  >
                    <p className="text-[15px] leading-6 text-slate-900">
                      {t(`ownerAccountPage.plans.${plan.key}.values.${feature}`)}
                    </p>
                  </div>
                ))}
              </Fragment>
            ))}
          </div>

          <div className="grid gap-4 lg:hidden">
            {plans.map((plan) => (
              <div
                key={plan.code}
                className={cn(
                  "rounded-[28px] border bg-white p-0 text-left shadow-none transition",
                  selectedHospital?.planCode === plan.code
                    ? "border-amber-400 ring-2 ring-amber-300 ring-offset-2"
                    : "border-slate-200",
                )}
              >
                <div className="p-4">
                  <PlanHeaderButton
                    label={t(`ownerAccountPage.plans.${plan.key}.name`)}
                    fullName={t(`ownerAccountPage.plans.${plan.key}.fullName`)}
                    price={plan.price}
                    accentClassName={plan.accentClassName}
                    badgeClassName={plan.badgeClassName}
                    isSelected={selectedHospital?.planCode === plan.code}
                    selectedLabel={t("ownerAccountPage.plans.selected")}
                    onClick={() => handleChangePlan(plan.code)}
                  />
                </div>

                <div className="space-y-3 px-4 pb-4">
                  {comparisonFeatures.map((feature) => (
                    <div
                      key={`${plan.code}-${feature}`}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        {t(`ownerAccountPage.comparison.features.${feature}`)}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-900">
                        {t(`ownerAccountPage.plans.${plan.key}.values.${feature}`)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm font-semibold text-slate-500">
            {t("ownerAccountPage.comparison.note")}
          </p>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            {t("ownerAccountPage.table.title")}
          </h2>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-4 py-3">
                    {t("ownerAccountPage.table.hospitalHeader")}
                  </th>
                  <th className="px-4 py-3">
                    {t("ownerAccountPage.table.packageHeader")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {hospitalList.map((hospital) => (
                  <tr key={hospital.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {hospital.name}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                        {t(`ownerAccountPage.plans.${planCodeToKey[hospital.planCode]}.name`)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 font-bold text-white hover:bg-slate-700">
            {t("ownerAccountPage.actions.save")}
          </button>
        </div>
      </div>
    </main>
  );
}
