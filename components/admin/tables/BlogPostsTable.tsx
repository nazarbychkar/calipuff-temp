"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import Image from "next/image";
import Pagination from "./Pagination";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  published: boolean;
  publishedAt: Date | null;
  created_at: Date;
  updated_at: Date;
}

export default function BlogPostsTable() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const totalPages = useMemo(
    () => Math.ceil(posts.length / postsPerPage),
    [posts.length]
  );

  const paginatedPosts = useMemo(
    () =>
      posts.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
      ),
    [posts, currentPage, postsPerPage]
  );

  // Reset to first page if posts are changed (e.g., after deletion)
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [posts, currentPage, totalPages]);

  async function handleDelete(postId: number) {
    if (!confirm("Ви впевнені, що хочете видалити цей пост?")) return;
    try {
      const res = await fetch(`/api/blog/${postId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete post");

      // Оновлюємо стан
      const updatedPosts = posts.filter((p) => p.id !== postId);
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Помилка при видаленні поста");
    }
  }

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/blog");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05]">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Пости блогу
            </h2>
            <Link
              href="/admin/blog/add"
              className="inline-block rounded-md bg-green-400 px-4 py-2 text-white text-sm hover:bg-green-600 transition"
            >
              + Додати пост
            </Link>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300"
                >
                  Зображення
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300"
                >
                  Заголовок
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300"
                >
                  Slug
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300"
                >
                  Короткий опис
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300"
                >
                  Статус
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300"
                >
                  Дата публікації
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300"
                >
                  Створено
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300"
                >
                  Дії
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    Завантаження...
                  </TableCell>
                </TableRow>
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    Постів не знайдено.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPosts.map((post) => (
                  <TableRow
                    key={post.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                  >
                    <TableCell className="px-5 py-4">
                      {post.imageUrl ? (
                        <div className="relative w-16 h-16">
                          <Image
                            src={post.imageUrl}
                            alt={post.title}
                            width={64}
                            height={64}
                            className="object-cover rounded"
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-[200px]">
                      {post.title}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {post.slug}
                      </code>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-[200px]">
                      {post.excerpt
                        ? post.excerpt.length > 50
                          ? `${post.excerpt.slice(0, 50)}…`
                          : post.excerpt
                        : "—"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm">
                      {post.published ? (
                        <span className="inline-block rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 text-xs">
                          Опубліковано
                        </span>
                      ) : (
                        <span className="inline-block rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400 px-2 py-1 text-xs">
                          Чернетка
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("uk-UA")
                        : "—"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(post.created_at).toLocaleDateString("uk-UA")}
                    </TableCell>
                    <TableCell className="px-5 py-4 space-x-2">
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="inline-block rounded-md bg-blue-400 px-3 py-1 text-white text-sm hover:bg-blue-600 transition"
                      >
                        Редагувати
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="inline-block rounded-md bg-red-400 px-3 py-1 text-white text-sm hover:bg-red-600 transition"
                      >
                        Видалити
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {!loading && posts.length > postsPerPage && (
            <div className="flex justify-end px-5 py-4 border-t border-gray-100 dark:border-white/[0.05]">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
