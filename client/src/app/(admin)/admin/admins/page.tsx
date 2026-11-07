import type { Metadata } from "next";
import { AdminManagementView } from "@/features/admin/admins/components/AdminManagementView";

export const metadata: Metadata = {
  title: "Administrator Management | HealthNest Governance",
  description: "Provision platform operator accounts, review administrative credentials, and manage authorizations.",
};

export default function AdminsPage() {
  return <AdminManagementView />;
}
