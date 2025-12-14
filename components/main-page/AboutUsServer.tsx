import { prisma } from "@/lib/sql";
import AboutUsClient from "./AboutUsClient";
import { BRAND } from "@/lib/brand";

async function getAboutContent() {
  try {
    const content = await (prisma as any).homePageContent.findUnique({
      where: { section: "about" },
    });
    return content;
  } catch (error) {
    console.error("Failed to fetch about content:", error);
    return null;
  }
}

export default async function AboutUsServer() {
  const aboutContent = await getAboutContent();

  const title = aboutContent?.about_title || `Про бренд ${BRAND.name}`;
  const description = aboutContent?.about_description || 
    `${BRAND.shortDescription} Ми народилися на європейському ринку, щоб перенести настрій узбережжя Каліфорнії в унікальний аромадосвід з акцентом на якість та стиль.`;
  
  // Handle both old format (string[]) and new format ({text, image}[])
  let mission: Array<{ text: string; image?: string }>;
  if (aboutContent?.about_mission && Array.isArray(aboutContent.about_mission)) {
    mission = aboutContent.about_mission.map((item: string | { text: string; image?: string }) => {
      if (typeof item === 'string') {
        return { text: item };
      }
      return item;
    });
  } else {
    mission = BRAND.mission.map((text) => ({ text }));
  }

  return (
    <AboutUsClient
      title={title}
      description={description}
      mission={mission}
    />
  );
}

