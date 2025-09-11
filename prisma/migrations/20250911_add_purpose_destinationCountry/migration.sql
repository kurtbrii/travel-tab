-- Add new columns for story US-001: purpose and destinationCountry
-- Safe for existing data; columns are nullable and then backfilled.

ALTER TABLE "Trip"
  ADD COLUMN IF NOT EXISTS "purpose" TEXT,
  ADD COLUMN IF NOT EXISTS "destinationCountry" TEXT;

-- Backfill purpose from legacy title when missing
UPDATE "Trip"
SET "purpose" = COALESCE(NULLIF("title", ''), 'Trip')
WHERE ("purpose" IS NULL OR "purpose" = '');

-- Backfill destinationCountry from legacy destination when it looks like ISO alpha-2
-- Leaves others NULL for manual correction if needed
UPDATE "Trip"
SET "destinationCountry" = UPPER(TRIM("destination"))
WHERE ("destinationCountry" IS NULL OR "destinationCountry" = '')
  AND LENGTH(TRIM(COALESCE("destination", ''))) = 2
  AND TRIM("destination") ~ '^[A-Za-z]{2}$';

-- Optional: add a CHECK constraint to enforce 2-letter codes (commented to avoid drift with Prisma)
-- ALTER TABLE "Trip" ADD CONSTRAINT destination_country_alpha2 CHECK ("destinationCountry" IS NULL OR char_length("destinationCountry") = 2);

