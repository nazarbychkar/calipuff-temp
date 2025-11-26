"use client";

import { useAppContext } from "@/lib/GeneralProvider";
import { useState, useEffect } from "react";
import { useBasket } from "@/lib/BasketProvider";
import Image from "next/image";
import Alert from "@/components/shared/Alert";
import { getFirstProductImage } from "@/lib/getFirstProductImage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { BRAND } from "@/lib/brand";
import "swiper/css";
import "swiper/css/navigation";

// Add custom styles for smooth transitions
const swiperStyles = `
  .swiper {
    touch-action: pan-y pinch-zoom;
    will-change: transform;
    -webkit-overflow-scrolling: touch;
    overflow: hidden;
  }
  .swiper-wrapper {
    transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .swiper-slide {
    transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  .swiper-slide-transition-allow {
    will-change: transform;
  }
  .swiper-slide img,
  .swiper-slide video {
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
  }
`;
import { Swiper as SwiperType } from "swiper";

interface ProductClientProps {
  product: {
    id: number;
    name: string;
    price: number;
    old_price?: number | null;
    discount_percentage?: number | null;
    description?: string | null;
    stock?: number;
    media?: { url: string; type: string }[];
    colors?: { label: string; hex?: string | null }[];
    // CBD-specific fields
    cbdContentMg?: number;
    thcContentMg?: number | null;
    potency?: string | null;
  };
}

interface RelatedProduct {
  id: number;
  name: string;
  first_color: { label: string; hex?: string | null } | null;
}

