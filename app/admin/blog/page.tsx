import PageBreadcrumb from "@/components/admin/PageBreadCrumb";
import BlogPostsTable from "@/components/admin/tables/BlogPostsTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Блог | Admin Panel",
  description: "Управління постами блогу",
};

export default function BlogPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Блог" />
      <div className="space-y-6">
        <BlogPostsTable />
      </div>
    </div>
  );
}
