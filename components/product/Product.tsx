"use client";

import { useAppContext } from "@/lib/GeneralProvider";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useBasket } from "@/lib/BasketProvider";
import Image from "next/image";
import Alert from "@/components/shared/Alert";
import { getFirstProductImage } from "@/lib/getFirstProductImage";
import { useProduct } from "@/lib/useProducts";
import { BRAND } from "@/lib/brand";

// Volume/Size mapping for vapes, liquids, and cartridges
const SIZE_MAP: Record<string, string> = {
  "1": "1ml",
  "2": "2ml",
  "3": "5ml",
  "4": "10ml",
  "5": "30ml",
  "6": "50ml",
  "7": "100ml",
};

export default function Product() {
  const { addItem } = useBasket();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const quantity = 1;
  const { isDark } = useAppContext();
  const { id } = useParams();
  
  // Use the optimized hook for product fetching
  const { product, loading, error } = useProduct(id as string);
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Auto-select first color if available
  useEffect(() => {
    if (product?.colors && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0].label);
    }
  }, [product, selectedColor]);

  const handleAddToCart = () => {
    // Size is optional for vape products
    if (product?.colors && product.colors.length > 0 && !selectedColor) {
      setAlertMessage("Оберіть смак");
      setAlertType("warning");
      setTimeout(() => setAlertMessage(null), 3000);
      return;
    }
    if (!product) {
      setAlertMessage("Товар не завантажений");
      setAlertType("error");
      setTimeout(() => setAlertMessage(null), 3000);
      return;
    }
    const media = product.media || [];
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      ...(selectedSize && { size: selectedSize }),
      quantity,
      imageUrl: getFirstProductImage(media),
      ...(selectedColor && { color: selectedColor }),
      ...(product.discount_percentage && { discount_percentage: product.discount_percentage })
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) return <div className="p-10">Loading product...</div>;
  if (error || !product)
    return <div className="p-10">Error: {error || "Product not found"}</div>;

  const media = product.media || [];
  const sizes = (product.sizes as { size: string; stock?: number | string }[] | undefined)
    ?.filter((s) => Number(s.stock ?? 0) > 0)
    .map((s) => s.size) || [];
  const outOfStock = product.stock === 0 || (sizes.length > 0 && sizes.length === 0);

  return (
    <section className="max-w-[1920px] w-full mx-auto">
      <div className="flex flex-col lg:flex-row justify-around p-4 md:p-10 gap-10">
        {/* Media Section */}
        <div className="relative flex justify-center w-full lg:w-1/2">
          <div className="w-full max-w-[800px] max-h-[85vh] flex items-center justify-center overflow-hidden">
            {media[activeImageIndex]?.type === "video" ? (
              <video
                className="w-full h-auto max-h-[85vh] object-contain"
                src={`/api/images/${media[activeImageIndex]?.url}`}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <Image
                className="object-contain"
                src={`/api/images/${media[activeImageIndex]?.url}`}
                alt={product.name}
                width={800}
                height={1160}
                style={{ maxHeight: "85vh", width: "auto", height: "auto" }}
              />
            )}
          </div>

          {media.length > 1 && (
            <>
              {/* Prev */}
              <button
                className="absolute top-[40%] -translate-y-1/2 left-2 md:left-4 rounded-full cursor-pointer z-10 opacity-60 hover:opacity-100 transition"
                onClick={() =>
                  setActiveImageIndex((prev) =>
                    prev === 0 ? media.length - 1 : prev - 1
                  )
                }
              >
                <Image
                  src={
                    isDark
                      ? "/images/dark-theme/slider-button-left.svg"
                      : "/images/light-theme/slider-button-left.svg"
                  }
                  alt="Previous"
                  width={32}
                  height={32}
                  className="w-6 h-6 md:w-8 md:h-8"
                />
              </button>

              {/* Next */}
              <button
                className="absolute top-[40%] -translate-y-1/2 right-2 md:right-4 rounded-full cursor-pointer z-10 opacity-60 hover:opacity-100 transition"
                onClick={() =>
                  setActiveImageIndex((prev) =>
                    prev === media.length - 1 ? 0 : prev + 1
                  )
                }
              >
                <Image
                  src={
                    isDark
                      ? "/images/dark-theme/slider-button-right.svg"
                      : "/images/light-theme/slider-button-right.svg"
                  }
                  alt="Next"
                  width={32}
                  height={32}
                  className="w-6 h-6 md:w-8 md:h-8"
                />
              </button>
            </>
          )}
        </div>

        {/* Info Section */}
        <div className="flex flex-col gap-6 md:gap-10 px-4 md:px-0 w-full lg:w-1/2">
          {/* Availability */}
          <div className="text-base md:text-lg font-normal font-['Helvetica'] leading-relaxed tracking-wide">
            В наявності
          </div>

          {/* Product Name */}
          <div className="text-3xl md:text-5xl lg:text-6xl font-normal font-['Inter'] capitalize leading-tight">
            {product.name}
          </div>

          {/* Price */}
          <div className="w-full flex flex-col sm:flex-row justify-start border-b p-2 sm:p-4 gap-2">
            <div className="text-red-500 text-lg md:text-xl font-['Helvetica']">
              {product.price} ₴
            </div>
          </div>

          {/* Volume/Size Picker (optional for vape products) */}
          {sizes.length > 0 && (
            <>
              <div className="text-base md:text-lg font-['Inter'] uppercase tracking-tight">
                Оберіть об&apos;єм
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {sizes.map((size) => (
                  <div
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-19 sm:w-19 md:w-22 p-2 sm:p-3 border-2 flex justify-center text-base md:text-lg font-['Inter'] uppercase cursor-pointer transition-all duration-200 ${
                      selectedSize === size
                        ? "border-black dark:border-white font-bold scale-105 shadow-md"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-600 dark:hover:border-gray-400 hover:scale-105 hover:shadow-md"
                    }`}
                  >
                    {SIZE_MAP[size] || size}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Stock Status */}
          {outOfStock && (
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded border text-sm uppercase tracking-wide bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800 w-fit">
              Немає в наявності
            </div>
          )}

          {/* Flavor/Color Picker */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="text-sm md:text-base font-['Inter'] uppercase tracking-tight">
                  Смак
                </div>
              </div>
              <div className="flex items-end gap-4">
                {product.colors.map((c, idx) => {
                  const isActive = selectedColor === c.label;
                  return (
                    <div
                      key={`${c.label}-${idx}`}
                      className="flex flex-col items-center"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedColor(c.label)}
                        className={`relative flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full border transition ${
                          isActive
                            ? "border-gray-700"
                            : "border-gray-300 hover:border-gray-500"
                        }`}
                        aria-label={c.label}
                        title={c.label}
                        style={{ backgroundColor: c.hex || "#ffffff" }}
                      />
                      <div
                        className={`mt-1 h-[2px] rounded-full ${
                          isActive ? "w-6 bg-black" : "w-0 bg-transparent"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
              {selectedColor && (
                <div className="text-base md:text-lg font-['Inter'] text-gray-700">
                  Смак: {selectedColor}
                </div>
              )}
            </div>
          )}

          {/* Add to Cart Button */}
          <div
            onClick={outOfStock ? undefined : handleAddToCart}
            className={`w-full text-center ${
              isDark
                ? "bg-white text-black hover:bg-gray-100"
                : "bg-black text-white hover:bg-gray-800"
            } p-3 text-lg md:text-xl font-medium font-['Inter'] uppercase tracking-tight transition-all duration-200 ${
              outOfStock
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
            }`}
          >
            в кошик
          </div>

          {/* Telegram Manager Link */}
          <a
            href={BRAND.socials.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full text-center border ${
              isDark 
                ? "border-gray-500 text-gray-400 hover:border-white hover:text-white" 
                : "border-gray-400 text-gray-600 hover:border-black hover:text-black"
            } py-2 px-3 text-sm md:text-base font-light font-['Inter'] cursor-pointer transition-all duration-200`}
          >
            Написати менеджеру
          </a>

          {/* CBD/THC Content Information */}
          {(product.cbdContentMg || product.thcContentMg || product.potency) && (
            <div className="flex flex-col gap-3 p-4 bg-white/50 rounded-lg border border-stone-200">
              <div className="text-base md:text-lg font-semibold font-['Montserrat'] uppercase tracking-tight">
                Склад
              </div>
              <div className="flex flex-col gap-2 text-sm md:text-base font-['Poppins']">
                {product.cbdContentMg !== undefined && product.cbdContentMg > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">CBD:</span>
                    <span>{product.cbdContentMg} мг</span>
                  </div>
                )}
                {product.thcContentMg !== null && product.thcContentMg !== undefined && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">ТГК:</span>
                    <span>{product.thcContentMg} мг</span>
                  </div>
                )}
                {product.potency && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Потенційність:</span>
                    <span>{product.potency}</span>
                  </div>
                )}
                <div className="mt-2 text-xs md:text-sm text-stone-600 italic">
                  * Всі продукти мають COA сертифікацію
                </div>
              </div>
            </div>
          )}

          {/* Toast */}
          {showToast && (
            <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black text-white px-5 py-3 rounded shadow-lg z-50">
              Товар додано до кошика!
            </div>
          )}

          {/* Alert */}
          <Alert
            type={alertType}
            message={alertMessage || ""}
            isVisible={!!alertMessage}
            onClose={() => setAlertMessage(null)}
          />

          {/* Description Section */}
          <div className="w-full md:w-[522px]">
            <div className="mb-3 md:mb-4 text-xl md:text-2xl font-['Inter'] uppercase tracking-tight">
              опис
            </div>
            <div className="text-sm md:text-lg font-['Inter'] leading-relaxed tracking-wide">
              {product.description}
            </div>
          </div>

          {/* Stock Information */}
          {product.stock !== undefined && product.stock > 0 && (
            <div className="text-sm md:text-base font-['Poppins'] text-stone-600">
              В наявності: {product.stock} шт.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
