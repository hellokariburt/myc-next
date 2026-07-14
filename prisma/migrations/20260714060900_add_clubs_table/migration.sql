-- CreateTable
CREATE TABLE "clubs" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255),
    "zipcode" VARCHAR(20),
    "borough" VARCHAR(255),
    "neighborhood" VARCHAR(255),
    "website" VARCHAR(500),
    "instagram" VARCHAR(255),
    "description" VARCHAR(500),
    "latitude" VARCHAR(255),
    "longitude" VARCHAR(255),
    "confirmed" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clubs_pkey" PRIMARY KEY ("id")
);
