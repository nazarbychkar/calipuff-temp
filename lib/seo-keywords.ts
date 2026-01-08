// SEO keywords generator for CBD/HHC/THC/TAC vape products

export interface ProductSEOData {
  name: string;
  description?: string | null;
  category?: { name: string } | null;
  subcategory?: { name: string } | null;
  cbdContentMg?: number;
  thcContentMg?: number | null;
  effect?: string | null;
  deviceType?: string | null;
  composition?: string | null;
  manufacturer?: string | null;
  hasStrongEffect?: boolean;
}

// Brand keywords
const BRAND_KEYWORDS = [
  "Cannadiss",
  "Канадіс",
  "Канадис",
  "Каннадис",
  "CBDX",
];

// Base keywords
const BASE_KEYWORDS = [
  "CBD магазин",
  "CBD Україна",
  "купити CBD",
  "легальний CBD",
  "HHC Україна",
  "легальний HHC",
  "THC Україна",
  "ТГК Україна",
  "вейп",
  "вейпи",
  "електронна сигарета",
  "дудка",
  "купити вейп",
  "купити дудку",
  "вейп Україна",
  "дудка Україна",
  // Cannabis/Hemp related keywords
  "канабіс",
  "каннабіс",
  "коноплі",
  "канабіску",
  "каннабіску",
  "CBD канабіс",
  "CBD коноплі",
  "CBD канабіску",
  "канабіс CBD",
  "коноплі CBD",
  "канабіс Україна",
  "коноплі Україна",
  "канабіс купити",
  "коноплі купити",
  "легальний канабіс",
  "легальні коноплі",
  "технічні коноплі",
  "технічні коноплі Україна",
  "екстракт конопель",
  "екстракт канабісу",
  "конопляний екстракт",
  "канабіс екстракт",
  "канабіноїди",
  "канабіноїди Україна",
  "купити канабіноїди",
  "канабіс без ТГК",
  "коноплі без ТГК",
  "легальний канабіс Україна",
];

// TAC keywords
const TAC_KEYWORDS_UA = [
  "TAC вейп",
  "ТАС вейп",
  "ТАС Вейп купити",
  "ТАС вейп купити в Україні",
  "ТАС вейп Київ",
  "ТАС вейп Україна",
  "ТАС одноразовий вейп",
  "ТАС вейп ручка",
  "ТАС електронна сигарета",
  "ТАС дудка",
  "ТАС картридж",
  "ТАС картридж 510",
  "ТАС вейп без ТГК",
  "ТАС вейп без THC",
  "ТАС вейп легально",
  "легальні ТАС вейпи",
  "ТАС вейпи з ефектом",
  "ТАС вейп ейфорія",
  "ТАС вейп релакс",
  "ТАС терапевтичний ефект",
  "ТАС ефект як THC",
  "ТАС канабіноїди",
  "Total Active Cannabinoids vape",
  "TAC disposable vape",
  "TAC канабіс",
  "ТАС канабіс",
  "TAC коноплі",
  "ТАС коноплі",
  "TAC канабіску",
  "ТАС канабіску",
  "канабіс TAC",
  "канабіс ТАС",
  "коноплі TAC",
  "коноплі ТАС",
  "TAC екстракт",
  "ТАС екстракт",
];

const TAC_KEYWORDS_RU = [
  "TAC вейп",
  "ТАС вейп",
  "купить ТАС вейп",
  "ТАС вейп Украина",
  "ТАС вейп Киев",
  "одноразовый ТАС вейп",
  "ТАС вейп с эффектом",
  "ТАС эйфория",
  "ТАС эффект как THC",
  "ТАС без ТГК",
  "легальный ТАС вейп",
];

