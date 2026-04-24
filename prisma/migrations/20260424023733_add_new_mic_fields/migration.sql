-- CreateTable
CREATE TABLE "host_mics" (
    "mics_id" BIGINT NOT NULL,
    "host_id" BIGINT NOT NULL,

    CONSTRAINT "host_mics_pkey" PRIMARY KEY ("mics_id","host_id")
);

-- CreateTable
CREATE TABLE "mic_address" (
    "address_id" BIGSERIAL NOT NULL,
    "city" VARCHAR(255),
    "country" VARCHAR(255),
    "latitude" VARCHAR(255),
    "longitude" VARCHAR(255),
    "venue" VARCHAR(255),
    "state" VARCHAR(255),
    "street_name" VARCHAR(255),
    "unit_number" INTEGER NOT NULL,
    "zipcode" VARCHAR(255),
    "neighborhood" VARCHAR,

    CONSTRAINT "mic_address_pk" PRIMARY KEY ("address_id")
);

-- CreateTable
CREATE TABLE "mic_cost" (
    "cost_id" BIGSERIAL NOT NULL,
    "cost_amount" VARCHAR(255),

    CONSTRAINT "mic_cost_pk" PRIMARY KEY ("cost_id")
);

-- CreateTable
CREATE TABLE "mic_host" (
    "host_id" BIGSERIAL NOT NULL,
    "fifth_host" VARCHAR(255),
    "first_host" VARCHAR(255),
    "email" VARCHAR(255),
    "instagram" VARCHAR(255),
    "third_host" VARCHAR(255),

    CONSTRAINT "mic_host_pk" PRIMARY KEY ("host_id")
);

-- CreateTable
CREATE TABLE "mic_occurrence" (
    "occurrence_id" BIGINT NOT NULL,
    "schedule" VARCHAR,

    CONSTRAINT "mic_occurrence_pk" PRIMARY KEY ("occurrence_id")
);

-- CreateTable
CREATE TABLE "mics" (
    "id" BIGSERIAL NOT NULL,
    "borough" VARCHAR(255),
    "confirmed" VARCHAR(255),
    "day" VARCHAR(255),
    "name" VARCHAR(255),
    "start_time" TIME(6),
    "end_time" TIME(6),
    "address_id" BIGINT,
    "cost_id" BIGINT,
    "host_id" BIGINT,
    "signup_id" BIGINT,
    "notes" VARCHAR(255),
    "occurrence_id" BIGINT,
    "instagram" VARCHAR(255),
    "website" VARCHAR(255),
    "email_address" VARCHAR(255),
    "phone_number" VARCHAR(255),
    "venue_type" VARCHAR(255),
    "stage_time" VARCHAR(255),
    "other_rules" VARCHAR(500),

    CONSTRAINT "mics_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "signup_instructions" (
    "signup_id" BIGSERIAL NOT NULL,
    "instructions" VARCHAR(255),

    CONSTRAINT "signup_instructions_pk" PRIMARY KEY ("signup_id")
);

-- AddForeignKey
ALTER TABLE "host_mics" ADD CONSTRAINT "host_mics_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "mic_host"("host_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "host_mics" ADD CONSTRAINT "host_mics_mics_id_fkey" FOREIGN KEY ("mics_id") REFERENCES "mics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mics" ADD CONSTRAINT "mics_mic_address_fk" FOREIGN KEY ("address_id") REFERENCES "mic_address"("address_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mics" ADD CONSTRAINT "mics_mic_cost_fk" FOREIGN KEY ("cost_id") REFERENCES "mic_cost"("cost_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mics" ADD CONSTRAINT "mics_mic_occurrence_fk" FOREIGN KEY ("occurrence_id") REFERENCES "mic_occurrence"("occurrence_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mics" ADD CONSTRAINT "mics_signup_instructions_fk" FOREIGN KEY ("signup_id") REFERENCES "signup_instructions"("signup_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
