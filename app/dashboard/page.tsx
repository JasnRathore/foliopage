import type { Metadata } from "next";
import { DashboardEditor } from "@/components/dashboard-editor";

export const metadata: Metadata = {
  title: "Dashboard | foliopage",
  description: "Create and publish your resume-first profile in under 10 minutes.",
};

export default function DashboardPage() {
  return <DashboardEditor />;
}

