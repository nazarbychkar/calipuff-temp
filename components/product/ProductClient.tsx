"use client";

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
import ProductLightbox from "./ProductLightbox";
import ProductReviews from "./ProductReviews";
import SimilarProducts from "./SimilarProducts";

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
    media?: { url: string; type: string }[];
    colors?: { label: string; hex?: string | null }[];
    // CBD-specific fields
    cbdContentMg?: number;
    thcContentMg?: number | null;
    // Product specifications
    effect?: string | null;
    inhalationCount?: string | null;
    volume?: string | null;
    composition?: string | null;
    deviceType?: string | null;
    manufacturer?: string | null;
    // Boolean badges
    isPopular?: boolean;
    isRecommended?: boolean;
    hasStrongEffect?: boolean;
    // Category for similar products
    category?: { name: string } | null;
  };
}

interface RelatedProduct {
  id: number;
  name: string;
  first_color: { label: string; hex?: string | null } | null;
}

export default function ProductClient({ product: initialProduct }: ProductClientProps) {
  const quantity = 1;
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [product, setProduct] = useState(initialProduct);
  const [isLoading, setIsLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
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
  const [activeSection, setActiveSection] = useState<string>("overview");

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

  // SWIPER
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };
  
  // Update swiper when product changes
  useEffect(() => {
    if (swiper && media.length > 0) {
      setActiveImageIndex(0);
      swiper.slideTo(0);
    }
  }, [product.id, swiper, media.length]);

  // Avoid SSR hydration flicker
  useEffect(() => setIsMounted(true), []);

  // Track active section on scroll
  useEffect(() => {
    const sections = ["overview", "specifications", "buyer-info", "reviews", "similar"];
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sections.includes(sectionId)) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [product.id]);

  // Smooth scroll handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset for sticky nav
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
    }
  };

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
      <div className="flex flex-col lg:flex-row justify-between p-4 md:p-8 lg:p-12 gap-8 lg:gap-16">
        <div 
          className={`relative w-full lg:w-1/2 flex justify-center transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
          style={{ touchAction: 'pan-y pinch-zoom' }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
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
            onSlideChange={(s) => {
              setActiveImageIndex(s.activeIndex);
              if (isLightboxOpen) {
                setLightboxIndex(s.activeIndex);
              }
            }}
            className="product-swiper w-full max-w-[510px]"
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
                {item.type === "video" ? (
                  <div 
                    className="relative flex justify-center items-center w-full aspect-[3/4] overflow-hidden bg-gray-50 rounded-lg"
                    style={{ 
                      WebkitUserSelect: 'none',
                      userSelect: 'none',
                      WebkitTouchCallout: 'none'
                    }}
                  >
                    <video
                      className="object-cover w-full h-full"
                      src={`/api/images/${item.url}`}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      style={{ 
                        WebkitUserSelect: 'none',
                        userSelect: 'none',
                        pointerEvents: 'auto'
                      }}
                    />
                    {/* Badges */}
                    {i === 0 && (
                      <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                        {product.isPopular && (
                          <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-md">
                            Популярний
                          </span>
                        )}
                        {product.isRecommended && (
                          <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-md">
                            Рекомендуємо
                          </span>
                        )}
                        {product.hasStrongEffect && (
                          <span className="bg-orange-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-md">
                            Потужний ефект!
                          </span>
                        )}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleOpenLightbox(i)}
                      className="absolute bottom-3 right-3 rounded-full bg-black/60 text-white text-xs px-3 py-1 hover:bg-black/80 transition-colors"
                    >
                      Переглянути
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenLightbox(i)}
                    className="group relative flex justify-center items-center w-full aspect-[3/4] overflow-hidden bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                    style={{ 
                      WebkitUserSelect: 'none',
                      userSelect: 'none',
                      WebkitTouchCallout: 'none'
                    }}
                  >
                    <Image
                      src={`/api/images/${item.url}`}
                      alt={`${product.name} - зображення ${i + 1}`}
                      fill
                      priority={i === activeImageIndex}
                      quality={i === activeImageIndex ? 90 : 80}
                      className="object-cover"
                      sizes="(max-width: 1024px) 80vw, 50vw"
                      style={{ 
                        WebkitUserSelect: 'none',
                        userSelect: 'none',
                        pointerEvents: 'auto'
                      }}
                      draggable={false}
                    />
                    {/* Badges */}
                    {i === 0 && (
                      <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                        {product.isPopular && (
                          <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-md">
                            Популярний
                          </span>
                        )}
                        {product.isRecommended && (
                          <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-md">
                            Рекомендуємо
                          </span>
                        )}
                        {product.hasStrongEffect && (
                          <span className="bg-orange-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-md">
                            Потужний ефект!
                          </span>
                        )}
                      </div>
                    )}
                    <span className="absolute bottom-3 right-3 rounded-full bg-black/60 text-white text-xs px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Переглянути
                    </span>
                  </button>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {media.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center w-8 h-8 border-2 border-gray-600 rounded-full bg-white backdrop-blur-sm hover:bg-gray-50 transition-all shadow-md"
              >
                <svg 
                  className="w-4 h-4 text-gray-900" 
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
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center w-8 h-8 border-2 border-gray-600 rounded-full bg-white backdrop-blur-sm hover:bg-gray-50 transition-all shadow-md"
              >
                <svg 
                  className="w-4 h-4 text-gray-900" 
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
        <div className="flex flex-col gap-6 md:gap-8 px-4 md:px-0 w-full lg:w-1/2">
          {/* Product Name */}
          <div className={`text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
            {product.name}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-gray-400">
            {product.discount_percentage && product.old_price ? (
              <>
                <span className="text-2xl md:text-3xl font-bold text-[#FFA500]">
                  {Math.round(product.price * (1 - product.discount_percentage / 100))} ₴
                </span>
                <span className="text-lg text-gray-600 line-through">
                  {product.price} ₴
                  </span>
                <span className="text-sm font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
                    -{product.discount_percentage}%
                  </span>
              </>
              ) : (
              <span className="text-2xl md:text-3xl font-bold text-[#FFA500]">
                {product.price} ₴
              </span>
              )}
          </div>

          {/* Flavor Picker */}
          {(product.colors && product.colors.length > 0) || relatedProducts.length > 0 ? (
            <div className="flex flex-col gap-3">
              <div className="text-sm md:text-base font-semibold text-gray-900 uppercase tracking-tight">
                Смак
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
                        className={`relative w-10 h-10 md:w-11 md:h-11 rounded-full border-2 transition-all duration-200 ${
                          isActive
                            ? "border-gray-900 scale-110 shadow-md"
                            : "border-gray-500 hover:border-gray-700"
                        }`}
                        aria-label={c.label}
                        title={c.label}
                        style={{ 
                          backgroundColor: c.hex || "#ffffff",
                        }}
                      >
                        {isActive && (
                          <div className="absolute inset-0 rounded-full border-2 border-gray-900"></div>
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
                      className={`relative w-10 h-10 md:w-11 md:h-11 rounded-full border-2 border-gray-500 transition-all duration-200 hover:border-gray-700 cursor-pointer ${
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
                <div className="text-sm font-medium text-gray-900 tracking-wide">
                  {selectedColor}
                </div>
              )}
            </div>
          ) : null}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full text-center rounded-lg bg-[#FFA500] text-white hover:bg-[#ff8c00] py-4 px-6 text-base md:text-lg font-semibold uppercase tracking-wide transition-all duration-200 cursor-pointer hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]"
          >
            Додати до кошика
          </button>

          {/* Telegram Manager Link */}
          <a
            href={BRAND.socials.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center border-2 border-gray-600 text-gray-900 hover:border-gray-900 hover:text-gray-900 rounded-lg py-3 px-6 text-sm md:text-base font-medium cursor-pointer transition-all duration-200"
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
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="w-full border-t border-gray-300 bg-gray-50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12">
          <nav className="flex justify-around flex-wrap gap-4 md:gap-6 py-4 overflow-x-auto">
            <a
              href="#overview"
              onClick={(e) => handleNavClick(e, "overview")}
              className={`text-sm md:text-base font-medium whitespace-nowrap px-3 py-2 rounded-lg transition-all duration-200 ${
                activeSection === "overview"
                  ? "text-[#FFA500] bg-orange-50 font-semibold"
                  : "text-gray-700 hover:text-[#FFA500] hover:bg-gray-100"
              }`}
            >
              Огляд товару
            </a>
            <a
              href="#specifications"
              onClick={(e) => handleNavClick(e, "specifications")}
              className={`text-sm md:text-base font-medium whitespace-nowrap px-3 py-2 rounded-lg transition-all duration-200 ${
                activeSection === "specifications"
                  ? "text-[#FFA500] bg-orange-50 font-semibold"
                  : "text-gray-700 hover:text-[#FFA500] hover:bg-gray-100"
              }`}
            >
              Характеристики
            </a>
            <a
              href="#buyer-info"
              onClick={(e) => handleNavClick(e, "buyer-info")}
              className={`text-sm md:text-base font-medium whitespace-nowrap px-3 py-2 rounded-lg transition-all duration-200 ${
                activeSection === "buyer-info"
                  ? "text-[#FFA500] bg-orange-50 font-semibold"
                  : "text-gray-700 hover:text-[#FFA500] hover:bg-gray-100"
              }`}
            >
              Інформація покупцю
            </a>
            <a
              href="#reviews"
              onClick={(e) => handleNavClick(e, "reviews")}
              className={`text-sm md:text-base font-medium whitespace-nowrap px-3 py-2 rounded-lg transition-all duration-200 ${
                activeSection === "reviews"
                  ? "text-[#FFA500] bg-orange-50 font-semibold"
                  : "text-gray-700 hover:text-[#FFA500] hover:bg-gray-100"
              }`}
            >
              Відгуки
            </a>
            <a
              href="#similar"
              onClick={(e) => handleNavClick(e, "similar")}
              className={`text-sm md:text-base font-medium whitespace-nowrap px-3 py-2 rounded-lg transition-all duration-200 ${
                activeSection === "similar"
                  ? "text-[#FFA500] bg-orange-50 font-semibold"
                  : "text-gray-700 hover:text-[#FFA500] hover:bg-gray-100"
              }`}
            >
              Схожі товари
            </a>
          </nav>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-[1920px] w-full mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
        {/* Section 1: Огляд товару */}
        <section id="overview" className="scroll-mt-24 mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Огляд товару
          </h2>
          {product.description ? (
            <div className="text-sm md:text-base text-gray-800 leading-relaxed">
              {product.description}
            </div>
          ) : (
            <p className="text-gray-600">Опис товару відсутній.</p>
          )}
        </section>

        {/* Section 2: Характеристики */}
        <section id="specifications" className="scroll-mt-24 mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Характеристики
          </h2>
          {(product.effect || product.inhalationCount || product.volume || 
            product.composition || product.deviceType || product.manufacturer ||
            product.cbdContentMg || product.thcContentMg) ? (
            <div className="space-y-4 text-sm md:text-base text-gray-800">
              {product.effect && (
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 pb-3 border-b border-gray-200">
                  <span className="font-semibold min-w-[200px]">Ефект:</span>
                  <span>{product.effect}</span>
                </div>
              )}
              {product.inhalationCount && (
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 pb-3 border-b border-gray-200">
                  <span className="font-semibold min-w-[200px]">Кількість інгаляцій:</span>
                  <span>{product.inhalationCount}</span>
                </div>
              )}
              {product.volume && (
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 pb-3 border-b border-gray-200">
                  <span className="font-semibold min-w-[200px]">Об&apos;єм:</span>
                  <span>{product.volume}</span>
                </div>
              )}
              {product.composition && (
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 pb-3 border-b border-gray-200">
                  <span className="font-semibold min-w-[200px]">Склад:</span>
                  <span className="whitespace-pre-line">{product.composition}</span>
                </div>
              )}
              {product.deviceType && (
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 pb-3 border-b border-gray-200">
                  <span className="font-semibold min-w-[200px]">Тип пристрою:</span>
                  <span>{product.deviceType}</span>
                </div>
              )}
              {product.manufacturer && (
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 pb-3 border-b border-gray-200">
                  <span className="font-semibold min-w-[200px]">Виробник:</span>
                  <span>{product.manufacturer}</span>
                </div>
              )}
              {product.cbdContentMg !== undefined && product.cbdContentMg > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 pb-3 border-b border-gray-200">
                  <span className="font-semibold min-w-[200px]">Вміст CBD:</span>
                  <span>{product.cbdContentMg} мг</span>
                </div>
              )}
              {product.thcContentMg !== undefined && product.thcContentMg !== null && (
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 pb-3 border-b border-gray-200">
                  <span className="font-semibold min-w-[200px]">Вміст THC:</span>
                  <span>{product.thcContentMg} мг</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">Характеристики товару відсутні.</p>
          )}
        </section>

        {/* Section 3: Інформація покупцю */}
        <section id="buyer-info" className="scroll-mt-24 mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Інформація покупцю
          </h2>
          <div className="space-y-6 text-sm md:text-base text-gray-800">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Доставка</h3>
              <p className="text-gray-700">
                Доставка здійснюється по всій Україні через Нову Пошту та інші служби доставки. 
                Терміни доставки: 1-3 робочі дні. Вартість доставки розраховується при оформленні замовлення.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Оплата</h3>
              <p className="text-gray-700">
                Приймаємо оплату готівкою при отриманні, банківськими картками онлайн, 
                а також через платіжні системи. Всі платежі захищені.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Гарантія та повернення</h3>
              <p className="text-gray-700">
                Ми гарантуємо якість всіх товарів. У разі виявлення дефектів або невідповідності 
                товару опису, ви можете повернути товар протягом 14 днів з моменту отримання.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Контакти</h3>
              <p className="text-gray-700">
                Якщо у вас виникли питання, зверніться до нашого менеджера через Telegram 
                або інші канали зв&apos;язку, вказані на сайті.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Відгуки */}
        <section id="reviews" className="scroll-mt-24 mb-12 md:mb-16">
          <ProductReviews productId={product.id} />
        </section>

        {/* Section 5: Схожі товари */}
        <section id="similar" className="scroll-mt-24 mb-12 md:mb-16">
          <SimilarProducts 
            productId={product.id} 
            categoryName={product.category?.name}
          />
        </section>
      </div>

      {isLightboxOpen && (
        <ProductLightbox
          media={media}
          initialIndex={lightboxIndex}
          onClose={() => setIsLightboxOpen(false)}
          onIndexChange={(index) => {
            setLightboxIndex(index);
            setActiveImageIndex(index);
            swiper?.slideTo(index);
          }}
        />
      )}
    </section>
  );
}
