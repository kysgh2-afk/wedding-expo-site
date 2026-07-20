-- Safe to re-run if a previous deploy partially applied schema changes.
ALTER TABLE "Expo" ADD COLUMN IF NOT EXISTS "isWeeklyWeekend" BOOLEAN NOT NULL DEFAULT false;
