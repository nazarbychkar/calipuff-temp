import PageBreadcrumb from "@/components/admin/PageBreadCrumb";
import PromoCodesTable from "@/components/admin/tables/PromoCodesTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Промокоди | Admin Panel",
  description: "Управління промокодами",
};

export default function PromoCodesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Промокоди" />
      <div className="space-y-6">
        <PromoCodesTable />
      </div>
    </div>
  );
}

