"use client";

import { useState, useEffect } from "react";
import Alert from "@/components/shared/Alert";

interface Review {
  id: number;
  author_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface ProductReviewsProps {
  productId: number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

  const [formData, setFormData] = useState({
    author_name: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.author_name.trim()) {
      setAlertMessage("Будь ласка, введіть ваше ім'я");
      setAlertType("warning");
      setTimeout(() => setAlertMessage(null), 3000);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews([newReview, ...reviews]);
        setFormData({ author_name: "", rating: 5, comment: "" });
        setShowForm(false);
        setAlertMessage("Дякуємо за ваш відгук!");
        setAlertType("success");
        setTimeout(() => setAlertMessage(null), 3000);
      } else {
        const error = await response.json();
        setAlertMessage(error.error || "Помилка при додаванні відгуку");
        setAlertType("error");
        setTimeout(() => setAlertMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setAlertMessage("Помилка при додаванні відгуку");
      setAlertType("error");
      setTimeout(() => setAlertMessage(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Відгуки ({reviews.length})
          </h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {renderStars(Math.round(averageRating))}
                <span className="text-lg font-semibold text-gray-900 ml-2">
                  {averageRating.toFixed(1)}
                </span>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-[#FFA500] text-white font-semibold rounded-lg hover:bg-[#ff8c00] transition-colors"
        >
          {showForm ? "Скасувати" : "Написати відгук"}
        </button>
      </div>

      <Alert
        type={alertType}
        message={alertMessage || ""}
        isVisible={!!alertMessage}
        onClose={() => setAlertMessage(null)}
      />

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Ваше ім'я *
              </label>
              <input
                type="text"
                value={formData.author_name}
                onChange={(e) =>
                  setFormData({ ...formData, author_name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Оцінка *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating })}
                    className={`p-2 rounded-lg transition-colors ${
                      formData.rating >= rating
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    }`}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Коментар
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                placeholder="Залиште ваш відгук про товар..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full md:w-auto px-6 py-3 bg-[#FFA500] text-white font-semibold rounded-lg hover:bg-[#ff8c00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Відправка..." : "Відправити відгук"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          <p>Поки що немає відгуків. Будьте першим!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-6 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {review.author_name}
                    </h4>
                    <div className="flex gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(review.created_at)}
                  </p>
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-800 leading-relaxed mt-3">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