// CBD keywords
const CBD_KEYWORDS = [
  "CBD вейп",
  "CBD вейп без ТГК",
  "CBD релакс",
  "CBD антистрес",
  "CBD картридж",
  "конопляний вейп",
  "канабідіол",
  "каннабидиол",
  "CBD канабіс",
  "CBD коноплі",
  "CBD канабіску",
  "канабіс CBD",
  "коноплі CBD",
  "CBD з конопель",
  "екстракт CBD",
  "CBD екстракт",
  "каннабіс з CBD",
  "коноплі з CBD",
  "CBD технічні коноплі",
  "технічні коноплі CBD",
  "легальні коноплі CBD",
  "CBD без наркотиків",
  "CBD легальний канабіс",
  "канабіс без ТГК",
  "коноплі без ТГК",
  "CBD продукція",
  "продукція з CBD",
  "канабіноїди CBD",
];

// HHC keywords
const HHC_KEYWORDS = [
  "HHC вейп",
  "HHC ейфорія",
  "HHC ефект",
  "HHC без THC",
  "HHC вейп Україна",
  "HHC картридж",
  "HHC канабіс",
  "HHC коноплі",
  "HHC канабіску",
  "канабіс HHC",
  "коноплі HHC",
  "HHC з конопель",
  "екстракт HHC",
  "HHC екстракт",
  "каннабіс з HHC",
  "коноплі з HHC",
  "HHC канабіноїди",
];

// THC keywords
const THC_KEYWORDS = [
  "THC вейп",
  "ТГК вейп",
  "THC Україна",
  "ТГК Україна",
  "THC картридж",
  "THC канабіс",
  "THC коноплі",
  "THC канабіску",
  "канабіс THC",
  "коноплі THC",
  "ТГК канабіс",
  "ТГК коноплі",
  "THC екстракт",
  "ТГК екстракт",
  "канабіс з THC",
  "коноплі з THC",
];

// Effect keywords
const EFFECT_KEYWORDS: Record<string, string[]> = {
  "ейфорія": ["ейфорія", "легальна ейфорія", "легка ейфорія", "ейфорія без наркотиків"],
  "релакс": ["релакс", "розслаблення", "антистрес", "покращення настрою"],
  "фокус": ["фокус", "концентрація", "енергія"],
  "баланс": ["баланс", "гармонія", "рівновага"],
  "енергія": ["енергія", "активність", "бадьорість"],
};

// Device type keywords
const DEVICE_TYPE_KEYWORDS: Record<string, string[]> = {
  "одноразовий": ["одноразовий вейп", "disposable vape", "одноразова дудка"],
  "картридж": ["картридж 510", "картридж", "картридж для вейпу", "конопляний картридж"],
  "ручка": ["вейп ручка", "vape pen", "дудка ручка"],
};

// Flavor/strain keywords (extracted from product name)
const FLAVOR_STRAINS = [
  "Amnesia",
  "OG Kush",
  "Gelato",
  "Banana Smoothie",
  "Lemon Haze",
  "Pineapple Express",
  "Blueberry",
  "Strawberry",
  "Mango",
  "Watermelon",
  "Sativa",
  "Indica",
  "Hybrid",
];

// Legal keywords
const LEGAL_KEYWORDS = [
  "легально в Україні",
  "дозволено",
  "сертифіковано",
  "лабораторні тести",
  "безпечно",
  "без ТГК",
  "без THC",
  "THC FREE",
  "0.0% THC",
];

// Commercial keywords
const COMMERCIAL_KEYWORDS = [
  "купити",
  "замовити",
  "ціна",
  "недорого",
  "доставка по Україні",
  "Нова Пошта",
  "Київ",
];

/**
 * Extracts cannabinoid type from product name and composition
 */
