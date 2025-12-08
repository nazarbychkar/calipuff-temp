import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Блог | Calishops",
  description: "Останні новини та статті від Calishops",
};

async function getBlogPosts() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");
    const res = await fetch(`${baseUrl}/api/blog?published=true`, {
      cache: "no-store",
    });
    if (!res.ok) return { posts: [], total: 0 };
    return await res.json();
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return { posts: [], total: 0 };
  }
}

export default async function BlogPage() {
  const { posts } = await getBlogPosts();

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <Link
            href="/"
            className="inline-block mb-8 text-lg opacity-60 hover:opacity-100 transition-opacity duration-300"
          >
            ← На головну
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Блог
          </h1>
          <p className="text-lg opacity-70 max-w-2xl">
            Останні новини, статті та оновлення від Calishops.
          </p>
          <div className="w-20 h-1 bg-black dark:bg-white mt-6"></div>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl opacity-60">
              Поки що постів немає. Завітайте пізніше!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <article className="h-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {post.imageUrl && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <time className="text-sm opacity-60">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString(
                              "uk-UA",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : new Date(post.created_at).toLocaleDateString(
                              "uk-UA",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                      </time>
                    </div>
                    <h2 className="text-2xl font-semibold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-base opacity-80 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-4 text-sm text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
                      Читати далі →
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
