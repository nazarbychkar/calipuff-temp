-- CreateTable
CREATE TABLE "home_page_content" (
    "id" SERIAL NOT NULL,
    "section" TEXT NOT NULL,
    "hero_title" TEXT,
    "hero_subtitle" TEXT,
    "hero_description" TEXT,
    "hero_background_image" TEXT,
    "hero_button_text" TEXT,
    "hero_button_link" TEXT,
    "about_title" TEXT,
    "about_description" TEXT,
    "about_mission" JSONB,
    "why_title" TEXT,
    "why_description" TEXT,
    "why_items" JSONB,
    "content" JSONB,
    "images" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_page_content_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "home_page_content_section_key" ON "home_page_content"("section");