function extractCannabinoidType(name: string, composition?: string | null, cbdContentMg?: number, thcContentMg?: number | null): string[] {
  const text = `${name} ${composition || ""}`.toLowerCase();
  const types: string[] = [];

  // Check for TAC (Total Active Cannabinoids)
  if (text.includes("tac") || text.includes("тас") || text.includes("total active cannabinoids")) {
    types.push("TAC");
  }
  
  // Check for CBD
  if (text.includes("cbd") || text.includes("каннабідіол") || text.includes("канабідіол") || text.includes("каннабидиол") || 
      (cbdContentMg && cbdContentMg > 0)) {
    types.push("CBD");
  }
  
  // Check for HHC
  if (text.includes("hhc") || text.includes("ггк")) {
    types.push("HHC");
  }
  
  // Check for THC
  if (text.includes("thc") || text.includes("тгк") || (thcContentMg !== null && thcContentMg !== undefined)) {
    types.push("THC");
  }
  
  // Check for CBG
  if (text.includes("cbg") || text.includes("цбг")) {
    types.push("CBG");
  }
  
  // Check for CBN
  if (text.includes("cbn") || text.includes("цбн")) {
    types.push("CBN");
  }

  // If no specific type found but has CBD content, assume CBD
  if (types.length === 0 && cbdContentMg && cbdContentMg > 0) {
    types.push("CBD");
  }

  return types;
}

/**
 * Extracts flavor/strain from product name
 */
function extractFlavorStrain(name: string): string[] {
  const flavors: string[] = [];
  const nameLower = name.toLowerCase();

  for (const strain of FLAVOR_STRAINS) {
    if (nameLower.includes(strain.toLowerCase())) {
      flavors.push(strain);
    }
  }

  return flavors;
}

/**
 * Extracts effect type from product effect field and name
 */
function extractEffectType(effect?: string | null, name?: string): string[] {
  const effects: string[] = [];
  const text = `${effect || ""} ${name || ""}`.toLowerCase();

  for (const [key, keywords] of Object.entries(EFFECT_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw.toLowerCase()))) {
      effects.push(key);
      effects.push(...keywords);
    }
  }

  return effects;
}

/**
 * Extracts device type keywords
 */
function extractDeviceTypeKeywords(deviceType?: string | null, name?: string): string[] {
  const keywords: string[] = [];
  const text = `${deviceType || ""} ${name || ""}`.toLowerCase();

  for (const [type, kwList] of Object.entries(DEVICE_TYPE_KEYWORDS)) {
    if (text.includes(type) || kwList.some(kw => text.includes(kw.toLowerCase()))) {
      keywords.push(...kwList);
    }
  }

  return keywords;
}

/**
 * Generates SEO keywords based on product data
 */