export default function ProductClient({ product: initialProduct }: ProductClientProps) {
  const quantity = 1;
  const { isDark } = useAppContext();
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [product, setProduct] = useState(initialProduct);
  const [isLoading, setIsLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Use basket hook - component is client-side only with 'use client'
  const { addItem } = useBasket();

  // Inject custom styles for smoother transitions
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = swiperStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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

  // Fetch related products with same name
  useEffect(() => {
    async function fetchRelatedProducts() {
      try {
        const response = await fetch(
          `/api/products/related-colors?name=${encodeURIComponent(product.name)}`
        );
        if (response.ok) {
          const data: RelatedProduct[] = await response.json();
          // Filter out current product
          const filtered = data.filter((p) => p.id !== product.id);
          setRelatedProducts(filtered);
        } else {
          // Silently fail - related products are optional
          console.warn("Could not fetch related products:", response.statusText);
        }
      } catch (error) {
        // Silently fail - related products are optional and shouldn't break the page
        console.warn("Error fetching related products (non-critical):", error);
      }
    }
    
    if (product?.name) {
      fetchRelatedProducts();
    }
  }, [product.name, product.id]);

  // Handle color variant change
  const handleColorVariantChange = async (productId: number) => {
    if (productId === product.id) return;
    
    setIsLoading(true);
    setActiveImageIndex(0);
    
    // Scroll to top on mobile when changing color variant
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (response.ok) {
        const newProduct = await response.json();
        
        // Update URL without reload
        window.history.pushState(null, '', `/product/${productId}`);
        
        // Update product state with smooth transition
        setTimeout(() => {
          setProduct(newProduct);
          
          // Auto-select first color if available
          if (newProduct.colors && newProduct.colors.length > 0) {
            setSelectedColor(newProduct.colors[0].label);
          } else {
            setSelectedColor(null);
          }
          
          setIsLoading(false);
        }, 100);
      } else {
        console.error("Failed to fetch product:", response.statusText);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product?.colors && product.colors.length > 0 && !selectedColor) {
      setAlertMessage("Оберіть колір");
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
    if (!addItem) {
      setAlertMessage("Кошик недоступний. Спробуйте оновити сторінку.");
      setAlertType("error");
      setTimeout(() => setAlertMessage(null), 3000);
      return;
    }
    const media = product.media || [];
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: getFirstProductImage(media),
      color: selectedColor || undefined,
      discount_percentage: product.discount_percentage ?? undefined,
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const media = product.media || [];
  const stock = product.stock ?? 0;
  const outOfStock = stock <= 0;

  // SWIPER
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Update swiper when product changes
  useEffect(() => {
    if (swiper && media.length > 0) {
      setActiveImageIndex(0);
      swiper.slideTo(0);
    }
  }, [product.id, swiper, media.length]);

  // Avoid SSR hydration flicker
  useEffect(() => setIsMounted(true), []);
  if (!isMounted || !media?.length) return null;

  // Manual next/prev handling (to avoid loop flickers)
  const handleNext = () => {
    if (!swiper) return;
    if (activeImageIndex >= media.length - 1) {
      swiper.slideTo(0);
    } else {
      swiper.slideTo(activeImageIndex + 1);
    }
  };

  const handlePrev = () => {
    if (!swiper) return;
    if (activeImageIndex === 0) {
      swiper.slideTo(media.length - 1);
    } else {
      swiper.slideTo(activeImageIndex - 1);
    }
  };

  // COLORS

  return (
    <section className="max-w-[1920px] w-full mx-auto">
      <div className="flex flex-col lg:flex-row justify-around p-4 md:p-10 gap-10">
        <div 
          className={`relative w-full lg:w-1/2 flex justify-center transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
          style={{ touchAction: 'pan-y pinch-zoom' }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-black dark:border-t-white rounded-full animate-spin"></div>
            </div>
          )}
          <Swiper
            modules={[Navigation]}
            onSwiper={setSwiper}
            slidesPerView={1}
            spaceBetween={10}
            speed={500}
            allowTouchMove={!isLoading}
            centeredSlides={true}
            onSlideChange={(s) => setActiveImageIndex(s.activeIndex)}
            className="product-swiper w-full max-w-[800px]"
            key={product.id}
            touchRatio={1}
            touchAngle={45}
            resistance={true}
            resistanceRatio={0.85}
            followFinger={true}
            threshold={5}
            longSwipes={true}
            longSwipesRatio={0.5}
            longSwipesMs={300}
            watchSlidesProgress={true}
            cssMode={false}
          >
            {media.map((item, i) => (
              <SwiperSlide key={i} style={{ touchAction: 'pan-y pinch-zoom' }}>
                <div 
                  className="flex justify-center items-center max-h-[85vh] overflow-hidden"
                  style={{ 
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                    WebkitTouchCallout: 'none'
                  }}
                >
                  {item.type === "video" ? (
                    <video
                      className="object-contain w-full max-h-[85vh]"
                      src={`/api/images/${item.url}`}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{ 
                        WebkitUserSelect: 'none',
                        userSelect: 'none',
                        pointerEvents: 'auto'
                      }}
                    />
                  ) : (
                    <Image
                      src={`/api/images/${item.url}`}
                      alt={`Product media ${i}`}
                      width={800}
                      height={1160}
                      priority={i === activeImageIndex}
                      quality={i === activeImageIndex ? 90 : 80}
                      className="object-contain w-auto h-auto"
                      style={{ 
                        maxHeight: "85vh",
                        WebkitUserSelect: 'none',
                        userSelect: 'none',
                        pointerEvents: 'auto'
                      }}
                      draggable={false}
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {media.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                aria-label="Previous image"
                className="absolute left-2 top-[42.5vh] -translate-y-1/2 z-10 hidden lg:flex items-center justify-center w-8 h-8 border border-gray-300 dark:border-gray-600 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm hover:bg-white dark:hover:bg-black transition-all"
              >
                <svg 
                  className="w-4 h-4 text-gray-700 dark:text-gray-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                aria-label="Next image"
                className="absolute right-2 top-[42.5vh] -translate-y-1/2 z-10 hidden lg:flex items-center justify-center w-8 h-8 border border-gray-300 dark:border-gray-600 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm hover:bg-white dark:hover:bg-black transition-all"
              >
                <svg 
                  className="w-4 h-4 text-gray-700 dark:text-gray-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Info Section */}
        <div className="flex flex-col gap-6 md:gap-10 px-4 md:px-0 w-full lg:w-1/2">
          {/* Availability */}
          <div className="text-base md:text-lg font-normal font-['Helvetica'] leading-relaxed tracking-wide">
            {outOfStock ? "Немає в наявності" : "В наявності"}
          </div>

          {/* Product Name */}
          <div className={`text-3xl md:text-5xl lg:text-6xl font-normal font-['Inter'] capitalize leading-tight transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
            {product.name}
          </div>

          {/* Price */}
          <div className="w-full flex flex-col sm:flex-row justify-start border-b p-2 sm:p-4 gap-2">
            <div className="flex justify-start gap-8 text-2xl md:text-3xl font-['Helvetica']">
              {product.discount_percentage ? (
                <div className="flex items-center gap-2">
                  {/* Discounted price */}
                  <span className="font-medium text-red-600">
                    {(
                      product.price *
                      (1 - product.discount_percentage / 100)
                    ).toFixed(2)}
                    ₴
                  </span>

                  {/* Original (crossed-out) price */}
                  <span className="line-through">{product.price}₴</span>

                  {/* Optional: show discount percentage */}
                  <span className="text-green-600 text-sm">
                    -{product.discount_percentage}%
                  </span>
                </div>
              ) : (
                <span className="font-medium">{product.price}₴</span>
              )}
            </div>
          </div>

          {/* Color Picker */}
          {(product.colors && product.colors.length > 0) || relatedProducts.length > 0 ? (
            <div className="flex flex-col gap-3">
              <div className="text-sm md:text-base font-['Inter'] uppercase tracking-tight">
                Колір
              </div>
              
              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                {/* Current product colors */}
                {product.colors && product.colors.length > 0 && 
                  product.colors.map((c, idx) => {
                    const isActive = selectedColor === c.label;
                    return (
                      <button
                        key={`current-${c.label}-${idx}`}
                        type="button"
                        onClick={() => setSelectedColor(c.label)}
                        className={`relative w-10 h-10 md:w-11 md:h-11 rounded-full border transition-all duration-200 ${
                          isActive
                            ? "border-black dark:border-white scale-100"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                        }`}
                        aria-label={c.label}
                        title={c.label}
                        style={{ 
                          backgroundColor: c.hex || "#ffffff",
                        }}
                      >
                        {isActive && (
                          <div className="absolute inset-0 rounded-full border-2 border-black dark:border-white"></div>
                        )}
                      </button>
                    );
                  })
                }

                {/* Related products colors */}
                {relatedProducts.map((relatedProduct) => {
                  if (!relatedProduct.first_color) return null;
                  
                  const color = relatedProduct.first_color;
                  
                  return (
                    <button
                      key={`related-${relatedProduct.id}`}
                      type="button"
                      onClick={() => handleColorVariantChange(relatedProduct.id)}
                      disabled={isLoading}
                      className={`relative w-10 h-10 md:w-11 md:h-11 rounded-full border border-gray-300 dark:border-gray-600 transition-all duration-200 hover:border-gray-500 dark:hover:border-gray-400 cursor-pointer ${
                        isLoading ? 'opacity-50 cursor-wait' : ''
                      }`}
                      aria-label={`Переглянути ${color.label}`}
                      title={color.label}
                      style={{ 
                        backgroundColor: color.hex || "#ffffff",
                        opacity: 0.7
                      }}
                    />
                  );
                })}
              </div>
              
              {selectedColor && (
                <div className="text-sm font-['Inter'] text-gray-700 dark:text-gray-300 font-light tracking-wide">
                  {selectedColor}
                </div>
              )}
            </div>
          ) : null}

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
          {product.description && (
            <div className="w-full md:w-[522px] mt-6">
              <div className="mb-3 md:mb-4 text-xl md:text-2xl font-['Inter'] uppercase tracking-tight">
                опис
              </div>
              <div className="text-sm md:text-lg font-['Inter'] leading-relaxed tracking-wide">
                {product.description}
              </div>
            </div>
          )}

          {/* CBD Parameters Section */}
          {(product.cbdContentMg !== undefined && product.cbdContentMg > 0) || 
           (product.thcContentMg !== null && product.thcContentMg !== undefined) || 
           product.potency ? (
            <div className="w-full md:w-[522px] mt-6">
              <div className="mb-3 md:mb-4 text-xl md:text-2xl font-['Inter'] uppercase tracking-tight">
                CBD Параметри
              </div>
              <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                {product.cbdContentMg !== undefined && product.cbdContentMg > 0 && (
                  <div className="flex items-center gap-3 text-sm md:text-base font-['Inter']">
                    <span className="font-medium min-w-[100px]">CBD вміст:</span>
                    <span className="text-gray-700 dark:text-gray-300">{product.cbdContentMg} мг</span>
                  </div>
                )}
                {product.thcContentMg !== null && product.thcContentMg !== undefined && (
                  <div className="flex items-center gap-3 text-sm md:text-base font-['Inter']">
                    <span className="font-medium min-w-[100px]">THC вміст:</span>
                    <span className="text-gray-700 dark:text-gray-300">{product.thcContentMg} мг</span>
                  </div>
                )}
                {product.potency && (
                  <div className="flex items-center gap-3 text-sm md:text-base font-['Inter']">
                    <span className="font-medium min-w-[100px]">Потенція:</span>
                    <span className="text-gray-700 dark:text-gray-300">{product.potency}</span>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
