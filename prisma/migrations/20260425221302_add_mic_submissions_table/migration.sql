-- CreateTable
CREATE TABLE "mic_submissions" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "borough" VARCHAR(255) NOT NULL,
    "day" VARCHAR(255) NOT NULL,
    "start_time" VARCHAR(50) NOT NULL,
    "end_time" VARCHAR(50),
    "venue" VARCHAR(255) NOT NULL,
    "street_address" VARCHAR(255) NOT NULL,
    "neighborhood" VARCHAR(255),
    "cost" VARCHAR(255) NOT NULL,
    "venue_type" VARCHAR(255),
    "stage_time" VARCHAR(255),
    "signup_info" VARCHAR(500),
    "host_name" VARCHAR(255),
    "host_instagram" VARCHAR(255),
    "instagram" VARCHAR(255),
    "website" VARCHAR(255),
    "notes" VARCHAR(500),
    "schedule" VARCHAR(255),
    "submitter_email" VARCHAR(255),
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mic_submissions_pkey" PRIMARY KEY ("id")
);