export function generateSEOKeywords(product: ProductSEOData): string[] {
  const keywords = new Set<string>();

  // Base keywords
  BASE_KEYWORDS.forEach(kw => keywords.add(kw));

  // Brand keywords
  BRAND_KEYWORDS.forEach(kw => keywords.add(kw));

  // Extract cannabinoid types
  const cannabinoidTypes = extractCannabinoidType(
    product.name, 
    product.composition, 
    product.cbdContentMg, 
    product.thcContentMg
  );
  
  // Add CBD-specific keywords if CBD is present
  if (product.cbdContentMg && product.cbdContentMg > 0 || cannabinoidTypes.includes("CBD")) {
    keywords.add("CBD");
    CBD_KEYWORDS.forEach(kw => keywords.add(kw));
    // Additional CBD + Cannabis combinations
    keywords.add("CBD канабіс");
    keywords.add("CBD коноплі");
    keywords.add("CBD канабіску");
    keywords.add("канабіс CBD");
    keywords.add("коноплі CBD");
    keywords.add("екстракт CBD");
    keywords.add("CBD з конопель");
    keywords.add("канабіс з CBD");
    keywords.add("коноплі з CBD");
  }

  // Add HHC keywords if detected
  if (cannabinoidTypes.includes("HHC")) {
    HHC_KEYWORDS.forEach(kw => keywords.add(kw));
  }

  // Add THC keywords if detected (but mark as legal)
  if (cannabinoidTypes.includes("THC") || product.thcContentMg) {
    THC_KEYWORDS.forEach(kw => keywords.add(kw));
    if (!product.thcContentMg || product.thcContentMg === 0) {
      keywords.add("без ТГК");
      keywords.add("без THC");
      keywords.add("THC FREE");
    }
  }

  // Add TAC keywords if TAC is detected
  if (cannabinoidTypes.includes("TAC")) {
    TAC_KEYWORDS_UA.forEach(kw => keywords.add(kw));
    TAC_KEYWORDS_RU.forEach(kw => keywords.add(kw));
    // Additional TAC + Cannabis combinations
    keywords.add("TAC канабіс");
    keywords.add("ТАС канабіс");
    keywords.add("TAC коноплі");
    keywords.add("ТАС коноплі");
    keywords.add("канабіс TAC");
    keywords.add("канабіс ТАС");
  }

  // Legal keywords (always add if no THC or THC = 0)
  if (!product.thcContentMg || product.thcContentMg === 0) {
    LEGAL_KEYWORDS.forEach(kw => keywords.add(kw));
  }

  // Extract and add flavor/strain keywords
  const flavors = extractFlavorStrain(product.name);
  flavors.forEach(flavor => {
    keywords.add(flavor);
    keywords.add(`${flavor} вейп`);
    keywords.add(`${flavor} дудка`);
    if (cannabinoidTypes.includes("CBD")) {
      keywords.add(`${flavor} CBD вейп`);
    }
    if (cannabinoidTypes.includes("TAC")) {
      keywords.add(`${flavor} TAC вейп`);
      keywords.add(`${flavor} ТАС вейп`);
    }
  });

  // Extract and add effect keywords
  const effects = extractEffectType(product.effect, product.name);
  effects.forEach(effect => keywords.add(effect));
  if (product.effect) {
    keywords.add(`${product.effect} вейп`);
    keywords.add(`вейп ${product.effect}`);
    keywords.add(`дудка ${product.effect}`);
  }

  // Add device type keywords
  const deviceKeywords = extractDeviceTypeKeywords(product.deviceType, product.name);
  deviceKeywords.forEach(kw => keywords.add(kw));

  // Category and subcategory
  if (product.category?.name) {
    keywords.add(product.category.name);
    keywords.add(`${product.category.name} Україна`);
    keywords.add(`купити ${product.category.name.toLowerCase()}`);
  }
  if (product.subcategory?.name) {
    keywords.add(product.subcategory.name);
    keywords.add(`${product.subcategory.name} Україна`);
  }

  // Commercial keywords
  COMMERCIAL_KEYWORDS.forEach(kw => keywords.add(kw));

  // Product-specific combinations
  keywords.add(product.name);
  if (cannabinoidTypes.length > 0) {
    cannabinoidTypes.forEach(type => {
      keywords.add(`${product.name} ${type}`);
      keywords.add(`купити ${product.name}`);
    });
  }

  // Remove duplicates and filter empty
  return Array.from(keywords).filter(kw => kw.trim().length > 0);
}

/**
 * Generates SEO title for product
 */
export function generateSEOTitle(product: ProductSEOData, brandName: string): string {
  const parts: string[] = [];
  
  // Extract cannabinoid type
  const cannabinoidTypes = extractCannabinoidType(
    product.name, 
    product.composition, 
    product.cbdContentMg, 
    product.thcContentMg
  );
  const flavors = extractFlavorStrain(product.name);

  // Build title parts with cannabis keywords for better SEO
  if (flavors.length > 0) {
    parts.push(flavors[0]);
  }

  if (cannabinoidTypes.includes("TAC")) {
    parts.push("TAC вейп");
    // Add cannabis keyword for TAC
    parts.push("канабіс");
  } else if (cannabinoidTypes.includes("CBD")) {
    parts.push("CBD вейп");
    // Add cannabis keyword for CBD - key for ranking
    parts.push("канабіс");
  } else if (cannabinoidTypes.includes("HHC")) {
    parts.push("HHC вейп");
    parts.push("канабіс");
  } else if (cannabinoidTypes.includes("THC")) {
    parts.push("THC вейп");
    parts.push("канабіс");
  } else if (product.cbdContentMg && product.cbdContentMg > 0) {
    // If has CBD content but not in name, still add CBD
    parts.push("CBD вейп");
    parts.push("канабіс");
  } else {
    parts.push("вейп");
  }

  // Add legal status if no THC
  if (!product.thcContentMg || product.thcContentMg === 0) {
    parts.push("без ТГК");
  }

  const title = parts.join(" — ");

  return `${title} | ${brandName}`;
}

