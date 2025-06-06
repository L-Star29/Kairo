"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <DashboardNav />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
} 