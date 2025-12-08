"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/admin/PageBreadCrumb";
import { generateSlug } from "@/lib/slug";

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [originalSlug, setOriginalSlug] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    published: false,
    publishedAt: "",
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      // Автоматично генеруємо slug тільки якщо slug не був змінений вручну
      slug:
        formData.slug === originalSlug || !formData.slug
          ? generateSlug(title)
          : formData.slug,
    });
  };

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/blog/${postId}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const post = await res.json();

        const slug = post.slug || "";
        setFormData({
          title: post.title || "",
          slug,
          excerpt: post.excerpt || "",
          content: post.content || "",
          imageUrl: post.imageUrl || "",
          published: post.published || false,
          publishedAt: post.publishedAt
            ? new Date(post.publishedAt).toISOString().slice(0, 16)
            : "",
        });
        setOriginalSlug(slug); // Зберігаємо оригінальний slug
      } catch (error) {
        console.error("Error fetching post:", error);
        alert("Помилка при завантаженні поста");
        router.push("/admin/blog");
      } finally {
        setLoading(false);
      }
    }

    if (postId) {
      fetchPost();
    }
  }, [postId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        publishedAt: formData.published && formData.publishedAt
          ? formData.publishedAt
          : formData.published
          ? new Date().toISOString()
          : null,
      };

      const res = await fetch(`/api/blog/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update post");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Помилка при оновленні поста";
      alert(errorMessage);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Редагувати пост" />
        <div className="text-center py-12">Завантаження...</div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Редагувати пост" />
      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Заголовок *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Введіть заголовок поста"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slug *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="url-friendly-slug"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      slug: generateSlug(formData.title),
                    })
                  }
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm whitespace-nowrap"
                  title="Регенерувати slug з заголовку"
                >
                  Оновити
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Використовується в URL. Автоматично генерується при зміні заголовку.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Короткий опис
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Короткий опис поста (необов'язково)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Контент *
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={15}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
                placeholder="Введіть контент поста"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL зображення
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData({ ...formData, published: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Опубліковано
                </span>
              </label>
            </div>

            {formData.published && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Дата публікації
                </label>
                <input
                  type="datetime-local"
                  value={formData.publishedAt}
                  onChange={(e) =>
                    setFormData({ ...formData, publishedAt: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50"
            >
              {saving ? "Збереження..." : "Зберегти зміни"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-600 transition"
            >
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
