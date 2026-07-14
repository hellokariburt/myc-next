-- CreateTable
CREATE TABLE "shows" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "venue" VARCHAR(255),
    "borough" VARCHAR(255),
    "neighborhood" VARCHAR(255),
    "day" VARCHAR(255),
    "time_text" VARCHAR(255),
    "instagram" VARCHAR(255),
    "schedule" VARCHAR(50),
    "location_note" VARCHAR(255),
    "confirmed" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shows_pkey" PRIMARY KEY ("id")
);
