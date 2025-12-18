"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ComponentCard from "@/components/admin/ComponentCard";
import PageBreadcrumb from "@/components/admin/PageBreadCrumb";
import Label from "@/components/admin/form/Label";
import Input from "@/components/admin/form/input/InputField";
import TextArea from "@/components/admin/form/input/TextArea";
import DropzoneComponent from "@/components/admin/form/form-elements/DropZone";
import ToggleSwitch from "@/components/admin/form/ToggleSwitch";
import { getImageUrl } from "@/lib/getFirstProductImage";

type MediaFile = {
  id?: number; // for existing ones
  file?: File; // for new uploads
  url?: string; // for existing ones
  preview?: string; // for new ones (via URL.createObjectURL)
  type: "photo" | "video";
};

export default function EditProductPage() {
  const params = useParams();
  const productId = params?.id;
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    discountPercentage: "",
    priority: "0",
    media: [] as { type: string; url: string }[],
    topSale: false,
    limitedEdition: false,
    isPopular: false,
    isRecommended: false,
    hasStrongEffect: false,
    color: "",
    categoryId: null as number | null,
    subcategoryId: null as number | null,
    // CBD-specific fields
    cbdContentMg: "0",
    thcContentMg: "",
    isAvailable: true,
    // Product specifications
    effect: "",
    inhalationCount: "",
    volume: "",
    composition: "",
    deviceType: "",
    manufacturer: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState<
    { id: number; name: string; parent_category_id: number }[]
  >([]);

  const [availableColors, setAvailableColors] = useState<
    { color: string; hex?: string }[]
  >([]);
  const [customColorLabel, setCustomColorLabel] = useState("");
  const [customColorHex, setCustomColorHex] = useState("#000000");
  const [colors, setColors] = useState<{ label: string; hex?: string; isAvailable?: boolean }[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoadingData(true);
      try {
        const [productRes, categoriesRes] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch(`/api/categories`),
        ]);

        const productData = await productRes.json();
        const categoryData = await categoriesRes.json();
        setMediaFiles(
          productData.media.map((item: { url: string; type: string }) => ({
            type: item.type,
            url: item.url,
          }))
        );

        setFormData({
          name: productData.name || "",
          description: productData.description || "",
          price: String(productData.price || 0),
          oldPrice: String(productData.old_price || ""),
          discountPercentage: String(productData.discount_percentage || ""),
          priority: String(productData.priority || 0),
          media: productData.media || [],
          topSale: productData.top_sale || false,
          limitedEdition: productData.limited_edition || false,
          isPopular: productData.isPopular || false,
          isRecommended: productData.isRecommended || false,
          hasStrongEffect: productData.hasStrongEffect || false,
          color: productData.color || "",
          categoryId: productData.category_id || null,
          subcategoryId: productData.subcategory_id || null,
          // CBD-specific fields
          cbdContentMg: String(productData.cbdContentMg ?? 0),
          thcContentMg: productData.thcContentMg != null ? String(productData.thcContentMg) : "",
          isAvailable: productData.isAvailable !== undefined ? productData.isAvailable : true,
          // Product specifications
          effect: productData.effect || "",
          inhalationCount: productData.inhalationCount || "",
          volume: productData.volume || "",
          composition: productData.composition || "",
          deviceType: productData.deviceType || "",
          manufacturer: productData.manufacturer || "",
        });

        setCategoryOptions(categoryData);
        setColors(productData.colors || []);
      } catch (err) {
        console.error("Failed to fetch product or categories", err);
        setError("Помилка при завантаженні товару або категорій");
      } finally {
        setLoadingData(false);
      }
    }

    if (productId) {
      fetchData();
    }
  }, [productId]);

  useEffect(() => {
    async function fetchColors() {
      try {
        const res = await fetch("/api/colors");
        const data = await res.json();
        setAvailableColors(data);
      } catch (error) {
        console.error("Failed to fetch colors", error);
      }
    }

    fetchColors();
  }, []);

  useEffect(() => {
    async function fetchSubcategories() {
      if (!formData.categoryId) {
        setSubcategoryOptions([]); // Clear if no category selected
        return;
      }

      try {
        const res = await fetch(
          `/api/subcategories?parent_category_id=${formData.categoryId}`
        );
        if (!res.ok) throw new Error("Failed to fetch subcategories");

        const data = await res.json();
        setSubcategoryOptions(data);
      } catch (error) {
        console.error("Error fetching subcategories", error);
      }
    }

    fetchSubcategories();
  }, [formData.categoryId]);

  // useEffect(() => {
  //   console.log("formData", formData);
  // }, [formData]);

  const handleDrop = (files: File[]) => {
    console.log('[EditProduct] handleDrop called with files:', files);
    
    // Add to images state (for new uploads)
    setImages((prev) => [...prev, ...files]);
    
    // Also add to mediaFiles for preview with metadata
    const newMedia = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: (file.type.startsWith("video/")
        ? "video"
        : "photo") as MediaFile["type"],
    }));

    setMediaFiles((prev) => [...prev, ...newMedia]);
  };

  // Reorder for existing images
  const moveExistingMedia = (fromIndex: number, toIndex: number) => {
    setFormData((prev) => {
      const updated = [...prev.media];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return { ...prev, media: updated };
    });
  };

  // Reorder for new images
  const moveNewImage = (fromIndex: number, toIndex: number) => {
    console.log('[EditProduct] Moving new image from', fromIndex, 'to', toIndex);
    
    // Get only new files (with file property)
    const newMediaFiles = mediaFiles.filter((m) => m.file);
    const existingMedia = mediaFiles.filter((m) => !m.file);
    
    const updated = [...newMediaFiles];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    
    setMediaFiles([...existingMedia, ...updated]);
    
    // Also update images state
    setImages(updated.map((m) => m.file!));
  };

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeleteImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleDeleteNewImage = (indexToRemove: number) => {
    console.log('[EditProduct] Deleting new image at index:', indexToRemove);
    
    // Get all new media files (those with file property)
    const newMediaFiles = mediaFiles.filter((m) => m.file);
    const itemToDelete = newMediaFiles[indexToRemove];
    
    // Revoke object URL to prevent memory leak
    if (itemToDelete?.preview) {
      URL.revokeObjectURL(itemToDelete.preview);
    }
    
    // Remove from images state
    const newMediaFilesArray = mediaFiles.filter((m) => m.file).map((m) => m.file).filter((f): f is File => !!f);
    const newImages = newMediaFilesArray.filter((_, i) => i !== indexToRemove);
    setImages(newImages);
    
    // Remove from mediaFiles state
    setMediaFiles((prev) => {
      const newFiles = prev.filter((m) => m.file);
      const rest = prev.filter((m) => !m.file);
      const updatedNewFiles = newFiles.filter((_, i) => i !== indexToRemove);
      return [...rest, ...updatedNewFiles];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      console.log('[EditProduct] Submitting form. Images to upload:', images.length);
      
      let uploadedMedia: { type: "photo" | "video"; url: string }[] = [];

      if (images.length > 0) {
        console.log('[EditProduct] Uploading new images:', images.map(f => f.name));
        
        const uploadForm = new FormData();
        images.forEach((img) => uploadForm.append("images", img));

        const uploadRes = await fetch("/api/images", {
          method: "POST",
          body: uploadForm,
        });

        if (!uploadRes.ok) throw new Error("File upload failed");

        const uploadData = await uploadRes.json();
        uploadedMedia = uploadData.media;
        
        console.log('[EditProduct] Uploaded media:', uploadedMedia);
      }

      const updatedMedia = [...formData.media, ...uploadedMedia];

      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          old_price: formData.oldPrice ? Number(formData.oldPrice) : null,
          discount_percentage: formData.discountPercentage
            ? Number(formData.discountPercentage)
            : null,
          priority: Number(formData.priority),
          media: updatedMedia,
          top_sale: formData.topSale,
          limited_edition: formData.limitedEdition,
          isPopular: formData.isPopular,
          isRecommended: formData.isRecommended,
          hasStrongEffect: formData.hasStrongEffect,
          color: formData.color,
          colors,
          category_id: formData.categoryId,
          subcategory_id: formData.subcategoryId,
          // CBD-specific fields
          cbdContentMg: Number(formData.cbdContentMg || 0),
          thcContentMg: formData.thcContentMg ? Number(formData.thcContentMg) : null,
          isAvailable: formData.isAvailable,
          // Product specifications
          effect: formData.effect || null,
          inhalationCount: formData.inhalationCount || null,
          volume: formData.volume || null,
          composition: formData.composition || null,
          deviceType: formData.deviceType || null,
          manufacturer: formData.manufacturer || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to update product");

      setSuccess("Товар успішно оновлено");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      setError("Не вдалося оновити товар");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loadingData ? (
        <div className="p-4 text-center text-lg">Завантаження даних...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <PageBreadcrumb pageTitle="Редагувати Товар" />
          <div className="flex w-full h-auto">
            <div className="w-1/2 p-4">
              <ComponentCard title="Редагувати дані">
                <Label>Назва Товару</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />

                <Label>Опис</Label>
                <TextArea
                  value={formData.description}
                  onChange={(value) => handleChange("description", value)}
                  rows={6}
                />

                <Label>Ціна</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  placeholder="Поточна ціна"
                />

                <Label>Стара ціна (опціонально)</Label>
                <Input
                  type="number"
                  value={formData.oldPrice}
                  onChange={(e) => handleChange("oldPrice", e.target.value)}
                  placeholder="Ціна до знижки"
                />

                <Label>Відсоток знижки (опціонально)</Label>
                <Input
                  type="number"
                  value={formData.discountPercentage}
                  onChange={(e) =>
                    handleChange("discountPercentage", e.target.value)
                  }
                  placeholder="Наприклад: 20"
                />

                <Label>Пріоритет показу</Label>
                <Input
                  type="number"
                  value={formData.priority}
                  onChange={(e) => handleChange("priority", e.target.value)}
                  placeholder="0 - звичайний, 1 - високий"
                />

                <Label>Категорія</Label>
                <select
                  value={formData.categoryId ?? ""}
                  onChange={(e) => {
                    const selectedCategoryId = Number(e.target.value);
                    handleChange("categoryId", selectedCategoryId);
                    handleChange("subcategoryId", null); // ✅ Reset subcategory
                  }}
                  className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Виберіть категорію</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {formData.categoryId && (
                  <>
                    <Label>Підкатегорія</Label>
                    <select
                      value={formData.subcategoryId ?? ""}
                      onChange={(e) =>
                        handleChange("subcategoryId", Number(e.target.value))
                      }
                      className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">Виберіть підкатегорію</option>
                      {subcategoryOptions.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                {/* CBD-specific fields */}
                <div className="border rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50">
                  <h3 className="text-lg font-semibold mb-4">CBD Параметри</h3>
                  <div>
                    <Label>CBD вміст (мг)</Label>
                    <Input
                      type="number"
                      value={formData.cbdContentMg}
                      onChange={(e) => handleChange("cbdContentMg", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>THC вміст (мг) - опціонально</Label>
                    <Input
                      type="number"
                      value={formData.thcContentMg}
                      onChange={(e) => handleChange("thcContentMg", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Availability */}
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                  <h3 className="text-lg font-semibold mb-4">Наявність товару</h3>
                  <div className="flex items-center justify-between">
                    <Label className="mb-0">Товар в наявності</Label>
                    <ToggleSwitch
                      label=""
                      enabled={formData.isAvailable}
                      setEnabled={(value) => handleChange("isAvailable", value)}
                    />
                  </div>
                </div>

                {/* Product Specifications */}
                <div className="border rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50">
                  <h3 className="text-lg font-semibold mb-4">Характеристики продукту</h3>
                  <div>
                    <Label>Ефект</Label>
                    <Input
                      type="text"
                      value={formData.effect}
                      onChange={(e) => handleChange("effect", e.target.value)}
                      placeholder="Опишіть ефект"
                    />
                  </div>
                  <div>
                    <Label>Кількість інгаляцій</Label>
                    <Input
                      type="text"
                      value={formData.inhalationCount}
                      onChange={(e) => handleChange("inhalationCount", e.target.value)}
                      placeholder="Наприклад: 300"
                    />
                  </div>
                  <div>
                    <Label>Об&apos;єм</Label>
                    <Input
                      type="text"
                      value={formData.volume}
                      onChange={(e) => handleChange("volume", e.target.value)}
                      placeholder="Наприклад: 2ml, 10ml"
                    />
                  </div>
                  <div>
                    <Label>Склад</Label>
                    <TextArea
                      value={formData.composition}
                      onChange={(value) => handleChange("composition", value)}
                      rows={3}
                      placeholder="Опишіть склад продукту"
                    />
                  </div>
                  <div>
                    <Label>Тип пристрою</Label>
                    <Input
                      type="text"
                      value={formData.deviceType}
                      onChange={(e) => handleChange("deviceType", e.target.value)}
                      placeholder="Наприклад: Pod-система, Одноразовий"
                    />
                  </div>
                  <div>
                    <Label>Виробник</Label>
                    <Input
                      type="text"
                      value={formData.manufacturer}
                      onChange={(e) => handleChange("manufacturer", e.target.value)}
                      placeholder="Назва виробника"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cмаки</Label>
                  <div className="space-y-2">
                    {colors.map((c, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 border rounded">
                        <span
                          className="w-8 h-8 rounded-full border flex-shrink-0"
                          style={{ backgroundColor: c.hex || "#fff" }}
                        />
                        <span className="flex-1 text-sm">{c.label}</span>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={c.isAvailable !== false}
                            onChange={(e) => {
                              const updated = [...colors];
                              updated[idx] = { ...updated[idx], isAvailable: e.target.checked };
                              setColors(updated);
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-xs text-gray-600">В наявності</span>
                        </label>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800 px-2"
                          onClick={() =>
                            setColors(colors.filter((_, i) => i !== idx))
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  {/* Removed dropdown; using swatch list below */}
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((c) => (
                      <button
                        type="button"
                        key={`pal-${c.color}`}
                        className="flex items-center gap-2 border rounded-full px-2 py-1 text-xs hover:shadow transition"
                        onClick={() =>
                          setColors((prev) => [
                            ...prev,
                            { label: c.color, hex: c.hex, isAvailable: true },
                          ])
                        }
                        title={c.color}
                      >
                        <span
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: c.hex || "#fff" }}
                        />
                        <span>{c.color}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColorHex}
                      onChange={(e) => setCustomColorHex(e.target.value)}
                      className="w-10 h-10 p-0 border rounded"
                    />
                    <Input
                      type="text"
                      value={customColorLabel}
                      onChange={(e) => setCustomColorLabel(e.target.value)}
                      placeholder="Назва смаку"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!customColorLabel.trim()) return;
                        setColors([
                          ...colors,
                          {
                            label: customColorLabel.trim(),
                            hex: customColorHex,
                            isAvailable: true,
                          },
                        ]);
                        setCustomColorLabel("");
                        setCustomColorHex("#000000");
                      }}
                      className="px-3 py-2 rounded bg-blue-600 text-white text-sm"
                    >
                      Додати власний
                    </button>
                  </div>
                </div>

                {/* Блок: Склад тканини і Підкладка */}
                <div className="flex items-center justify-between mt-4">
                  <Label className="mb-0">Топ продаж?</Label>
                  <ToggleSwitch
                    enabled={formData.topSale}
                    setEnabled={(value) => handleChange("topSale", value)}
                    label="Top Sale"
                  />
                </div>

                <div className="flex items-center justify-between mt-4">
                  <Label className="mb-0">Лімітована серія?</Label>
                  <ToggleSwitch
                    enabled={formData.limitedEdition}
                    setEnabled={(value) =>
                      handleChange("limitedEdition", value)
                    }
                    label="Limited Edition"
                  />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Label className="mb-0">Популярний?</Label>
                  <ToggleSwitch
                    enabled={formData.isPopular}
                    setEnabled={(value) => handleChange("isPopular", value)}
                    label="Popular"
                  />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Label className="mb-0">Рекомендуємо?</Label>
                  <ToggleSwitch
                    enabled={formData.isRecommended}
                    setEnabled={(value) => handleChange("isRecommended", value)}
                    label="Recommended"
                  />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Label className="mb-0">Потужний ефект?</Label>
                  <ToggleSwitch
                    enabled={formData.hasStrongEffect}
                    setEnabled={(value) => handleChange("hasStrongEffect", value)}
                    label="Strong Effect"
                  />
                </div>
              </ComponentCard>
            </div>

            <div className="w-1/2 p-4">
              <DropzoneComponent onDrop={handleDrop} />
              <div className="mt-2 flex flex-wrap gap-4 text-sm">
                {formData.media.map((item, i) => (
                  <div key={`existing-${i}`} className="relative inline-block">
                    {item.type === "video" ? (
                      <video
                        src={getImageUrl(item.url)}
                        controls
                        className="w-32 h-32 object-cover rounded"
                      />
                    ) : (
                      <Image
                        src={getImageUrl(item.url)}
                        alt={`media-${i}`}
                        width={128}
                        height={128}
                        className="rounded object-cover"
                      />
                    )}
                    <div className="absolute top-1 left-1 flex gap-1">
                      {i > 0 && (
                        <button
                          type="button"
                          onClick={() => moveExistingMedia(i, i - 1)}
                          className="bg-white text-black rounded-full w-6 h-6 text-xs flex items-center justify-center shadow"
                          title="←"
                        >
                          ←
                        </button>
                      )}
                      {i < formData.media.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveExistingMedia(i, i + 1)}
                          className="bg-white text-black rounded-full w-6 h-6 text-xs flex items-center justify-center shadow"
                          title="→"
                        >
                          →
                        </button>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(i)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      title="Видалити"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {mediaFiles
                  .filter((m) => m.file) // Only show new files (with file property)
                  .map((media, i) => {
                    console.log('[EditProduct] Rendering new media preview:', media);
                    const previewUrl = media.preview || URL.createObjectURL(media.file!);
                    const isVideo = media.type === "video";
                    return (
                      <div key={`new-${i}`} className="relative inline-block">
                        {isVideo ? (
                          <video
                            src={previewUrl}
                            controls
                            className="w-32 h-32 object-cover rounded"
                          />
                        ) : (
                          <Image
                            src={previewUrl}
                            alt={`new-media-${i}`}
                            width={128}
                            height={128}
                            className="rounded object-cover"
                          />
                        )}
                      <div className="absolute top-1 left-1 flex gap-1">
                        {i > 0 && (
                          <button
                            type="button"
                            onClick={() => moveNewImage(i, i - 1)}
                            className="bg-white text-black rounded-full w-6 h-6 text-xs flex items-center justify-center shadow"
                            title="←"
                          >
                            ←
                          </button>
                        )}
                        {i < images.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveNewImage(i, i + 1)}
                            className="bg-white text-black rounded-full w-6 h-6 text-xs flex items-center justify-center shadow"
                            title="→"
                          >
                            →
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteNewImage(i)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        title="Видалити"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Збереження..." : "Зберегти Зміни"}
            </button>

            {success && (
              <div className="text-green-600 text-center mt-2">{success}</div>
            )}
            {error && (
              <div className="text-red-600 text-center mt-2">{error}</div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
