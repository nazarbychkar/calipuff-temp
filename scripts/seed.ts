import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Початок додавання тестових даних...\n");

  // Очищення існуючих даних (опціонально)
  console.log("🧹 Очищення старих даних...");
  await prisma.productColor.deleteMany();
  await prisma.productMedia.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  console.log("✅ Старі дані видалено\n");

  // Створення категорій
  console.log("📁 Створення категорій...");
  const category1 = await prisma.category.create({
    data: {
      name: "Вейпи",
      priority: 10,
    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: "Ліквіди",
      priority: 9,
    },
  });

  const category3 = await prisma.category.create({
    data: {
      name: "Картриджі",
      priority: 8,
    },
  });

  const category4 = await prisma.category.create({
    data: {
      name: "Аксесуари",
      priority: 7,
    },
  });

  console.log(`✅ Створено ${4} категорій\n`);

  // Створення підкатегорій
  console.log("📂 Створення підкатегорій...");
  const subcat1 = await prisma.subcategory.create({
    data: {
      name: "Одноразові вейпи",
      parent_category_id: category1.id,
    },
  });

  const subcat2 = await prisma.subcategory.create({
    data: {
      name: "Багаторазові вейпи",
      parent_category_id: category1.id,
    },
  });

  const subcat3 = await prisma.subcategory.create({
    data: {
      name: "CBD ліквіди",
      parent_category_id: category2.id,
    },
  });

  const subcat4 = await prisma.subcategory.create({
    data: {
      name: "Фруктові ліквіди",
      parent_category_id: category2.id,
    },
  });

  const subcat5 = await prisma.subcategory.create({
    data: {
      name: "1ml картриджі",
      parent_category_id: category3.id,
    },
  });

  const subcat6 = await prisma.subcategory.create({
    data: {
      name: "2ml картриджі",
      parent_category_id: category3.id,
    },
  });

  console.log(`✅ Створено ${6} підкатегорій\n`);

  // Створення товарів
  console.log("🛍️ Створення товарів...");

  // Товар 1 - Топ продаж
  const product1 = await prisma.product.create({
    data: {
      name: "cali aroma devices Wave Disposable",
      description:
        "Одноразовий вейп з каліфорнійським настроєм. 2000 затяжок, 5% CBD, без ТГК. Доступні смаки: тропічні фрукти, м'ята, полуниця.",
      price: 899.0,
      old_price: 1099.0,
      discount_percentage: 18,
      priority: 10,
      top_sale: true,
      limited_edition: false,
      color: "Sunset Orange",
      category_id: category1.id,
      subcategory_id: subcat1.id,
      cbdContentMg: 500,
      thcContentMg: null,
      potency: "5%",
      stock: 50,
      media: {
        create: [
          {
            url: "https://placehold.co/800x600/FFA500/FFFFFF?text=cali+aroma+devices+Wave",
            type: "image",
          },
          {
            url: "https://placehold.co/800x600/FFD700/FFFFFF?text=Wave+Side",
            type: "image",
          },
        ],
      },
      colors: {
        create: [
          { label: "Sunset Orange", hex: "#FFA500" },
          { label: "Dune Gold", hex: "#FFD700" },
          { label: "Tide Blue", hex: "#40E0D0" },
        ],
      },
    },
  });

  // Товар 2 - Лімітована серія
  const product2 = await prisma.product.create({
    data: {
      name: "cali aroma devices Limited Edition Beach",
      description:
        "Лімітована серія з натхненням від пляжів Каліфорнії. Ексклюзивний дизайн, 3000 затяжок, 7% CBD. Тільки 100 штук в Україні.",
      price: 1299.0,
      old_price: null,
      discount_percentage: null,
      priority: 9,
      top_sale: false,
      limited_edition: true,
      color: "Beach Sand",
      category_id: category1.id,
      subcategory_id: subcat1.id,
      cbdContentMg: 700,
      thcContentMg: null,
      potency: "7%",
      stock: 15,
      media: {
        create: [
          {
            url: "https://placehold.co/800x600/FFD700/000000?text=Beach+Edition",
            type: "image",
          },
        ],
      },
      colors: {
        create: [
          { label: "Beach Sand", hex: "#F4A460" },
          { label: "Ocean Blue", hex: "#40E0D0" },
        ],
      },
    },
  });

  // Товар 3 - Ліквід
  const product3 = await prisma.product.create({
    data: {
      name: "cali aroma devices CBD Liquid Tropical",
      description:
        "Преміум CBD ліквід з тропічними смаками. 30ml, 500mg CBD. Без нікотину, без ТГК. Ідеально для релаксації.",
      price: 599.0,
      old_price: 749.0,
      discount_percentage: 20,
      priority: 8,
      top_sale: true,
      limited_edition: false,
      color: null,
      category_id: category2.id,
      subcategory_id: subcat3.id,
      cbdContentMg: 500,
      thcContentMg: null,
      potency: "16.7mg/ml",
      stock: 30,
      media: {
        create: [
          {
            url: "https://placehold.co/800x600/40E0D0/FFFFFF?text=Tropical+Liquid",
            type: "image",
          },
        ],
      },
      colors: {
        create: [
          { label: "Tropical Mix", hex: "#FF6B6B" },
          { label: "Mango", hex: "#FFA500" },
          { label: "Pineapple", hex: "#FFD700" },
        ],
      },
    },
  });

  // Товар 4 - Картридж
  const product4 = await prisma.product.create({
    data: {
      name: "cali aroma devices Cartridge 1ml Mint",
      description:
        "Картридж 1ml з м'ятним смаком. 300mg CBD, сумісний з більшістю вейпів. COA сертифікат включено.",
      price: 399.0,
      old_price: null,
      discount_percentage: null,
      priority: 7,
      top_sale: false,
      limited_edition: false,
      color: "Mint Green",
      category_id: category3.id,
      subcategory_id: subcat5.id,
      cbdContentMg: 300,
      thcContentMg: null,
      potency: "30%",
      stock: 100,
      media: {
        create: [
          {
            url: "https://placehold.co/800x600/90EE90/FFFFFF?text=Cartridge+Mint",
            type: "image",
          },
        ],
      },
      colors: {
        create: [{ label: "Mint Green", hex: "#90EE90" }],
      },
    },
  });

  // Товар 5 - Більше товарів
  const product5 = await prisma.product.create({
    data: {
      name: "cali aroma devices Wave Rechargeable",
      description:
        "Багаторазовий вейп з можливістю перезарядки. 1500mAh батарея, USB-C зарядка. Елегантний дизайн у каліфорнійському стилі.",
      price: 1599.0,
      old_price: 1899.0,
      discount_percentage: 16,
      priority: 6,
      top_sale: true,
      limited_edition: false,
      color: "Sunset",
      category_id: category1.id,
      subcategory_id: subcat2.id,
      cbdContentMg: 0,
      thcContentMg: null,
      potency: null,
      stock: 25,
      media: {
        create: [
          {
            url: "https://placehold.co/800x600/FFA500/FFFFFF?text=Rechargeable",
            type: "image",
          },
        ],
      },
      colors: {
        create: [
          { label: "Sunset", hex: "#FFA500" },
          { label: "Ocean", hex: "#40E0D0" },
        ],
      },
    },
  });

  const product6 = await prisma.product.create({
    data: {
      name: "cali aroma devices CBD Liquid Strawberry",
      description:
        "Солодкий полуничний смак з високою концентрацією CBD. 30ml, 750mg CBD. Без штучних ароматизаторів.",
      price: 699.0,
      old_price: null,
      discount_percentage: null,
      priority: 5,
      top_sale: false,
      limited_edition: false,
      color: null,
      category_id: category2.id,
      subcategory_id: subcat4.id,
      cbdContentMg: 750,
      thcContentMg: null,
      potency: "25mg/ml",
      stock: 40,
      media: {
        create: [
          {
            url: "https://placehold.co/800x600/FF69B4/FFFFFF?text=Strawberry",
            type: "image",
          },
        ],
      },
      colors: {
        create: [{ label: "Strawberry Red", hex: "#FF69B4" }],
      },
    },
  });

  const product7 = await prisma.product.create({
    data: {
      name: "cali aroma devices Cartridge 2ml Blueberry",
      description:
        "Великий картридж 2ml з смаком чорниці. 600mg CBD, тривалий термін використання. COA сертифікат.",
      price: 699.0,
      old_price: 899.0,
      discount_percentage: 22,
      priority: 4,
      top_sale: false,
      limited_edition: false,
      color: "Blueberry",
      category_id: category3.id,
      subcategory_id: subcat6.id,
      cbdContentMg: 600,
      thcContentMg: null,
      potency: "30%",
      stock: 60,
      media: {
        create: [
          {
            url: "https://placehold.co/800x600/8A2BE2/FFFFFF?text=Blueberry+2ml",
            type: "image",
          },
        ],
      },
      colors: {
        create: [{ label: "Blueberry", hex: "#8A2BE2" }],
      },
    },
  });

  const product8 = await prisma.product.create({
    data: {
      name: "cali aroma devices Charging Cable",
      description:
        "Оригінальний USB-C кабель для зарядки вейпів cali aroma devices. Швидка зарядка, надійна конструкція. Довжина 1м.",
      price: 199.0,
      old_price: null,
      discount_percentage: null,
      priority: 3,
      top_sale: false,
      limited_edition: false,
      color: null,
      category_id: category4.id,
      subcategory_id: null,
      cbdContentMg: 0,
      thcContentMg: null,
      potency: null,
      stock: 200,
      media: {
        create: [
          {
            url: "https://placehold.co/800x600/333333/FFFFFF?text=USB+Cable",
            type: "image",
          },
        ],
      },
      colors: {
        create: [{ label: "Black", hex: "#000000" }],
      },
    },
  });

  console.log(`✅ Створено ${8} товарів\n`);

  console.log("✨ Тестові дані успішно додано!");
  console.log("\n📊 Підсумок:");
  console.log(`   - Категорій: ${4}`);
  console.log(`   - Підкатегорій: ${6}`);
  console.log(`   - Товарів: ${8}`);
  console.log(`   - Топ продажів: ${3}`);
  console.log(`   - Лімітованих: ${1}`);
}

main()
  .catch((e) => {
    console.error("❌ Помилка:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

