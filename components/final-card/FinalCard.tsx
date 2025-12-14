"use client";

import { useEffect, useState } from "react";
import { useBasket } from "@/lib/BasketProvider";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Mousewheel } from "swiper/modules";
import "swiper/css/scrollbar";
import { getImageUrl } from "@/lib/getFirstProductImage";

// interface Product {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   created_at: Date;
//   sizes: { size: string }[];
//   top_sale?: boolean;
//   limited_edition?: boolean;
//   category_name?: string;
// }

export default function FinalCard() {
  // GENERAL
  const { items, updateQuantity, removeItem, clearBasket } = useBasket();

  // CUSTOMER
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("nova_poshta_branch");
  const [city, setCity] = useState("");
  const [postOffice, setPostOffice] = useState("");
  // Auto-fill showroom address when selected
  useEffect(() => {
    if (deliveryMethod === "showroom_pickup") {
      setCity("Київ");
      setPostOffice("Самовивіз: вул. Костянтинівська, 21 (13:00–19:00)");
    } else {
      // Для способів Нової пошти не фіксуємо місто за замовчуванням
      setCity("");
      setPostOffice("");
    }
  }, [deliveryMethod]);

  // Track InitiateCheckout event for Meta Pixel when component mounts with items
  useEffect(() => {
    if (items.length > 0 && typeof window !== 'undefined' && window.fbq) {
      const totalValue = items.reduce((total: number, item) => {
        const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        const discount = item.discount_percentage 
          ? (typeof item.discount_percentage === 'string' ? parseFloat(item.discount_percentage) : item.discount_percentage)
          : 0;
        const price = discount > 0 ? itemPrice * (1 - discount / 100) : itemPrice;
        return total + price * item.quantity;
      }, 0);

      window.fbq('track', 'InitiateCheckout', {
        content_ids: items.map(item => String(item.id)),
        content_type: 'product',
        value: totalValue,
        currency: 'UAH',
        num_items: items.reduce((sum, item) => sum + item.quantity, 0)
      });
    }
  }, [items]); // Track when basket changes

  const [comment, setComment] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeDiscount, setPromoCodeDiscount] = useState<number | null>(null);
  const [promoCodeError, setPromoCodeError] = useState<string | null>(null);
  const [validatingPromoCode, setValidatingPromoCode] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<{
    items: typeof items;
    customer: {
      name: string;
      email?: string;
      phone: string;
      city: string;
      postOffice: string;
      comment?: string;
      paymentType: string;
    };
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (
      !customerName ||
      !phoneNumber ||
      !deliveryMethod ||
      !city ||
      !postOffice
    ) {
      setError("Будь ласка, заповніть усі обов’язкові поля.");
      setLoading(false);
      return;
    }

    const trimmedName = customerName.trim();
    const nameParts = trimmedName.split(/\s+/);
    if (nameParts.length < 2) {
      setError("Введіть ім’я та прізвище повністю.");
      setLoading(false);
      return;
    }

    if (items.length === 0) {
      setError("Ваш кошик порожній.");
      setLoading(false);
      return;
    }

    // Формуємо товари для API (з урахуванням знижки)
    const apiItems = items.map((item) => {
      // Перетворюємо ціну в число
      const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      const discount = item.discount_percentage 
        ? (typeof item.discount_percentage === 'string' ? parseFloat(item.discount_percentage) : item.discount_percentage)
        : 0;
      
      const discountedPrice = discount > 0
        ? itemPrice * (1 - discount / 100)
        : itemPrice;

      return {
        product_id: item.id,
        product_name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: discountedPrice.toFixed(2), // передаємо кінцеву ціну
        original_price: itemPrice, // можна залишити для запису, якщо треба
        discount_percentage: discount || null,
        color: item.color || null,
      };
    });

    // Підрахунок суми до оплати (з урахуванням знижки товарів)
    const fullAmount = items.reduce((total: number, item) => {
      // Перетворюємо ціну в число
      const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      const discount = item.discount_percentage 
        ? (typeof item.discount_percentage === 'string' ? parseFloat(item.discount_percentage) : item.discount_percentage)
        : 0;
      
      const price = discount > 0
        ? itemPrice * (1 - discount / 100)
        : itemPrice;
      return total + price * item.quantity;
    }, 0);

    // Застосування знижки від промокоду
    let finalAmount = fullAmount;
    if (promoCodeDiscount && promoCode.trim()) {
      finalAmount = fullAmount * (1 - promoCodeDiscount / 100);
    }

    try {
      const requestBody = {
        customer_name: customerName,
        phone_number: phoneNumber,
        email: email || null,
        delivery_method: deliveryMethod,
        city,
        post_office: postOffice,
        comment,
        payment_type: paymentType,
        total_amount: finalAmount.toFixed(2),
        items: apiItems,
        promo_code: promoCode.trim() || null,
      };
      
      console.log("[FinalCard] Sending order request with:", JSON.stringify(requestBody, null, 2));
      
      // Надсилаємо дані замовлення
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log("[FinalCard] Response status:", response.status);
      console.log("[FinalCard] Response ok:", response.ok);

      if (!response.ok) {
        const data = await response.json();
        console.error("[FinalCard] Error response:", data);
        setError(data.error || "Помилка при оформленні замовлення.");
      } else {
        const data = await response.json();
        console.log("[FinalCard] Success response:", data);
        
        // Track Purchase event for Meta Pixel
        if (typeof window !== 'undefined' && window.fbq) {
          const totalValue = items.reduce((total: number, item) => {
            const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
            const discount = item.discount_percentage 
              ? (typeof item.discount_percentage === 'string' ? parseFloat(item.discount_percentage) : item.discount_percentage)
              : 0;
            const price = discount > 0 ? itemPrice * (1 - discount / 100) : itemPrice;
            return total + price * item.quantity;
          }, 0);

          window.fbq('track', 'Purchase', {
            content_ids: items.map(item => String(item.id)),
            content_type: 'product',
            value: totalValue,
            currency: 'UAH',
            num_items: items.reduce((sum: number, item) => sum + item.quantity, 0)
          });
        }

        localStorage.setItem(
          "submittedOrder",
          JSON.stringify({
            items,
            customer: {
              name: customerName,
              email,
              phone: phoneNumber,
              city,
              postOffice,
              comment,
              paymentType,
            },
            orderId: data.orderId,
          })
        );

        setSuccess("Замовлення підтверджено!");
        clearBasket();
        
        // Redirect to success page after 1 second
        setTimeout(() => {
          window.location.href = "/final";
        }, 1000);
      }
    } catch (error) {
      console.error("[FinalCard] Network error:", error);
      setError("Помилка мережі. Спробуйте пізніше.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedOrder = localStorage.getItem("submittedOrder");
    if (storedOrder) {
      setSubmittedOrder(JSON.parse(storedOrder));
      // localStorage.removeItem("submittedOrder");
    }
  }, []);

  // POST OFFICE
  const [cities, setCities] = useState<string[]>([]); // Available cities
  const [postOffices, setPostOffices] = useState<string[]>([]); // Available post offices
  const [loadingCities, setLoadingCities] = useState<boolean>(false); // Loading state for cities
  const [loadingPostOffices, setLoadingPostOffices] = useState<boolean>(false); // Loading state for post offices
  const [filteredCities, setFilteredCities] = useState<string[]>([]); // Filtered cities list for autocomplete
  const [filteredPostOffices, setFilteredPostOffices] = useState<string[]>([]); // Filtered post offices list for autocomplete
  const [cityListVisible, setCityListVisible] = useState(false);
  const [postOfficeListVisible, setPostOfficeListVisible] = useState(false);
  const [region] = useState(""); // For Ukrposhta - область
  const [district] = useState(""); // For Ukrposhta - район

  // Example useEffect for region and district fetching for Ukrposhta
  useEffect(() => {
    if (region) {
      setLoadingCities(true);
      // API call to fetch regions for Ukrposhta
      setLoadingCities(false);
    }
  }, [region]);

  useEffect(() => {
    if (district) {
      setLoadingPostOffices(true);
      // API call to fetch districts for Ukrposhta
      setLoadingPostOffices(false);
    }
  }, [district]);

  useEffect(() => {
    // Fetch available cities when delivery method changes to Nova Poshta
    if (deliveryMethod.startsWith("nova_poshta") || deliveryMethod === "ukrposhta") {
      setLoadingCities(true);

      fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: process.env.NEXT_PUBLIC_NOVA_POSHTA_API_KEY,
          modelName: "AddressGeneral",
          calledMethod: "getCities",
          methodProperties: {
            FindByString: city,
            limit: 20,
          },
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("City fetch response", data); // ✅ Add this
          if (data.success) {
            const cityData = data.data || [];
            setCities(
              cityData.map((c: { Description: string }) => c.Description)
            );
          } else {
            setCities([]);
            setError("Не вдалося знайти міста.");
          }
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setError("Помилка при завантаженні міст.");
        })
        .finally(() => {
          setLoadingCities(false);
        });
    }
  }, [deliveryMethod, city]);

  useEffect(() => {
    // Filter and sort the cities based on the current input
    const filtered = cities.filter((cityOption) =>
      cityOption.toLowerCase().includes(city.toLowerCase())
    );

    // Sort: exact matches first, then starts with, then contains
    const sorted = filtered.sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      const searchLower = city.toLowerCase();

      // Exact match
      if (aLower === searchLower) return -1;
      if (bLower === searchLower) return 1;

      // Starts with
      const aStarts = aLower.startsWith(searchLower);
      const bStarts = bLower.startsWith(searchLower);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // Alphabetical for remaining
      return a.localeCompare(b);
    });

    setFilteredCities(sorted);
  }, [city, cities]); // Re-filter cities whenever `city` or `cities` changes

  useEffect(() => {
    // Fetch available post offices when a city is selected
    if (city) {
      setLoadingPostOffices(true);

      // Fetch post offices with `fetch`
      fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey: process.env.NEXT_PUBLIC_NOVA_POSHTA_API_KEY, // Replace with your actual API Key
          modelName: "AddressGeneral",
          calledMethod: "getWarehouses",
          methodProperties: {
            CityName: city, // Use the selected city
            FindByString: postOffice,
            limit: 20,
          },
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          const postOfficeData = data.data || [];
          setPostOffices(
            postOfficeData.map(
              (post: { Description: unknown }) => post.Description
            )
          );
          // console.log(data);
        })
        .catch(() => {
          console.error("Error fetching post offices");
          setError("Failed to load post offices.");
        })
        .finally(() => {
          setLoadingPostOffices(false);
        });
    }
  }, [city, postOffice]);

  useEffect(() => {
    // Filter and sort the post offices based on the current input
    const filtered = postOffices.filter((postOfficeOption) =>
      postOfficeOption.toLowerCase().includes(postOffice.toLowerCase())
    );

    // Sort: exact matches first, then starts with, then contains
    const sorted = filtered.sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      const searchLower = postOffice.toLowerCase();

      // Exact match
      if (aLower === searchLower) return -1;
      if (bLower === searchLower) return 1;

      // Starts with
      const aStarts = aLower.startsWith(searchLower);
      const bStarts = bLower.startsWith(searchLower);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // Alphabetical for remaining
      return a.localeCompare(b);
    });

    setFilteredPostOffices(sorted);
  }, [postOffice, postOffices]); // Re-filter post offices whenever `postOffice` or `postOffices` changes

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
    setCityListVisible(true); // Show the city list while typing
  };

  const handlePostOfficeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostOffice(e.target.value);
    setPostOfficeListVisible(true); // Show the post office list while typing
  };

  const handleCitySelect = (cityOption: string) => {
    setCity(cityOption);
    setCityListVisible(false); // Hide the city list after selecting an option
  };

  const handlePostOfficeSelect = (postOfficeOption: string) => {
    setPostOffice(postOfficeOption);
    setPostOfficeListVisible(false); // Hide the post office list after selecting an option
  };

  // Validate promo code
  const validatePromoCode = async (code: string) => {
    if (!code.trim()) {
      setPromoCodeDiscount(null);
      setPromoCodeError(null);
      return;
    }

    setValidatingPromoCode(true);
    setPromoCodeError(null);

    try {
      const response = await fetch(`/api/promo-codes/validate?code=${encodeURIComponent(code.toUpperCase())}`);
      const data = await response.json();

      if (data.valid) {
        setPromoCodeDiscount(data.discount_percent);
        setPromoCodeError(null);
      } else {
        setPromoCodeDiscount(null);
        setPromoCodeError(data.error || "Невірний промокод");
      }
    } catch {
      setPromoCodeDiscount(null);
      setPromoCodeError("Помилка валідації промокоду");
    } finally {
      setValidatingPromoCode(false);
    }
  };

  // Debounce для валідації промокоду
  const [promoCodeTimeout, setPromoCodeTimeout] = useState<NodeJS.Timeout | null>(null);

  // Очищаємо таймер при розмонтуванні компонента
  useEffect(() => {
    return () => {
      if (promoCodeTimeout) {
        clearTimeout(promoCodeTimeout);
      }
    };
  }, [promoCodeTimeout]);

  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setPromoCode(code);
    
    // Очищаємо попередній таймер
    if (promoCodeTimeout) {
      clearTimeout(promoCodeTimeout);
    }
    
    // Якщо поле порожнє, одразу очищаємо помилки
    if (!code.trim()) {
      setPromoCodeDiscount(null);
      setPromoCodeError(null);
      return;
    }
    
    // Валідуємо через 500ms після останнього введення
    const timeout = setTimeout(() => {
      validatePromoCode(code);
    }, 500);
    
    setPromoCodeTimeout(timeout);
  };

  // STATE
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ⬇️ When order is completed
  if (items.length == 0 && submittedOrder) {
    const { items: orderItems, customer } = submittedOrder;

    return (
      <section className="max-w-[1280px] w-full mx-auto p-6 flex flex-col items-center gap-10">
        {/* Success Message */}
        <div className="w-full max-w-2xl bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 shadow-lg">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Замовлення підтверджено!
            </h1>
            <p className="text-xl text-gray-700 mt-2">
              Дякуємо за ваше замовлення
            </p>
            <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
              <p className="text-base text-gray-800 leading-relaxed">
                Ваше замовлення прийнято в обробку. Наш менеджер зв'яжеться з вами найближчим часом для підтвердження деталей та узгодження доставки.
              </p>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
            Ваше замовлення
          </h2>
        </div>

        {/* Layout container */}
        <div className="flex flex-col md:flex-row justify-around gap-10 w-full">
          {/* Vertical Swiper */}
          <div className="w-full md:w-1/2 h-[450px]">
            <Swiper
              direction="vertical"
              modules={[Mousewheel]}
              mousewheel
              spaceBetween={0}
              slidesPerView={2.5}
              className="h-full"
            >
              {orderItems.map((item, idx) => (
                <SwiperSlide key={`${item.id}-${item.size}-${idx}`}>
                  <div className="flex gap-4 items-start p-4 border border-stone-200 rounded">
                    {item.imageUrl ? (
                      <div className="relative w-20 h-28">
                        <Image
                          src={getImageUrl(item.imageUrl)}
                          alt={item.name}
                          width={80}
                          height={112}
                          className="object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-28 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Фото</span>
                      </div>
                    )}
                    <div className="flex flex-col flex-1 gap-1">
                      <div className="text-base font-['Inter'] ">
                        {item.name}
                      </div>
                      {item.color && (
                        <div className="text-base font-['Helvetica']">
                          Смак: {item.color}
                        </div>
                      )}
                      <div className="text-base  font-['Helvetica']">
                        Кількість: {item.quantity}x
                      </div>
                      <div className="text-base text-zinc-600 font-['Helvetica']">
                        {item.discount_percentage ? (
                          <div className="flex items-center gap-2">
                            {/* Discounted price */}
                            <span className="font-medium text-red-600">
                              {(
                                item.price *
                                (1 - item.discount_percentage / 100)
                              ).toFixed(2)}
                              ₴
                            </span>

                            {/* Original (crossed-out) price */}
                            <span className="text-gray-500 line-through">
                              {item.price}₴
                            </span>

                            {/* Optional: show discount percentage */}
                            <span className="text-green-600 text-sm">
                              -{item.discount_percentage}%
                            </span>
                          </div>
                        ) : (
                          <span className="font-medium">{item.price}₴</span>
                        )}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Customer Info */}
          <div className="flex flex-col justify-between gap-6 bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-gray-900 text-center mb-4">
              Дані клієнта
            </div>
            <div className="space-y-3 text-lg">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Ім'я:</span>
                <span className="text-gray-900">{customer.name}</span>
              </div>
              {customer.email && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-700">Email:</span>
                  <span className="text-gray-900">{customer.email}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Телефон:</span>
                <span className="text-gray-900">{customer.phone}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Місто:</span>
                <span className="text-gray-900">{customer.city}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Відділення:</span>
                <span className="text-gray-900 text-right max-w-xs">{customer.postOffice}</span>
              </div>
              {customer.comment && (
                <div className="flex flex-col gap-2 py-2">
                  <span className="font-semibold text-gray-700">Коментар:</span>
                  <span className="text-gray-900">{customer.comment}</span>
                </div>
              )}
            </div>
            {/* Back to home */}
            <Link
              href="/"
              className="w-full mt-6 h-14 bg-gradient-to-r from-[#FFA500] to-[#ff8c00] text-white inline-flex justify-center items-center gap-2.5 rounded-xl font-semibold text-lg hover:from-[#ff8c00] hover:to-[#FFA500] transition-all shadow-lg hover:shadow-xl"
            >
              На головну
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-[1922px] w-full mx-auto relative overflow-hidden px-4 sm:px-6 lg:px-8">
      {items.length == 0 ? (
        <div className="py-12 px-4 sm:py-20 flex flex-col items-center gap-10 sm:gap-14 w-full max-w-2xl mx-auto">
          <Image
            src="/images/light-theme/basket.svg"
            alt="shopping basket icon"
            width={200}
            height={200}
          />
          <span className="text-center text-2xl sm:text-4xl md:text-6xl font-normal font-['Inter'] leading-tight sm:leading-[64.93px]">
            Ваш кошик порожній
          </span>
          <Link
            href="/catalog"
            className="bg-stone-900 text-stone-100 w-full sm:w-80 h-14 sm:h-16 px-6 py-3 inline-flex items-center justify-center gap-2.5 text-base sm:text-xl text-center"
          >
            Продовжити покупки
          </Link>
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                Оформлення замовлення
              </h1>
              <p className="text-lg text-gray-600">
                Заповніть форму нижче для завершення замовлення
              </p>
            </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 w-full lg:w-2/3 bg-white rounded-2xl p-6 md:p-8 border-2 border-gray-200 shadow-lg"
              noValidate
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label
                    htmlFor="name"
                    className="block text-base font-semibold text-gray-900 mb-2"
                  >
                    Ім'я та прізвище *
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Ваше імʼя та прізвище"
                    className="w-full border-2 border-gray-300 rounded-lg p-4 text-base focus:outline-none focus:border-[#FFA500] transition-colors"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-base font-semibold text-gray-900 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Ваш Email"
                    className="w-full border-2 border-gray-300 rounded-lg p-4 text-base focus:outline-none focus:border-[#FFA500] transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-base font-semibold text-gray-900 mb-2"
                  >
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="+380XXXXXXXXX"
                    pattern="^\+?\d{10,15}$"
                    title="Введіть номер телефону у форматі +380xxxxxxxxx"
                    className="w-full border-2 border-gray-300 rounded-lg p-4 text-base focus:outline-none focus:border-[#FFA500] transition-colors"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* Delivery Section */}
              <div className="border-t-2 border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Доставка</h3>
                
                <div className="mb-6">
                  <label
                    htmlFor="deliveryMethod"
                    className="block text-base font-semibold text-gray-900 mb-2"
                  >
                    Спосіб доставки *
                  </label>
                  <select
                    id="deliveryMethod"
                    className="w-full border-2 border-gray-300 rounded-lg p-4 text-base focus:outline-none focus:border-[#FFA500] transition-colors bg-white"
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    required
                  >
                    <option value="">Оберіть спосіб доставки</option>
                    <option value="nova_poshta_branch">
                      Нова пошта — у відділення
                    </option>
                    <option value="nova_poshta_locker">
                      Нова пошта — у поштомат
                    </option>
                    <option value="nova_poshta_courier">
                      Нова пошта — кур'єром
                    </option>
                    <option value="showroom_pickup">
                      Самовивіз з шоуруму (13:00–19:00)
                    </option>
                  </select>
                </div>

              {deliveryMethod.startsWith("nova_poshta") && (
                <>
                  <div className="mb-6">
                    <label
                      htmlFor="city"
                      className="block text-base font-semibold text-gray-900 mb-2"
                    >
                      {deliveryMethod === "nova_poshta_courier"
                        ? "Місто для доставки кур'єром *"
                        : "Місто *"}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="city"
                        value={city}
                        onChange={handleCityChange}
                        placeholder="Введіть назву міста"
                        className="w-full border-2 border-gray-300 rounded-lg p-4 text-base focus:outline-none focus:border-[#FFA500] transition-colors"
                        required
                      />
                      {loadingCities && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <div className="w-5 h-5 border-2 border-gray-300 border-t-[#FFA500] rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    {!loadingCities && cityListVisible && filteredCities.length > 0 && (
                      <div className="max-h-48 overflow-y-auto shadow-lg rounded-lg border-2 border-gray-200 mt-2 bg-white z-10">
                        <ul className="list-none p-0">
                          {filteredCities.map((cityOption, idx) => (
                            <li
                              key={idx}
                              className="p-3 cursor-pointer hover:bg-orange-50 border-b border-gray-100 last:border-b-0 transition-colors"
                              onClick={() => handleCitySelect(cityOption)}
                            >
                              {cityOption}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Post Office Input with Autocomplete */}
                  {deliveryMethod === "nova_poshta_courier" ? (
                    <div className="mb-6">
                      <label
                        htmlFor="postOffice"
                        className="block text-base font-semibold text-gray-900 mb-2"
                      >
                        Адреса доставки (вулиця, будинок, квартира) *
                      </label>
                      <input
                        type="text"
                        id="postOffice"
                        value={postOffice}
                        onChange={(e) => setPostOffice(e.target.value)}
                        placeholder="Напр.: вул. Січових Стрільців, 10, кв. 25"
                        className="w-full border-2 border-gray-300 rounded-lg p-4 text-base focus:outline-none focus:border-[#FFA500] transition-colors"
                        required
                      />
                    </div>
                  ) : (
                    <div className="mb-6">
                      <label
                        htmlFor="postOffice"
                        className="block text-base font-semibold text-gray-900 mb-2"
                      >
                        {deliveryMethod === "nova_poshta_locker"
                          ? "Поштомат *"
                          : "Відділення *"}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="postOffice"
                          value={postOffice}
                          onChange={handlePostOfficeChange}
                          placeholder={
                            deliveryMethod === "nova_poshta_locker"
                              ? "Введіть назву поштомата"
                              : "Введіть назву відділення"
                          }
                          className="w-full border-2 border-gray-300 rounded-lg p-4 text-base focus:outline-none focus:border-[#FFA500] transition-colors"
                          required
                        />
                        {loadingPostOffices && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-[#FFA500] rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      {!loadingPostOffices && postOfficeListVisible && filteredPostOffices.length > 0 && (
                        <div className="max-h-48 overflow-y-auto shadow-lg rounded-lg border-2 border-gray-200 mt-2 bg-white z-10">
                          <ul className="list-none p-0">
                            {filteredPostOffices.map(
                              (postOfficeOption, idx) => (
                                <li
                                  key={idx}
                                  className="p-3 cursor-pointer hover:bg-orange-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                  onClick={() =>
                                    handlePostOfficeSelect(postOfficeOption)
                                  }
                                >
                                  {postOfficeOption}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {deliveryMethod === "showroom_pickup" && (
                <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <p className="text-base text-gray-800 font-medium">
                    📍 Самовивіз з шоуруму з 13:00 до 19:00
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Київ, вул. Костянтинівська, 21
                  </p>
                </div>
              )}
              </div>

              {/* Payment & Promo Section */}
              <div className="border-t-2 border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Оплата</h3>
                
                <div className="mb-6">
                  <label
                    htmlFor="paymentType"
                    className="block text-base font-semibold text-gray-900 mb-2"
                  >
                    Спосіб оплати *
                  </label>
                  <select
                    id="paymentType"
                    className="w-full border-2 border-gray-300 rounded-lg p-4 text-base focus:outline-none focus:border-[#FFA500] transition-colors bg-white"
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    required
                  >
                    <option value="">Оберіть спосіб оплати</option>
                    <option value="full">Повна оплата при отриманні</option>
                    <option value="prepay">Передоплата 300 ₴</option>
                    <option value="crypto">Криптовалюта</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="promoCode"
                    className="block text-base font-semibold text-gray-900 mb-2"
                  >
                    Промокод
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="promoCode"
                      placeholder="Введіть промокод"
                      className="flex-1 border-2 border-gray-300 rounded-lg p-4 text-base focus:outline-none focus:border-[#FFA500] transition-colors uppercase"
                      value={promoCode}
                      onChange={handlePromoCodeChange}
                      disabled={validatingPromoCode}
                    />
                  </div>
                  {validatingPromoCode && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Перевірка промокоду...</span>
                    </div>
                  )}
                  {promoCodeError && !validatingPromoCode && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                      <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>{promoCodeError}</span>
                    </div>
                  )}
                  {promoCodeDiscount && !promoCodeError && !validatingPromoCode && (
                    <div className="flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                      <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Промокод застосовано! Ваша знижка: <strong>{promoCodeDiscount}%</strong></span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="comment"
                  className="block text-base font-semibold text-gray-900 mb-2"
                >
                  Коментар до замовлення
                </label>
                <textarea
                  id="comment"
                  placeholder="Ваш коментар (опціонально)"
                  rows={3}
                  className="w-full border-2 border-gray-300 rounded-lg p-4 text-base focus:outline-none focus:border-[#FFA500] transition-colors resize-none"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Підтверджуючи замовлення, ви погоджуєтеся з{" "}
                  <Link href="/privacy-policy" className="text-[#FFA500] hover:underline font-medium">
                    політикою повернення, доставки та офертою
                  </Link>
                  .
                </p>
              </div>

              <button
                className="w-full bg-gradient-to-r from-[#FFA500] to-[#ff8c00] text-white p-5 rounded-xl font-bold text-lg uppercase tracking-wide hover:from-[#ff8c00] hover:to-[#FFA500] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Відправка...
                  </span>
                ) : (
                  "Підтвердити замовлення"
                )}
              </button>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}
              {success && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <p className="text-green-700 font-medium">{success}</p>
                </div>
              )}
            </form>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg sticky top-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Ваше замовлення</h3>
                
                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                  {items.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Ваш кошик порожній</p>
                  ) : (
                    items.map((item) => (
                      <div
                        key={`${item.id}-${item.size}`}
                        className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <Image
                          className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                          src={getImageUrl(item.imageUrl)}
                          alt={item.name}
                          width={80}
                          height={112}
                        />
                        <div className="flex flex-col flex-1 gap-2 min-w-0">
                          <div className="text-base font-semibold text-gray-900 leading-tight">
                            {item.name}
                          </div>
                          {item.color && (
                            <div className="text-sm text-gray-600">
                              Смак: {item.color}
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-auto">
                            <div className="text-base font-bold text-gray-900">
                              {item.discount_percentage ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-[#FFA500]">
                                    {(
                                      item.price *
                                      (1 - item.discount_percentage / 100)
                                    ).toFixed(2)} ₴
                                  </span>
                                  <span className="text-gray-400 line-through text-sm">
                                    {item.price}₴
                                  </span>
                                  <span className="text-green-600 text-xs font-semibold">
                                    -{item.discount_percentage}%
                                  </span>
                                </div>
                              ) : (
                                <span>{item.price}₴</span>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 border-2 border-gray-300 rounded-lg">
                                <button
                                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                                  onClick={() =>
                                    updateQuantity(
                                      item.id,
                                      item.size,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={item.quantity <= 1}
                                >
                                  −
                                </button>
                                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                <button
                                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                                  onClick={() =>
                                    updateQuantity(
                                      item.id,
                                      item.size,
                                      item.quantity + 1
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>
                              <button
                                className="text-red-500 hover:text-red-700 transition-colors"
                                onClick={() => removeItem(item.id, item.size)}
                                title="Видалити"
                              >
                                <Image
                                  src={"/images/trashcan.svg"}
                                  width={24}
                                  height={24}
                                  alt="Видалити"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Total price container */}
                <div className="border-t-2 border-gray-300 pt-4 space-y-3">
                  {(() => {
                    const subtotal = items.reduce((total: number, item) => {
                      const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
                      const discount = item.discount_percentage 
                        ? (typeof item.discount_percentage === 'string' ? parseFloat(item.discount_percentage) : item.discount_percentage)
                        : 0;
                      const price = discount > 0
                        ? itemPrice * (1 - discount / 100)
                        : itemPrice;
                      return total + price * item.quantity;
                    }, 0);
                    
                    const discountAmount = promoCodeDiscount && promoCode.trim()
                      ? subtotal * (promoCodeDiscount / 100)
                      : 0;
                    
                    const finalTotal = subtotal - discountAmount;

                    return (
                      <>
                        <div className="flex justify-between text-base font-medium text-gray-700">
                          <span>Сума товарів</span>
                          <span>{subtotal.toFixed(2)} ₴</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between text-base font-medium text-green-600">
                            <span>Знижка ({promoCodeDiscount}%)</span>
                            <span>-{discountAmount.toFixed(2)} ₴</span>
                          </div>
                        )}
                        <div className="flex justify-between text-2xl font-bold text-gray-900 pt-3 border-t-2 border-gray-300">
                          <span>Всього</span>
                          <span className="text-[#FFA500]">{finalTotal.toFixed(2)} ₴</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
      )}
    </section>
  );
}
