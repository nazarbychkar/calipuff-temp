"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface SidebarMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDark: boolean;
}

interface Category {
  id: number;
  name: string;
  subcategories?: Subcategory[];
}

interface Subcategory {
  id: number;
  name: string;
}

export default function SidebarMenu({
  isOpen,
  setIsOpen,
  isDark,
}: SidebarMenuProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [view] = useState<"menu">("menu");
  const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data: Category[] = await res.json();

        // Fetch subcategories for each category
        const categoriesWithSubcats = await Promise.all(
          data.map(async (cat) => {
            try {
              const subRes = await fetch(
                `/api/subcategories?parent_category_id=${cat.id}`
              );
              const subData: Subcategory[] = await subRes.json();
              return { ...cat, subcategories: subData };
            } catch {
              return { ...cat, subcategories: [] };
            }
          })
        );

        setCategories(categoriesWithSubcats);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="relative z-50">
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => {
            setIsOpen(false);
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-full sm:w-4/5 sm:max-w-md ${
          isDark ? "bg-stone-900" : "bg-stone-100"
        } shadow-md z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto`}
      >
        {view === "menu" && (
          <nav className="flex flex-col px-6 py-8 space-y-1">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h2 className="text-2xl sm:text-3xl font-bold">Категорії</h2>
              <button
                className="text-2xl sm:text-3xl cursor-pointer hover:text-[#FFA500] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </div>

            {loading && <p className="text-gray-500">Завантаження...</p>}
            {error && <p className="text-red-500">Помилка: {error}</p>}

            {!loading &&
              !error &&
              categories.map((cat) => (
                <div key={cat.id} className="flex flex-col border-b border-gray-200 last:border-0">
                  <div className="flex justify-between items-center py-4">
                    <Link
                      href={`/catalog?category=${encodeURIComponent(cat.name)}`}
                      className="text-lg sm:text-xl font-semibold hover:text-[#FFA500] transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {cat.name}
                    </Link>

                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <button
                        className="ml-2 text-xl font-bold text-gray-400 hover:text-[#FFA500] transition-colors"
                        onClick={() =>
                          setOpenCategoryId(
                            openCategoryId === cat.id ? null : cat.id
                          )
                        }
                      >
                        {openCategoryId === cat.id ? "−" : "+"}
                      </button>
                    )}
                  </div>

                  {/* Subcategories dropdown */}
                  {openCategoryId === cat.id && cat.subcategories && (
                    <div className="flex flex-col pl-4 pb-4 space-y-2">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/catalog?subcategory=${encodeURIComponent(
                            sub.name
                          )}`}
                          className="text-base text-gray-600 hover:text-[#FFA500] transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </nav>
        )}
      </div>
    </div>
  );
}
