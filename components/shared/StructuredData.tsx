import { BRAND } from "@/lib/brand";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://calipuff.ua';

interface StructuredDataProps {
  type?: 'organization' | 'website' | 'product' | 'breadcrumb' | 'faq' | 'reviews';
  product?: {
    name: string;
    description: string;
    price: number;
    image?: string;
    sku?: string;
    availability?: string;
  };
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export default function StructuredData({ 
  type = 'organization',
  product,
  breadcrumbs 
}: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": ["Organization", "LocalBusiness", "Store"],
          "name": BRAND.name,
          "url": baseUrl,
          "logo": `${baseUrl}/images/light-theme/calipuff-logo-header-light.svg`,
          "description": BRAND.shortDescription,
          "image": `${baseUrl}/images/hero-bg.png`,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "вул. Костянтинівська, 21",
            "addressLocality": "Київ",
            "addressRegion": "Київська область",
            "postalCode": "01001",
            "addressCountry": "UA"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "50.4501",
            "longitude": "30.5234"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": BRAND.contact.phone,
            "contactType": "customer service",
            "email": BRAND.contact.email,
            "availableLanguage": ["uk", "en"],
            "areaServed": "UA",
            "hoursAvailable": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
              ],
              "opens": "10:00",
              "closes": "20:00"
            }
          },
          "sameAs": [
            BRAND.socials.instagram,
            BRAND.socials.tiktok,
            BRAND.socials.telegram
          ],
          "priceRange": "$$",
          "currenciesAccepted": "UAH",
          "paymentAccepted": "Cash, Credit Card, Cryptocurrency"
        };

      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": BRAND.name,
          "url": baseUrl,
          "description": BRAND.shortDescription,
          "inLanguage": "uk-UA",
          "isAccessibleForFree": true,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/catalog?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": BRAND.name,
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/images/light-theme/calipuff-logo-header-light.svg`
            }
          }
        };

      case 'product':
        if (!product) return null;
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "description": product.description,
          "image": product.image ? [product.image] : [`${baseUrl}/images/hero-bg.png`],
          "sku": product.sku || product.name,
          "mpn": product.sku || product.name,
          "offers": {
            "@type": "Offer",
            "url": `${baseUrl}/product/${product.sku}`,
            "priceCurrency": "UAH",
            "price": product.price.toString(),
            "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            "availability": product.availability || "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {
              "@type": "Organization",
              "name": BRAND.name,
              "url": baseUrl
            },
            "shippingDetails": {
              "@type": "OfferShippingDetails",
              "shippingRate": {
                "@type": "MonetaryAmount",
                "value": "0",
                "currency": "UAH"
              },
              "shippingDestination": {
                "@type": "DefinedRegion",
                "addressCountry": "UA"
              },
              "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "businessDays": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                },
                "cutoffTime": "14:00",
                "handlingTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 1,
                  "maxValue": 2,
                  "unitCode": "DAY"
                },
                "transitTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 1,
                  "maxValue": 3,
                  "unitCode": "DAY"
                }
              }
            }
          },
          "brand": {
            "@type": "Brand",
            "name": BRAND.name,
            "logo": `${baseUrl}/images/light-theme/calipuff-logo-header-light.svg`
          },
          "manufacturer": {
            "@type": "Organization",
            "name": BRAND.name
          },
          "category": "Ароматичні девайси та аксесуари",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "reviewCount": "5",
            "bestRating": "5",
            "worstRating": "1"
          }
        };

      case 'breadcrumb':
        if (!breadcrumbs || breadcrumbs.length === 0) return null;
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": crumb.url
          }))
        };

      case 'faq':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Оплата | CALIPUFF",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Приймаємо банківські картки, рахунок-фактуру для компаній та еквайринг у шоурумі. Партнерські замовлення від 10 одиниць підтверджуємо 50% передоплатою."
              }
            },
            {
              "@type": "Question",
              "name": "Доставка | CALIPUFF",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Відправляємо по Україні Новою Поштою або курʼєром з Wave Lab у день підтвердження замовлення. Для HoReCa та ритейлу доступна регулярна відвантажувальна сітка."
              }
            },
            {
              "@type": "Question",
              "name": "Сертифікація та безпека | CALIPUFF",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Всі продукти проходять контроль якості та сертифікацію. Посилання на лабораторні звіти додаємо в особистому кабінеті партнера або за запитом."
              }
            },
            {
              "@type": "Question",
              "name": "Відправка та оновлення смаків | CALIPUFF",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Лімітовані серії виходять щомісяця. Резерв можна оформити завчасно — ми бронюємо партію та надсилаємо тест-кити для команди продажів."
              }
            }
          ]
        };

      case 'reviews':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": BRAND.name,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "reviewCount": "5",
            "bestRating": "5",
            "worstRating": "5"
          },
          "review": [
            {
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": "Олександр К."
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5",
                "bestRating": "5"
              },
              "reviewBody": "Найкращі ароматичні девайси, які я коли-небудь використовував! Аромати справді каліфорнійські, а якість на висоті. Рекомендую всім!"
            },
            {
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": "Марія В."
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5",
                "bestRating": "5"
              },
              "reviewBody": "Чудовий сервіс та швидка доставка. Лімітовані серії завжди унікальні. Дякую за таку якість!"
            }
          ]
        };

      default:
        return null;
    }
  };

  const data = getStructuredData();
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

