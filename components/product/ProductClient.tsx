"use client";

import { useState, useEffect } from "react";
import { useBasket } from "@/lib/BasketProvider";
import Image from "next/image";
import Alert from "@/components/shared/Alert";
import { getFirstProductImage, getImageUrl } from "@/lib/getFirstProductImage";
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
    colors?: { label: string; hex?: string | null; isAvailable?: boolean }[];
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
  const [quantity, setQuantity] = useState(1);

  // Auto-select first available color if available
  useEffect(() => {
    if (product?.colors && product.colors.length > 0 && !selectedColor) {
      const firstAvailable = product.colors.find(c => c.isAvailable !== false);
      if (firstAvailable) {
        setSelectedColor(firstAvailable.label);
      } else if (product.colors[0]) {
        // If no available colors, select first one anyway (for display)
      setSelectedColor(product.colors[0].label);
      }
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
    // Check if selected color is available
    if (selectedColor) {
      const selectedColorData = product?.colors?.find(c => c.label === selectedColor);
      if (selectedColorData && selectedColorData.isAvailable === false) {
        setAlertMessage("Цей смак зараз недоступний");
        setAlertType("warning");
        setTimeout(() => setAlertMessage(null), 3000);
        return;
      }
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
      quantity: quantity,
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
          style={{ touchAction: 'pan-y pinch-zoom', zIndex: 1, padding: '40px', overflow: 'visible' }}
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
            className="product-swiper w-full max-w-[360px] overflow-hidden"
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
              <SwiperSlide key={i} style={{ touchAction: 'pan-y pinch-zoom' }} className="overflow-hidden">
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
                      src={getImageUrl(item.url)}
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
                      <div className="absolute top-3 left-3 flex flex-col gap-2 z-30">
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
                      className="absolute bottom-3 right-3 rounded-full bg-black/60 text-white text-xs px-3 py-1 hover:bg-black/80 transition-colors z-30"
                    >
                      Переглянути
                    </button>
                  </div>
                ) : (
                  <div className="relative w-full aspect-[3/4] p-6 overflow-visible">
                    <button
                      type="button"
                      onClick={() => handleOpenLightbox(i)}
                      className="group relative w-full h-full bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 overflow-visible"
                      style={{ 
                        WebkitUserSelect: 'none',
                        userSelect: 'none',
                        WebkitTouchCallout: 'none'
                      }}
                    >
                      <div className="absolute inset-0 overflow-visible">
                        <Image
                          src={getImageUrl(item.url)}
                          alt={`${product.name} - зображення ${i + 1}`}
                          fill
                          priority={i === activeImageIndex}
                          quality={i === activeImageIndex ? 90 : 80}
                          className="object-cover rounded-lg transition-transform duration-300 ease-out group-hover:scale-[1.25]"
                          sizes="(max-width: 1024px) 80vw, 50vw"
                          style={{ 
                            WebkitUserSelect: 'none',
                            userSelect: 'none',
                            pointerEvents: 'auto',
                            transformOrigin: 'center center',
                            zIndex: 50
                      }}
                      draggable={false}
                    />
                      </div>
                    {/* Badges */}
                    {i === 0 && (
                      <div className="absolute top-3 left-3 flex flex-col gap-2 z-30">
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
                    <span className="absolute bottom-3 right-3 rounded-full bg-black/60 text-white text-xs px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                      Переглянути
                    </span>
                  </button>
                  </div>
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

          {/* Availability Status & Price Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b-2 border-gray-300">
            {/* Availability Status */}
            {(() => {
              const hasAvailableColors = product.colors?.some(c => c.isAvailable !== false);
              const isAvailable = !product.colors || product.colors.length === 0 || hasAvailableColors;
              
              return (
                <div className="flex items-center gap-2">
                  {isAvailable ? (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-bold shadow-sm">
                      <span className="w-2.5 h-2.5 bg-green-600 rounded-full animate-pulse"></span>
                      В наявності
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-bold shadow-sm">
                      <span className="w-2.5 h-2.5 bg-red-600 rounded-full"></span>
                      Немає в наявності
                    </span>
                  )}
                </div>
              );
            })()}

          {/* Price */}
            <div className="flex items-baseline gap-3">
            {product.discount_percentage && product.old_price ? (
              <>
                  <span className="text-3xl md:text-4xl font-bold text-[#FFA500]">
                  {Math.round(product.price * (1 - product.discount_percentage / 100))} ₴
                </span>
                  <span className="text-xl text-gray-500 line-through">
                  {product.price} ₴
                  </span>
                  <span className="text-sm font-bold text-white bg-green-600 px-3 py-1 rounded-full shadow-sm">
                    -{product.discount_percentage}%
                  </span>
              </>
              ) : (
                <span className="text-3xl md:text-4xl font-bold text-[#FFA500]">
                {product.price} ₴
              </span>
              )}
            </div>
          </div>

          {/* Short Description */}
          {product.description && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
              <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Опис
              </div>
              <div className="text-sm md:text-base text-gray-800 leading-relaxed">
                {(() => {
                  // Беремо перші 2-3 речення або перші 200 символів
                  const sentences = product.description.split(/[.!?]+/).filter(s => s.trim().length > 0);
                  if (sentences.length >= 2) {
                    const shortDesc = sentences.slice(0, 3).join('. ').trim();
                    return shortDesc ? shortDesc + '.' : product.description.substring(0, 200);
                  }
                  return product.description.length > 200 
                    ? product.description.substring(0, 200) + '...' 
                    : product.description;
                })()}
              </div>
            </div>
          )}

          {/* Effect */}
          {product.effect && (
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border-2 border-orange-200">
              <div className="text-sm font-bold text-orange-900 uppercase tracking-wide mb-2">Ефект</div>
              <div className="text-base md:text-lg text-gray-900 font-medium">{product.effect}</div>
            </div>
          )}

          {/* Characteristics - Compact View */}
          {(product.inhalationCount || product.volume || product.composition || 
            product.deviceType || product.manufacturer || 
            product.cbdContentMg || product.thcContentMg) && (
            <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-sm">
              <div className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wide">Характеристики</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {product.inhalationCount && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 p-2 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-600">Інгаляції:</span>
                    <span className="font-medium text-gray-900">{product.inhalationCount}</span>
                  </div>
                )}
                {product.volume && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 p-2 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-600">Об'єм:</span>
                    <span className="font-medium text-gray-900">{product.volume}</span>
                  </div>
                )}
                {product.deviceType && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 p-2 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-600">Тип:</span>
                    <span className="font-medium text-gray-900">{product.deviceType}</span>
                  </div>
                )}
                {product.manufacturer && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 p-2 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-600">Виробник:</span>
                    <span className="font-medium text-gray-900">{product.manufacturer}</span>
                  </div>
                )}
                {product.cbdContentMg !== undefined && product.cbdContentMg > 0 && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 p-2 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-600">CBD:</span>
                    <span className="font-medium text-gray-900">{product.cbdContentMg} мг</span>
                  </div>
                )}
                {product.thcContentMg !== undefined && product.thcContentMg !== null && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 p-2 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-600">THC:</span>
                    <span className="font-medium text-gray-900">{product.thcContentMg} мг</span>
                  </div>
                )}
                {product.composition && (
                  <div className="col-span-1 sm:col-span-2 pt-3 border-t-2 border-gray-200">
                    <div className="font-semibold text-gray-600 mb-2">Склад:</div>
                    <div className="text-sm leading-relaxed text-gray-700 bg-gray-50 p-3 rounded-lg">{product.composition}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Flavor Picker */}
          {(product.colors && product.colors.length > 0) || relatedProducts.length > 0 ? (
            <div className="flex flex-col gap-4">
              <div className="text-base md:text-lg font-bold text-gray-900">
                Доступні смаки
              </div>
              
              {/* Collect all flavors from current product and related products */}
              {(() => {
                const allFlavors: Array<{
                  label: string;
                  hex?: string | null;
                  isAvailable: boolean;
                  isCurrentProduct: boolean;
                  productId?: number;
                }> = [];

                // Add current product flavors
                if (product.colors && product.colors.length > 0) {
                  product.colors.forEach((c) => {
                    allFlavors.push({
                      label: c.label,
                      hex: c.hex,
                      isAvailable: c.isAvailable !== false,
                      isCurrentProduct: true,
                    });
                  });
                }

                // Add related products flavors (only if not already in list)
                relatedProducts.forEach((relatedProduct) => {
                  if (relatedProduct.first_color) {
                  const color = relatedProduct.first_color;
                    const exists = allFlavors.some(f => f.label === color.label);
                    if (!exists) {
                      allFlavors.push({
                        label: color.label,
                        hex: color.hex,
                        isAvailable: true, // Related products are clickable, so assume available
                        isCurrentProduct: false,
                        productId: relatedProduct.id,
                      });
                    }
                  }
                });

                // Separate available and unavailable
                const availableFlavors = allFlavors.filter(f => f.isAvailable);
                const unavailableFlavors = allFlavors.filter(f => !f.isAvailable);

                return (
                  <div className="space-y-4">
                    {/* Available Flavors */}
                    {availableFlavors.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          В наявності ({availableFlavors.length})
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {availableFlavors.map((flavor, idx) => {
                            const isActive = selectedColor === flavor.label;
                  return (
                    <button
                                key={`available-${flavor.label}-${idx}`}
                      type="button"
                                onClick={() => {
                                  if (flavor.isCurrentProduct) {
                                    setSelectedColor(flavor.label);
                                  } else if (flavor.productId) {
                                    handleColorVariantChange(flavor.productId);
                                  }
                                }}
                                disabled={isLoading && !flavor.isCurrentProduct}
                                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
                                  isActive
                                    ? "border-[#FFA500] bg-orange-50 shadow-md"
                                    : "border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50"
                                } ${isLoading && !flavor.isCurrentProduct ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                              >
                                <span
                                  className="w-6 h-6 rounded-full border border-gray-300 flex-shrink-0"
                                  style={{ backgroundColor: flavor.hex || "#ffffff" }}
                                />
                                <span className={`text-sm font-medium flex-1 text-left ${
                                  isActive ? "text-gray-900" : "text-gray-700"
                                }`}>
                                  {flavor.label}
                                </span>
                                {isActive && (
                                  <span className="text-[#FFA500] text-xs">✓</span>
                                )}
                              </button>
                  );
                })}
              </div>
                      </div>
                    )}

                    {/* Unavailable Flavors */}
                    {unavailableFlavors.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Немає в наявності ({unavailableFlavors.length})
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {unavailableFlavors.map((flavor, idx) => (
                            <div
                              key={`unavailable-${flavor.label}-${idx}`}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-gray-200 bg-gray-50 opacity-60"
                            >
                              <span
                                className="w-6 h-6 rounded-full border border-gray-300 flex-shrink-0"
                                style={{ backgroundColor: flavor.hex || "#ffffff" }}
                              />
                              <span className="text-sm font-medium text-gray-500 line-through">
                                {flavor.label}
                              </span>
                            </div>
                          ))}
                        </div>
                </div>
              )}
                  </div>
                );
              })()}
            </div>
          ) : null}

          {/* Quantity Selector */}
          <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-sm">
            <div className="text-base font-bold text-gray-900 mb-3 uppercase tracking-wide">
              Кількість
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-gray-500 hover:bg-gray-50 flex items-center justify-center text-xl font-bold text-gray-700 transition-all shadow-sm"
              >
                −
              </button>
              <span className="w-20 text-center text-2xl font-bold text-gray-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(3, quantity + 1))}
                className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-gray-500 hover:bg-gray-50 flex items-center justify-center text-xl font-bold text-gray-700 transition-all shadow-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          {(() => {
            const selectedColorData = product?.colors?.find(c => c.label === selectedColor);
            const isSelectedColorAvailable = !selectedColor || !selectedColorData || selectedColorData.isAvailable !== false;
            const hasColors = product?.colors && product.colors.length > 0;
            const canAddToCart = !hasColors || (selectedColor && isSelectedColorAvailable);
            
            return (
          <button
            onClick={handleAddToCart}
                disabled={!canAddToCart}
                className={`w-full text-center rounded-xl py-5 px-6 text-lg md:text-xl font-bold uppercase tracking-wide transition-all duration-200 shadow-lg ${
                  canAddToCart
                    ? "bg-gradient-to-r from-[#FFA500] to-[#ff8c00] text-white hover:from-[#ff8c00] hover:to-[#FFA500] cursor-pointer hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] transform"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                }`}
              >
                {canAddToCart ? "Додати до кошика" : "Оберіть доступний смак"}
          </button>
            );
          })()}

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
