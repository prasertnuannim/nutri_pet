"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getUsersAction, updateUserAction, deleteUserAction } from "./actions";
import { FullUser } from "@/types/account.type";
import { DataTable, Column } from "@/components/form/dataTable";
import RegisterModal from "@/components/auth/registerForm";

const roleToText = (role: FullUser["role"] | undefined) =>
  typeof role === "string" ? role : role?.name ?? "";

const uniqueSortedValues = (values: Array<string | undefined>) =>
  Array.from(
    new Set(
      values
        .map((value) => value?.trim() ?? "")
        .filter((value) => value.length > 0),
    ),
  ).sort((left, right) => left.localeCompare(right));

type UserColumnKey = "name" | "email" | "role" | "tenant" | "promotion";

export default function AccountForm() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<FullUser[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const fetchUsers = useCallback(async (): Promise<FullUser[]> => {
    const result = await getUsersAction({ page: 1, limit: 100 });
    if (!result?.success) {
      setUsersError(result?.error ?? "errors.users.fetchFailed");
      return [];
    }
    setUsersError(null);

    const payload = result.data as { data?: unknown } | undefined;
    return Array.isArray(payload?.data) ? (payload.data as FullUser[]) : [];
  }, []);

  const syncUsers = useCallback(async () => {
    setIsUsersLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } finally {
      setIsUsersLoading(false);
    }
  }, [fetchUsers]);

  useEffect(() => {
    syncUsers();
  }, [syncUsers]);

  const handleUpdateUser = async (id: string, values: Partial<FullUser>) => {
    const upd: Record<string, unknown> = {
      ...values,
    };

    if (values.role !== undefined) {
      const role = roleToText(values.role);
      if (role) upd.role = role;
      else delete upd.role;
    }

    await updateUserAction(id, upd);
    await syncUsers();
  };

  const handleHardDeleteUser = async (id: string) => {
    await deleteUserAction(id);
    await syncUsers();
  };

  const columns: Column<FullUser, UserColumnKey>[] = [
    { key: "name", header: t("accountForm.name"), sortable: true,className: "break-all max-w-[260px]" },
    { key: "email", header: t("accountForm.email"), sortable: true,  className: "break-all max-w-[260px]" },
    {
      key: "role",
      header: t("accountForm.role"),
      sortable: true,
      render: (u) => (
        <span
          className={`rounded px-2 py-1 text-xs ${
            roleToText(u.role) === "admin"
              ? "bg-destructive/10 text-destructive"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {roleToText(u.role) === "admin"
            ? t("accountForm.roleAdmin")
            : t("accountForm.roleUser")}
        </span>
      ),
      editor: ({ value, set }) => (
        <select
          value={roleToText(value)}
          onChange={(e) => set(e.target.value)}
          className="w-full rounded border border-border bg-card px-2 py-1 text-sm text-foreground"
        >
          <option value="admin">{t("accountForm.roleOptionAdmin")}</option>
          <option value="user">{t("accountForm.roleOptionUser")}</option>
        </select>
      ),
    },
    {
      key: "tenant",
      header: t("accountForm.tenant"),
      sortable: true,
      className: "break-all max-w-[220px]",
      editor: ({ value, set }) => (
        <input
          type="text"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => set(e.target.value)}
          className="w-full rounded border border-border bg-card px-2 py-1 text-sm text-foreground"
        />
      ),
    },
    {
      key: "promotion",
      header: t("accountForm.promotion"),
      sortable: true,
      className: "break-all max-w-[220px]",
      editor: ({ value, set }) => (
        <input
          type="text"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => set(e.target.value)}
          className="w-full rounded border border-border bg-card px-2 py-1 text-sm text-foreground"
        />
      ),
    },
  ];

  const tenantOptions = uniqueSortedValues(users.map((user) => user.tenant));
  const promotionOptions = uniqueSortedValues(users.map((user) => user.promotion));

  return (
    <div className="container mx-auto py-5">
      <DataTable<FullUser, UserColumnKey>
        data={users}
        columns={columns}
        initialPageSize={10}
        initialSort={{ key: "name", dir: "asc" }}
        searchPlaceholder={t("accountForm.searchPlaceholder")}
        emptyMessage={usersError ?? t("accountForm.noResults")}
        isLoading={isUsersLoading}
        onCreateClick={() => setIsRegisterOpen(true)}
        onUpdate={handleUpdateUser}
        onHardDelete={handleHardDeleteUser}
        confirmDeleteTitle={t("accountForm.deleteTitle")}
        confirmDeleteDescription={t("accountForm.deleteDescription")}
        confirmDeleteText={t("accountForm.deleteConfirm")}
        confirmDeleteClassName="cursor-pointer bg-destructive text-white hover:bg-destructive/90"
        getConfirmDeleteProps={(row) => ({
          title: t("accountForm.deleteRowTitle", {
            name: row.name ?? row.email ?? row.id,
          }),
          description: t("accountForm.deleteRowDescription"),
          confirmText: t("accountForm.deleteRowConfirm"),
        })}
      />

      {isRegisterOpen && (
        <RegisterModal
          open={isRegisterOpen}
          onOpenChange={setIsRegisterOpen}
          onSuccess={syncUsers}
          tenantOptions={tenantOptions}
          promotionOptions={promotionOptions}
        />
      )}
    </div>
  );
}
