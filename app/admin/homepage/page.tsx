"use client";

import React, { useEffect, useState, useCallback } from "react";
import PageBreadcrumb from "@/components/admin/PageBreadCrumb";
import ComponentCard from "@/components/admin/ComponentCard";
import Label from "@/components/admin/form/Label";
import Input from "@/components/admin/form/input/InputField";
import TextArea from "@/components/admin/form/input/TextArea";
import DropzoneComponent from "@/components/admin/form/form-elements/DropZone";
import Image from "next/image";
import { BRAND } from "@/lib/brand";

interface HomePageContent {
  id?: number;
  section: string;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  hero_description?: string | null;
  hero_background_image?: string | null;
  hero_button_text?: string | null;
  hero_button_link?: string | null;
  about_title?: string | null;
  about_description?: string | null;
  about_mission?: any;
  why_title?: string | null;
  why_description?: string | null;
  why_items?: any;
  content?: any;
  images?: any;
}

export default function HomePageEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [content, setContent] = useState<Record<string, HomePageContent>>({});

  // Hero section state - initialize with BRAND defaults
  const [heroTitle, setHeroTitle] = useState(BRAND.tagline);
  const [heroSubtitle, setHeroSubtitle] = useState(BRAND.name);
  const [heroDescription, setHeroDescription] = useState(BRAND.description);
  const [heroBackgroundImage, setHeroBackgroundImage] = useState("/images/calishops-bg.jpg");
  const [heroButtonText, setHeroButtonText] = useState("Перейти до каталогу");
  const [heroButtonLink, setHeroButtonLink] = useState("/catalog");

  // About section state - initialize with BRAND defaults
  const [aboutTitle, setAboutTitle] = useState(`Про бренд ${BRAND.name}`);
  const [aboutDescription, setAboutDescription] = useState(
    `${BRAND.shortDescription} Ми народилися на європейському ринку, щоб перенести настрій узбережжя Каліфорнії в унікальний аромадосвід з акцентом на якість та стиль.`
  );
  // Helper to generate unique ID
  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const [missionPoints, setMissionPoints] = useState<Array<{ id: string; text: string; image?: string }>>(
    BRAND.mission.map((text) => ({ id: generateId(), text }))
  );

  // Why Choose Us section state - initialize with defaults
  const [whyTitle, setWhyTitle] = useState(`Чому обирають ${BRAND.name}`);
  const [whyDescription, setWhyDescription] = useState(
    "Каліфорнійська хвиля свободи. Європейська якість, виробництво та сервіс, що говорить мовою бізнесу."
  );
  const [whyItems, setWhyItems] = useState<
    Array<{ title: string; text: string; accent: string }>
  >([
    {
      title: "Європейська якість",
      text: "Кожна формула проходить сертифікацію в Європі, аби ви відчували лише аромат і свободу.",
      accent: BRAND.palette.sunset,
    },
    {
      title: "Wave Lab у Києві",
      text: "Тестуємо нові смаки в живому форматі — тут народжуються сонячні лімітовані серії.",
      accent: BRAND.palette.dune,
    },
    {
      title: "Тонкі смаки з Каліфорнії",
      text: "Використовуємо мікс фруктів, трав та спецій, що нагадує океанський бриз і теплий вітер.",
      accent: BRAND.palette.tide,
    },
    {
      title: "Відповідальність перед ринком",
      text: "Транспарентний склад, онлайн-доступ до лабораторних звітів і гаряча підтримка для партнерів.",
      accent: "#ffffff",
    },
    {
      title: "Гнучкі бізнес-моделі",
      text: "Франшиза, pop-up бари, корпоративні подарунки — обирайте формат співпраці та масштабуйтеся.",
      accent: "#111111",
    },
  ]);

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    if (content[activeSection]) {
      const section = content[activeSection];
      if (activeSection === "hero") {
        setHeroTitle(section.hero_title || BRAND.tagline);
        setHeroSubtitle(section.hero_subtitle || BRAND.name);
        setHeroDescription(section.hero_description || BRAND.description);
        // Convert stored filename to full URL for display
        const storedImage = section.hero_background_image || "/images/calishops-bg.jpg";
        const displayImage = storedImage.startsWith('/') || storedImage.startsWith('http')
          ? storedImage
          : `/api/images/${storedImage}`;
        setHeroBackgroundImage(displayImage);
        setHeroButtonText(section.hero_button_text || "Перейти до каталогу");
        setHeroButtonLink(section.hero_button_link || "/catalog");
      } else if (activeSection === "about") {
        setAboutTitle(section.about_title || `Про бренд ${BRAND.name}`);
        setAboutDescription(section.about_description || `${BRAND.shortDescription} Ми народилися на європейському ринку, щоб перенести настрій узбережжя Каліфорнії в унікальний аромадосвід з акцентом на якість та стиль.`);
        if (section.about_mission && Array.isArray(section.about_mission) && section.about_mission.length > 0) {
          // Handle both old format (string[]) and new format ({text, image}[])
          const formatted = section.about_mission.map((item: string | { text: string; image?: string }) => {
            if (typeof item === 'string') {
              return { id: generateId(), text: item };
            }
            return { id: generateId(), ...item };
          });
          setMissionPoints(formatted);
        } else {
          setMissionPoints(BRAND.mission.map((text) => ({ id: generateId(), text })));
        }
      } else if (activeSection === "why-choose-us") {
        setWhyTitle(section.why_title || `Чому обирають ${BRAND.name}`);
        setWhyDescription(section.why_description || "Каліфорнійська хвиля свободи. Європейська якість, виробництво та сервіс, що говорить мовою бізнесу.");
        if (section.why_items && Array.isArray(section.why_items) && section.why_items.length > 0) {
          setWhyItems(section.why_items);
        } else {
          // Default WHY_US items
          setWhyItems([
            {
              title: "Європейська якість",
              text: "Кожна формула проходить сертифікацію в Європі, аби ви відчували лише аромат і свободу.",
              accent: BRAND.palette.sunset,
            },
            {
              title: "Wave Lab у Києві",
              text: "Тестуємо нові смаки в живому форматі — тут народжуються сонячні лімітовані серії.",
              accent: BRAND.palette.dune,
            },
            {
              title: "Тонкі смаки з Каліфорнії",
              text: "Використовуємо мікс фруктів, трав та спецій, що нагадує океанський бриз і теплий вітер.",
              accent: BRAND.palette.tide,
            },
            {
              title: "Відповідальність перед ринком",
              text: "Транспарентний склад, онлайн-доступ до лабораторних звітів і гаряча підтримка для партнерів.",
              accent: "#ffffff",
            },
            {
              title: "Гнучкі бізнес-моделі",
              text: "Франшиза, pop-up бари, корпоративні подарунки — обирайте формат співпраці та масштабуйтеся.",
              accent: "#111111",
            },
          ]);
        }
      }
    } else {
      // Use default values from BRAND if section doesn't exist
      if (activeSection === "hero") {
        setHeroTitle(BRAND.tagline);
        setHeroSubtitle(BRAND.name);
        setHeroDescription(BRAND.description);
        setHeroBackgroundImage("/images/calishops-bg.jpg"); // This is already a full path
        setHeroButtonText("Перейти до каталогу");
        setHeroButtonLink("/catalog");
      } else if (activeSection === "about") {
        setAboutTitle(`Про бренд ${BRAND.name}`);
        setAboutDescription(`${BRAND.shortDescription} Ми народилися на європейському ринку, щоб перенести настрій узбережжя Каліфорнії в унікальний аромадосвід з акцентом на якість та стиль.`);
        setMissionPoints(BRAND.mission.map((text) => ({ id: generateId(), text })));
      } else if (activeSection === "why-choose-us") {
        setWhyTitle(`Чому обирають ${BRAND.name}`);
        setWhyDescription("Каліфорнійська хвиля свободи. Європейська якість, виробництво та сервіс, що говорить мовою бізнесу.");
        setWhyItems([
          {
            title: "Європейська якість",
            text: "Кожна формула проходить сертифікацію в Європі, аби ви відчували лише аромат і свободу.",
            accent: BRAND.palette.sunset,
          },
          {
            title: "Wave Lab у Києві",
            text: "Тестуємо нові смаки в живому форматі — тут народжуються сонячні лімітовані серії.",
            accent: BRAND.palette.dune,
          },
          {
            title: "Тонкі смаки з Каліфорнії",
            text: "Використовуємо мікс фруктів, трав та спецій, що нагадує океанський бриз і теплий вітер.",
            accent: BRAND.palette.tide,
          },
          {
            title: "Відповідальність перед ринком",
            text: "Транспарентний склад, онлайн-доступ до лабораторних звітів і гаряча підтримка для партнерів.",
            accent: "#ffffff",
          },
          {
            title: "Гнучкі бізнес-моделі",
            text: "Франшиза, pop-up бари, корпоративні подарунки — обирайте формат співпраці та масштабуйтеся.",
            accent: "#111111",
          },
        ]);
      }
    }
  }, [activeSection, content]);

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/homepage");
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error("Failed to fetch content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (files: File[]) => {
    if (files.length === 0) return null;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.media && data.media.length > 0) {
        // Get filename and convert to full URL for display
        const filename = data.media[0].url;
        const imageUrl = `/api/images/${filename}`;
        setHeroBackgroundImage(imageUrl); // Store full URL for display
        return imageUrl; // Return full URL
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Помилка завантаження зображення");
    }
    return null;
  };

  const saveSection = async () => {
    setSaving(true);
    try {
      let data: any = { section: activeSection };

      if (activeSection === "hero") {
        // Convert /api/images/filename.webp to just filename.webp for storage
        const imageFilename = heroBackgroundImage.startsWith('/api/images/')
          ? heroBackgroundImage.replace('/api/images/', '')
          : heroBackgroundImage.startsWith('/product-images/')
          ? heroBackgroundImage.replace('/product-images/', '')
          : heroBackgroundImage.startsWith('/images/')
          ? heroBackgroundImage // Keep /images/ paths as is (public folder)
          : heroBackgroundImage; // Keep full URLs as is
        
        data = {
          section: "hero",
          hero_title: heroTitle,
          hero_subtitle: heroSubtitle,
          hero_description: heroDescription,
          hero_background_image: imageFilename,
          hero_button_text: heroButtonText,
          hero_button_link: heroButtonLink,
        };
      } else if (activeSection === "about") {
        data = {
          section: "about",
          about_title: aboutTitle,
          about_description: aboutDescription,
          about_mission: missionPoints
            .filter((p) => p.text.trim() !== "")
            .map((p) => ({
              text: p.text,
              image: p.image || undefined,
            })),
        };
      } else if (activeSection === "why-choose-us") {
        data = {
          section: "why-choose-us",
          why_title: whyTitle,
          why_description: whyDescription,
          why_items: whyItems.filter(
            (item) => item.title.trim() !== "" && item.text.trim() !== ""
          ),
        };
      }

      const response = await fetch(`/api/homepage/${activeSection}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updated = await response.json();
        setContent((prev) => ({ ...prev, [activeSection]: updated }));
        alert("Зміни збережено успішно!");
        await fetchContent(); // Refresh content
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save");
      }
    } catch (error) {
      console.error("Failed to save:", error);
      alert(`Помилка збереження: ${error instanceof Error ? error.message : "Невідома помилка"}`);
    } finally {
      setSaving(false);
    }
  };

  const addMissionPoint = useCallback(() => {
    setMissionPoints((prev) => [...prev, { id: generateId(), text: "" }]);
  }, []);

  const removeMissionPoint = useCallback((id: string) => {
    setMissionPoints((prev) => {
      const updated = prev.filter((point) => point.id !== id);
      // If all points are removed, keep at least one empty point
      return updated.length > 0 ? updated : [{ id: generateId(), text: "" }];
    });
  }, []);

  const updateMissionPoint = (id: string, value: string) => {
    const updated = missionPoints.map((point) =>
      point.id === id ? { ...point, text: value } : point
    );
    setMissionPoints(updated);
  };

  const updateMissionPointImage = async (id: string, files: File[]) => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.media && data.media.length > 0) {
        const filename = data.media[0].url;
        const updated = missionPoints.map((point) =>
          point.id === id ? { ...point, image: filename } : point
        );
        setMissionPoints(updated);
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Помилка завантаження зображення");
    }
  };

  const addWhyItem = () => {
    setWhyItems([...whyItems, { title: "", text: "", accent: "#FFA500" }]);
  };

  const removeWhyItem = (index: number) => {
    setWhyItems(whyItems.filter((_, i) => i !== index));
  };

  const updateWhyItem = (
    index: number,
    field: "title" | "text" | "accent",
    value: string
  ) => {
    const updated = [...whyItems];
    updated[index] = { ...updated[index], [field]: value };
    setWhyItems(updated);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-20">Завантаження...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Редагування головної сторінки" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with sections */}
        <div className="lg:col-span-1">
          <ComponentCard title="Секції">
            <div className="space-y-2">
              {["hero", "about", "why-choose-us"].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeSection === section
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 border-2 border-blue-500 dark:border-blue-400 font-semibold"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                  }`}
                >
                  {section === "hero" && "Hero секція"}
                  {section === "about" && "Про нас"}
                  {section === "why-choose-us" && "Чому обирають нас"}
                </button>
              ))}
            </div>
          </ComponentCard>
        </div>

        {/* Main editor */}
        <div className="lg:col-span-3">
          <ComponentCard title={`Редагування: ${activeSection}`}>
            {activeSection === "hero" && (
              <div className="space-y-6">
                <div>
                  <Label>Заголовок</Label>
                  <Input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    placeholder="Введіть заголовок"
                  />
                </div>

                <div>
                  <Label>Підзаголовок</Label>
                  <Input
                    type="text"
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    placeholder="Введіть підзаголовок"
                  />
                </div>

                <div>
                  <Label>Опис</Label>
                  <TextArea
                    value={heroDescription}
                    onChange={(value) => setHeroDescription(value)}
                    placeholder="Введіть опис"
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Фонове зображення</Label>
                  {heroBackgroundImage && (
                    <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden">
                      <Image
                        src={heroBackgroundImage}
                        alt="Background preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <DropzoneComponent
                    onDrop={async (files: File[]) => {
                      const url = await handleImageUpload(files);
                      if (url) setHeroBackgroundImage(url);
                    }}
                  />
                  {heroBackgroundImage && (
                    <Input
                      type="text"
                      value={heroBackgroundImage}
                      onChange={(e) => setHeroBackgroundImage(e.target.value)}
                      placeholder="Або введіть URL вручну"
                      className="mt-2"
                    />
                  )}
                </div>

                <div>
                  <Label>Текст кнопки</Label>
                  <Input
                    type="text"
                    value={heroButtonText}
                    onChange={(e) => setHeroButtonText(e.target.value)}
                    placeholder="Наприклад: Перейти до каталогу"
                  />
                </div>

                <div>
                  <Label>Посилання кнопки</Label>
                  <Input
                    type="text"
                    value={heroButtonLink}
                    onChange={(e) => setHeroButtonLink(e.target.value)}
                    placeholder="/catalog"
                  />
                </div>
              </div>
            )}

            {activeSection === "about" && (
              <div className="space-y-6">
                <div>
                  <Label>Заголовок секції</Label>
                  <Input
                    type="text"
                    value={aboutTitle}
                    onChange={(e) => setAboutTitle(e.target.value)}
                    placeholder="Наприклад: Про бренд CALIPUFF"
                  />
                </div>

                <div>
                  <Label>Опис</Label>
                  <TextArea
                    value={aboutDescription}
                    onChange={(value) => setAboutDescription(value)}
                    placeholder="Введіть опис"
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Місійні пункти</Label>
                  {missionPoints.map((point, index) => (
                    <div key={point.id} className="mb-6 p-4 border rounded-lg space-y-3">
                      <div className="flex gap-2">
                        <TextArea
                          value={point.text}
                          onChange={(value) =>
                            updateMissionPoint(point.id, value)
                          }
                          placeholder={`Місійний пункт ${index + 1}`}
                          rows={2}
                          className="flex-1"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeMissionPoint(point.id);
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 h-fit transition-colors"
                          type="button"
                        >
                          Видалити
                        </button>
                      </div>
                      
                      <div>
                        <Label className="text-sm">Зображення для пункту {index + 1}</Label>
                        {point.image && (
                          <div className="mb-2 relative w-full h-32 rounded-lg overflow-hidden">
                            <Image
                              src={point.image.startsWith('/') || point.image.startsWith('http') 
                                ? point.image 
                                : `/api/images/${point.image}`}
                              alt={`Mission ${index + 1} preview`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <DropzoneComponent
                          onDrop={async (files: File[]) => {
                            await updateMissionPointImage(point.id, files);
                          }}
                        />
                        {point.image && (
                          <Input
                            type="text"
                            value={point.image}
                            onChange={(e) => {
                              const updated = [...missionPoints];
                              updated[index] = { ...updated[index], image: e.target.value };
                              setMissionPoints(updated);
                            }}
                            placeholder="Або введіть URL вручну"
                            className="mt-2"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addMissionPoint}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    + Додати пункт
                  </button>
                </div>
              </div>
            )}

            {activeSection === "why-choose-us" && (
              <div className="space-y-6">
                <div>
                  <Label>Заголовок секції</Label>
                  <Input
                    type="text"
                    value={whyTitle}
                    onChange={(e) => setWhyTitle(e.target.value)}
                    placeholder="Наприклад: Чому обирають CALIPUFF"
                  />
                </div>

                <div>
                  <Label>Опис</Label>
                  <TextArea
                    value={whyDescription}
                    onChange={(value) => setWhyDescription(value)}
                    placeholder="Введіть опис"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Елементи</Label>
                  {whyItems.map((item, index) => (
                    <div
                      key={index}
                      className="mb-6 p-4 border rounded-lg space-y-3"
                    >
                      <Input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          updateWhyItem(index, "title", e.target.value)
                        }
                        placeholder="Заголовок елемента"
                      />
                      <TextArea
                        value={item.text}
                        onChange={(value) =>
                          updateWhyItem(index, "text", value)
                        }
                        placeholder="Текст елемента"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={item.accent}
                          onChange={(e) =>
                            updateWhyItem(index, "accent", e.target.value)
                          }
                          className="w-20"
                        />
                        <Input
                          type="text"
                          value={item.accent}
                          onChange={(e) =>
                            updateWhyItem(index, "accent", e.target.value)
                          }
                          placeholder="#FFA500"
                          className="flex-1"
                        />
                        {whyItems.length > 1 && (
                          <button
                            onClick={() => removeWhyItem(index)}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Видалити
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addWhyItem}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    + Додати елемент
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={saveSection}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm transition-colors"
              >
                {saving ? "Збереження..." : "Зберегти зміни"}
              </button>
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}

