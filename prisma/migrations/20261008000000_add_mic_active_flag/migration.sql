-- AlterTable: soft-delete / takedown flag for mics.
-- Existing rows default to active = true so nothing is hidden on apply.
ALTER TABLE "mics" ADD COLUMN IF NOT EXISTS "active" BOOLEAN NOT NULL DEFAULT true;
