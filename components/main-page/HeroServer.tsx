import { prisma } from "@/lib/sql";
import HeroClient from "./HeroClient";
import { BRAND } from "@/lib/brand";
import { getImageUrl } from "@/lib/getFirstProductImage";

async function getHeroContent() {
  try {
    const content = await (prisma as any).homePageContent.findUnique({
      where: { section: "hero" },
    });
    return content;
  } catch (error) {
    console.error("Failed to fetch hero content:", error);
    return null;
  }
}

export default async function HeroServer() {
  const heroContent = await getHeroContent();

  const title = heroContent?.hero_title || BRAND.tagline;
  const subtitle = heroContent?.hero_subtitle || BRAND.name;
  const description = heroContent?.hero_description || BRAND.description;
  // Convert stored filename to full URL, or use default
  const storedImage = heroContent?.hero_background_image;
  const backgroundImage = storedImage 
    ? (storedImage.startsWith('/') || storedImage.startsWith('http'))
      ? storedImage // Already a full path or URL
      : getImageUrl(storedImage) // Convert filename to /api/images/filename
    : "/images/calishops-bg.jpg";
  const buttonText = heroContent?.hero_button_text || "Перейти до каталогу";
  const buttonLink = heroContent?.hero_button_link || "/catalog";

  return (
    <HeroClient
      title={title}
      subtitle={subtitle}
      description={description}
      backgroundImage={backgroundImage}
      buttonText={buttonText}
      buttonLink={buttonLink}
    />
  );
}

