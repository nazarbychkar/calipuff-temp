"use client";

import { useEffect, useState, useMemo } from "react";

interface SidebarFilterProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openAccordion: number | null;
  setOpenAccordion: React.Dispatch<React.SetStateAction<number | null>>;
  isDark: boolean;
  sortOrder: "asc" | "desc";
  setSortOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
  minPrice: number | null;
  maxPrice: number | null;
  setMinPrice: React.Dispatch<React.SetStateAction<number | null>>;
  setMaxPrice: React.Dispatch<React.SetStateAction<number | null>>;
  selectedColors: string[];
  setSelectedColors: React.Dispatch<React.SetStateAction<string[]>>;
  colors: string[];
  products?: Array<{ price: number }>;
}

export default function SidebarFilter({
  isOpen,
  setIsOpen,
  openAccordion,
  setOpenAccordion,
  isDark,
  sortOrder,
  setSortOrder,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  selectedColors,
  setSelectedColors,
  colors,
  products = [],
}: SidebarFilterProps) {
  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  useEffect(() => {
    console.log("Selected colors updated:", selectedColors);
  }, [selectedColors]);

  // Calculate price range from products
  const priceRange = useMemo(() => {
    if (!products || products.length === 0) {
      return { min: 0, max: 10000 };
    }
    const prices = products.map((p) => p.price);
    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));
    // Round to nice numbers for better UX
    const roundedMin = Math.max(0, Math.floor(min / 100) * 100);
    const roundedMax = Math.ceil(max / 100) * 100;
    return { min: roundedMin, max: roundedMax };
  }, [products]);

  // Initialize price range state
  const [priceRangeState, setPriceRangeState] = useState(() => ({
    min: minPrice ?? priceRange.min,
    max: maxPrice ?? priceRange.max,
  }));

  // Sync state when priceRange changes
  useEffect(() => {
    if (minPrice === null && maxPrice === null) {
      setPriceRangeState({
        min: priceRange.min,
        max: priceRange.max,
      });
    }
  }, [priceRange.min, priceRange.max, minPrice, maxPrice]);

  // Sync state when minPrice/maxPrice change externally
  useEffect(() => {
    if (minPrice !== null || maxPrice !== null) {
      setPriceRangeState({
        min: minPrice ?? priceRange.min,
        max: maxPrice ?? priceRange.max,
      });
    }
  }, [minPrice, maxPrice, priceRange.min, priceRange.max]);

  const handlePriceRangeChange = (type: "min" | "max", value: number) => {
    const numValue = Math.round(value);
    if (type === "min") {
      const newMin = Math.min(numValue, priceRangeState.max - 1);
      setPriceRangeState((prev) => ({ ...prev, min: newMin }));
      // Only set filter if it's different from the minimum range
      setMinPrice(newMin <= priceRange.min ? null : newMin);
    } else {
      const newMax = Math.max(numValue, priceRangeState.min + 1);
      setPriceRangeState((prev) => ({ ...prev, max: newMax }));
      // Only set filter if it's different from the maximum range
      setMaxPrice(newMax >= priceRange.max ? null : newMax);
    }
  };

  return (
    <div className="relative z-50">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-4/5 sm:max-w-md ${
          isDark ? "bg-stone-900" : "bg-stone-100"
        } shadow-md z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`}
      >
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl sm:text-2xl uppercase font-semibold">
              Фільтрувати / Сортувати
            </div>
            <button
              className="text-2xl sm:text-3xl hover:text-[#8C7461]"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          {/* Accordion: Sorting */}
          <div className="w-full border-b px-2 sm:px-4 py-3 hover:bg-gray-200 transition">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleAccordion(1)}
            >
              <span className="text-xl sm:text-2xl uppercase">
                Сортувати за
              </span>
              <span className="font-semibold text-xl sm:text-2xl">
                {openAccordion === 1 ? "−" : "+"}
              </span>
            </div>

            {openAccordion === 1 && (
              <div className="pl-4 mt-2 space-y-2">
                <button
                  className={`block text-left w-full hover:text-[#8C7461] text-base sm:text-lg ${
                    sortOrder === "asc" ? "font-semibold text-[#8C7461]" : ""
                  }`}
                  onClick={() => setSortOrder("asc")}
                >
                  За зростанням ціни
                </button>
                <button
                  className={`block text-left w-full hover:text-[#8C7461] text-base sm:text-lg ${
                    sortOrder === "desc" ? "font-semibold text-[#8C7461]" : ""
                  }`}
                  onClick={() => setSortOrder("desc")}
                >
                  За спаданням ціни
                </button>
              </div>
            )}
          </div>

          {/* Accordion: Flavor */}
          <div className="w-full border-b px-2 sm:px-4 py-3 hover:bg-gray-200 transition">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleAccordion(2)}
            >
              <span className="text-xl sm:text-2xl uppercase">Смак</span>
              <span className="font-semibold text-xl sm:text-2xl">
                {openAccordion === 2 ? "−" : "+"}
              </span>
            </div>

            {openAccordion === 2 && (
              <div className="pl-4 mt-2 space-y-2">
                {colors.map((color, index) => (
                  <label
                    key={index} // Use the color string as the key
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={() => toggleColor(color)}
                      className="form-checkbox h-4 w-4 text-[#8C7461]"
                    />
                    <span className="text-base sm:text-lg">{color}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Accordion: Price */}
          <div className="w-full border-b px-2 sm:px-4 py-3 hover:bg-gray-200 transition">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleAccordion(3)}
            >
              <span className="text-xl sm:text-2xl uppercase">Вартість</span>
              <span className="font-semibold text-xl sm:text-2xl">
                {openAccordion === 3 ? "−" : "+"}
              </span>
            </div>

            {openAccordion === 3 && (
              <div className="pl-4 mt-4 space-y-6">
                {/* Price Range Display */}
                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="text-[#FFA500]">
                    {priceRangeState.min.toLocaleString()} ₴
                  </span>
                  <span className="text-gray-400 mx-2">—</span>
                  <span className="text-[#FFA500]">
                    {priceRangeState.max.toLocaleString()} ₴
                  </span>
                </div>

                {/* Dual Range Slider */}
                <div className="relative py-4">
                  {/* Track Background */}
                  <div className="relative h-2 bg-gray-200 rounded-full">
                    {/* Active Range Fill */}
                    <div
                      className="absolute h-2 bg-[#FFA500] rounded-full transition-all duration-200"
                      style={{
                        left: `${Math.max(0, ((priceRangeState.min - priceRange.min) / (priceRange.max - priceRange.min)) * 100)}%`,
                        width: `${Math.max(0, ((priceRangeState.max - priceRangeState.min) / (priceRange.max - priceRange.min)) * 100)}%`,
                      }}
                    />
                  </div>

                  {/* Min Range Input */}
                  <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    step={Math.max(1, Math.floor((priceRange.max - priceRange.min) / 100))}
                    value={priceRangeState.min}
                    onChange={(e) =>
                      handlePriceRangeChange("min", parseInt(e.target.value))
                    }
                    className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
                    style={{
                      zIndex: priceRangeState.min > priceRangeState.max ? 3 : 1,
                    }}
                  />

                  {/* Max Range Input */}
                  <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    step={Math.max(1, Math.floor((priceRange.max - priceRange.min) / 100))}
                    value={priceRangeState.max}
                    onChange={(e) =>
                      handlePriceRangeChange("max", parseInt(e.target.value))
                    }
                    className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
                    style={{ zIndex: 2 }}
                  />
                </div>

                {/* Reset Button */}
                {(minPrice !== null || maxPrice !== null) && (
                  <button
                    onClick={() => {
                      setMinPrice(null);
                      setMaxPrice(null);
                      setPriceRangeState({
                        min: priceRange.min,
                        max: priceRange.max,
                      });
                    }}
                    className="text-sm text-[#FFA500] hover:text-[#FFD700] underline transition-colors font-medium"
                  >
                    Скинути фільтр
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