/**
 * Generates SEO description for product
 */
export function generateSEODescription(product: ProductSEOData, brandName: string): string {
  const parts: string[] = [];
  
  const cannabinoidTypes = extractCannabinoidType(
    product.name, 
    product.composition, 
    product.cbdContentMg, 
    product.thcContentMg
  );
  const flavors = extractFlavorStrain(product.name);

  // Start with product name and add cannabis keywords for SEO
  if (flavors.length > 0) {
    parts.push(`Вейп ${flavors[0]}`);
  } else {
    parts.push(product.name);
  }

  // Add cannabinoid info with cannabis keywords
  if (cannabinoidTypes.includes("TAC")) {
    parts.push("з канабіноїдами TAC");
    parts.push("екстракт з конопель");
  } else if (cannabinoidTypes.includes("CBD") || product.cbdContentMg && product.cbdContentMg > 0) {
    // Key SEO phrases: CBD канабіс, CBD коноплі
    parts.push(`CBD канабіс з ${product.cbdContentMg || 'органічними'} мг канабідіолу`);
    parts.push("екстракт з технічних конопель");
  } else if (cannabinoidTypes.includes("HHC")) {
    parts.push("HHC з конопель");
    parts.push("екстракт канабісу");
  } else if (cannabinoidTypes.includes("THC")) {
    parts.push("THC з канабісу");
  } else {
    // Even without specific cannabinoid, mention cannabis/hemp for SEO
    parts.push("з екстракту конопель");
  }

  // Add legal status
  if (!product.thcContentMg || product.thcContentMg === 0) {
    parts.push("0.0% THC");
    parts.push("легальний канабіс в Україні");
    parts.push("без ТГК");
  }

  // Add effect if available
  if (product.effect) {
    parts.push(`Ефект: ${product.effect}`);
  }

  // Add category
  if (product.category?.name) {
    parts.push(`Категорія: ${product.category.name}`);
  }

  // Add brand and commercial with more cannabis-related keywords
  parts.push(`Від ${brandName}`);
  parts.push("Легальні коноплі в Україні");
  parts.push("Доставка по Україні");

  return parts.join(". ") + ".";
}

/**
 * Generates H1 title for product page (SEO-optimized)
 */
export function generateH1Title(product: {
  name: string;
  category?: { name: string } | null;
  subcategory?: { name: string } | null;
  cbdContentMg?: number;
  thcContentMg?: number | null;
  effect?: string | null;
}): string {
  const cannabinoidTypes = extractCannabinoidType(
    product.name,
    null,
    product.cbdContentMg,
    product.thcContentMg
  );
  const flavors = extractFlavorStrain(product.name);
  
  const parts: string[] = [];
  
  // Start with product name or flavor
  if (flavors.length > 0) {
    parts.push(flavors[0]);
  } else {
    parts.push(product.name);
  }
  
  // Add cannabinoid type
  if (cannabinoidTypes.includes("CBD") || product.cbdContentMg && product.cbdContentMg > 0) {
    parts.push("CBD");
    parts.push("канабіс");
  } else if (cannabinoidTypes.includes("TAC")) {
    parts.push("TAC");
    parts.push("канабіс");
  } else if (cannabinoidTypes.includes("HHC")) {
    parts.push("HHC");
    parts.push("канабіс");
  }
  
  // Add effect if available
  if (product.effect) {
    parts.push(`(${product.effect})`);
  }
  
  // Add category if available
  if (product.category?.name) {
    parts.push(`— ${product.category.name}`);
  }
  
  return parts.join(" ");
}

