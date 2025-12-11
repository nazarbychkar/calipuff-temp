"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Pagination from "./Pagination";
import ComponentCard from "../ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";

interface PromoCode {
  id: number;
  code: string;
  discount_percent: number;
  is_one_time: boolean;
  usage_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function PromoCodesTable() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    discount_percent: "",
    is_one_time: false,
    is_active: true,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const promoCodesPerPage = 10;

  const totalPages = useMemo(
    () => Math.ceil(promoCodes.length / promoCodesPerPage),
    [promoCodes.length]
  );

  const paginatedPromoCodes = useMemo(
    () =>
      promoCodes.slice(
        (currentPage - 1) * promoCodesPerPage,
        currentPage * promoCodesPerPage
      ),
    [promoCodes, currentPage, promoCodesPerPage]
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [promoCodes, currentPage, totalPages]);

  const fetchPromoCodes = async () => {
    try {
      const res = await fetch("/api/admin/promo-codes");
      if (!res.ok) throw new Error("Failed to fetch promo codes");
      const data = await res.json();
      setPromoCodes(data);
    } catch (error) {
      console.error("Error fetching promo codes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const handleAdd = () => {
    setFormData({
      code: "",
      discount_percent: "",
      is_one_time: false,
      is_active: true,
    });
    setEditingId(null);
    setShowAddForm(true);
  };

  const handleEdit = (promoCode: PromoCode) => {
    setFormData({
      code: promoCode.code,
      discount_percent: promoCode.discount_percent.toString(),
      is_one_time: promoCode.is_one_time,
      is_active: promoCode.is_active,
    });
    setEditingId(promoCode.id);
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `/api/admin/promo-codes/${editingId}`
        : "/api/admin/promo-codes";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formData.code,
          discount_percent: Number(formData.discount_percent),
          is_one_time: formData.is_one_time,
          is_active: formData.is_active,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Помилка збереження промокоду");
        return;
      }

      setShowAddForm(false);
      setEditingId(null);
      fetchPromoCodes();
    } catch (error) {
      console.error("Error saving promo code:", error);
      alert("Помилка збереження промокоду");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Ви впевнені, що хочете деактивувати цей промокод?"))
      return;
    try {
      const res = await fetch(`/api/admin/promo-codes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete promo code");
      fetchPromoCodes();
    } catch (error) {
      console.error("Error deleting promo code:", error);
      alert("Помилка видалення промокоду");
    }
  };

  if (loading) {
    return <div>Завантаження...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Промокоди</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Додати промокод
        </button>
      </div>

      {showAddForm && (
        <ComponentCard title={editingId ? "Редагувати промокод" : "Додати промокод"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Код промокоду *</Label>
              <Input
                type="text"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                required
                placeholder="НАПРИКЛАД"
              />
            </div>

            <div>
              <Label>Відсоток знижки *</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={formData.discount_percent}
                onChange={(e) =>
                  setFormData({ ...formData, discount_percent: e.target.value })
                }
                required
                placeholder="10"
              />
            </div>

            <div>
              <Label>
                <input
                  type="checkbox"
                  checked={formData.is_one_time}
                  onChange={(e) =>
                    setFormData({ ...formData, is_one_time: e.target.checked })
                  }
                  className="mr-2"
                />
                Одноразовий промокод
              </Label>
            </div>

            <div>
              <Label>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="mr-2"
                />
                Активний
              </Label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingId ? "Зберегти" : "Створити"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Скасувати
              </button>
            </div>
          </form>
        </ComponentCard>
      )}

      <ComponentCard title="Список промокодів">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Код</TableCell>
              <TableCell>Знижка</TableCell>
              <TableCell>Тип</TableCell>
              <TableCell>Використань</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Створено</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPromoCodes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Немає промокодів
                </TableCell>
              </TableRow>
            ) : (
              paginatedPromoCodes.map((promoCode) => (
                <TableRow key={promoCode.id}>
                  <TableCell>{promoCode.id}</TableCell>
                  <TableCell className="font-mono font-bold">
                    {promoCode.code}
                  </TableCell>
                  <TableCell>{promoCode.discount_percent}%</TableCell>
                  <TableCell>
                    {promoCode.is_one_time ? "Одноразовий" : "Багаторазовий"}
                  </TableCell>
                  <TableCell>{promoCode.usage_count}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded ${
                        promoCode.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {promoCode.is_active ? "Активний" : "Неактивний"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(promoCode.created_at).toLocaleDateString("uk-UA")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(promoCode)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Редагувати
                      </button>
                      <button
                        onClick={() => handleDelete(promoCode.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Деактивувати
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </ComponentCard>
    </div>
  );
}

