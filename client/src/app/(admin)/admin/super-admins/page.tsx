import type { Metadata } from "next";
import { SuperAdminManagementView } from "@/features/admin/super-admins/components/SuperAdminManagementView";

export const metadata: Metadata = {
  title: "Super Administrator Governance | HealthNest",
  description: "Governance, provisioning, and access management of root platform super administrators.",
};

export default function SuperAdminsPage() {
  return <SuperAdminManagementView />;
}
