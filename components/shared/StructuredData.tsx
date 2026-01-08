import { BRAND } from "@/lib/brand";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://calipuff.ua';

interface StructuredDataProps {
  type?: 'organization' | 'website' | 'product' | 'breadcrumb' | 'faq' | 'reviews' | 'article';
  product?: {
    name: string;
    description: string;
    price: number;
    image?: string;
    sku?: string;
    availability?: string;
    cbdContentMg?: number;
    thcContentMg?: number | null;
    effect?: string | null;
    deviceType?: string | null;
    composition?: string | null;
    manufacturer?: string | null;
    category?: string | null;
  };
  breadcrumbs?: Array<{ name: string; url: string }>;
  reviews?: Array<{
    author: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  aggregateRating?: {
    ratingValue: string;
    reviewCount: string;
  };
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  article?: {
    headline: string;
    description: string;
    image: string;
    datePublished: string;
    dateModified: string;
    author: string;
    publisher: string;
    url?: string;
  };
}

export default function StructuredData({ 
  type = 'organization',
  product,
  breadcrumbs,
  reviews,
  aggregateRating,
  faq,
  article
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
        
        // Build additional properties
        const additionalProperties: Record<string, unknown> = {};
        
        // Add cannabinoid content
        if (product.cbdContentMg && product.cbdContentMg > 0) {
          additionalProperties["additionalProperty"] = [
            {
              "@type": "PropertyValue",
              "name": "CBD Content",
              "value": `${product.cbdContentMg} мг`,
              "valueReference": {
                "@type": "QuantitativeValue",
                "value": product.cbdContentMg,
                "unitCode": "MGM"
              }
            }
          ];
        }
        
        if (product.thcContentMg !== null && product.thcContentMg !== undefined) {
          if (!additionalProperties["additionalProperty"]) {
            additionalProperties["additionalProperty"] = [];
          }
          additionalProperties["additionalProperty"].push({
            "@type": "PropertyValue",
            "name": "THC Content",
            "value": `${product.thcContentMg} мг`,
            "valueReference": {
              "@type": "QuantitativeValue",
              "value": product.thcContentMg,
              "unitCode": "MGM"
            }
          });
        }
        
        // Add effect
        if (product.effect) {
          if (!additionalProperties["additionalProperty"]) {
            additionalProperties["additionalProperty"] = [];
          }
          additionalProperties["additionalProperty"].push({
            "@type": "PropertyValue",
            "name": "Effect",
            "value": product.effect
          });
        }
        
        // Add device type
        if (product.deviceType) {
          if (!additionalProperties["additionalProperty"]) {
            additionalProperties["additionalProperty"] = [];
          }
          additionalProperties["additionalProperty"].push({
            "@type": "PropertyValue",
            "name": "Device Type",
            "value": product.deviceType
          });
        }
        
        // Add composition
        if (product.composition) {
          if (!additionalProperties["additionalProperty"]) {
            additionalProperties["additionalProperty"] = [];
          }
          additionalProperties["additionalProperty"].push({
            "@type": "PropertyValue",
            "name": "Composition",
            "value": product.composition
          });
        }
        
        // Build category
        const categoryValue = product.category || "Ароматичні девайси та аксесуари";
        
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
            "name": product.manufacturer || BRAND.name,
            "logo": `${baseUrl}/images/light-theme/calipuff-logo-header-light.svg`
          },
          "manufacturer": {
            "@type": "Organization",
            "name": product.manufacturer || BRAND.name
          },
          "category": categoryValue,
          "aggregateRating": aggregateRating ? {
            "@type": "AggregateRating",
            "ratingValue": aggregateRating.ratingValue,
            "reviewCount": aggregateRating.reviewCount,
            "bestRating": "5",
            "worstRating": "1"
          } : {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "reviewCount": "5",
            "bestRating": "5",
            "worstRating": "1"
          },
          ...(reviews && reviews.length > 0 ? {
            "review": reviews.map(review => ({
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": review.author
              },
              "datePublished": review.date,
              "reviewBody": review.comment,
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.rating.toString(),
                "bestRating": "5",
                "worstRating": "1"
              }
            }))
          } : {}),
          ...additionalProperties
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
        if (faq && faq.length > 0) {
          return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faq.map(item => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
              }
            }))
          };
        }
        // Default FAQ if none provided
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Оплата | CALIPUFF",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Приймаємо банківські картки, рахунок-фактуру для компаній та еквайринг. Партнерські замовлення від 10 одиниць підтверджуємо 50% передоплатою."
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

      case 'article':
        if (!article) return null;
        return {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": article.headline,
          "description": article.description,
          "image": [article.image],
          "datePublished": article.datePublished,
          "dateModified": article.dateModified,
          "author": {
            "@type": "Organization",
            "name": article.author,
            "url": baseUrl
          },
          "publisher": {
            "@type": "Organization",
            "name": article.publisher,
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/images/light-theme/calipuff-logo-header-light.svg`
            },
            "url": baseUrl
          },
          ...(article.url ? {
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": article.url
            },
            "url": article.url
          } : {})
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

