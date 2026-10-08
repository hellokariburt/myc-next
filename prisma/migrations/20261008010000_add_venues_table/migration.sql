-- Normalized venue table + FK from mic_address. Additive and safe: venue_id is
-- nullable and the existing mic_address.venue string is left in place.

-- CreateTable
CREATE TABLE "venues" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "venues_slug_key" ON "venues"("slug");

-- AlterTable
ALTER TABLE "mic_address" ADD COLUMN IF NOT EXISTS "venue_id" BIGINT;

-- AddForeignKey
ALTER TABLE "mic_address" ADD CONSTRAINT "mic_address_venue_fk"
    FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE SET NULL ON UPDATE CASCADE;
