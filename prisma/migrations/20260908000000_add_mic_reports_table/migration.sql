-- CreateTable
CREATE TABLE "mic_reports" (
    "id" BIGSERIAL NOT NULL,
    "mic_id" BIGINT,
    "mic_name" VARCHAR(255),
    "reason" VARCHAR(50) NOT NULL,
    "details" VARCHAR(1000),
    "status" VARCHAR(50) NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mic_reports_pkey" PRIMARY KEY ("id")
);
