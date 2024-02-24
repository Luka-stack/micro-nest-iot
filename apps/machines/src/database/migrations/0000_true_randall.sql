DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('IDLE', 'WORKING', 'MAINTENANCE', 'BROKEN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "priority" AS ENUM('HIGH', 'NORMAL', 'LOW');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "machines" (
	"id" serial PRIMARY KEY NOT NULL,
	"serial_number" varchar(50),
	"status" "status" DEFAULT 'IDLE',
	"last_status_update" timestamp with time zone DEFAULT now(),
	"production_rate" integer,
	"producent" varchar(50),
	"type" varchar(50),
	"model" varchar(50),
	"assigned_employee" varchar DEFAULT null,
	"version" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "maintenances" (
	"id" serial PRIMARY KEY NOT NULL,
	"machine_id" integer NOT NULL,
	"maintainer" varchar,
	"description" text,
	"date" timestamp with time zone DEFAULT now(),
	"scheduled" timestamp with time zone,
	"next_maintenance" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "maintenance_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"machine_id" integer NOT NULL,
	"date" timestamp with time zone,
	"priority" "priority" DEFAULT 'NORMAL'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "models" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50),
	"work_base" integer,
	"work_range" integer,
	"fault_rate" double precision,
	"default_rate" integer,
	"max_rate" integer,
	"min_rate" integer,
	"type_id" integer,
	"producent_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "producents" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "producents_to_types" (
	"producent_id" integer NOT NULL,
	"type_id" integer NOT NULL,
	CONSTRAINT producents_to_types_producent_id_type_id PRIMARY KEY("producent_id","type_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50),
	"image_url" varchar(255)
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "serial_number_idx" ON "machines" ("serial_number");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "schedule_machine_idx" ON "maintenance_schedules" ("machine_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "model_name_idx" ON "models" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "producents_name_idx" ON "producents" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "types_name_idx" ON "types" ("name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_machine_id_machines_id_fk" FOREIGN KEY ("machine_id") REFERENCES "machines"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "maintenance_schedules" ADD CONSTRAINT "maintenance_schedules_machine_id_machines_id_fk" FOREIGN KEY ("machine_id") REFERENCES "machines"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "producents_to_types" ADD CONSTRAINT "producents_to_types_producent_id_producents_id_fk" FOREIGN KEY ("producent_id") REFERENCES "producents"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "producents_to_types" ADD CONSTRAINT "producents_to_types_type_id_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
