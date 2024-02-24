DO $$ BEGIN
 CREATE TYPE "maintenance_type" AS ENUM('MAINTENANCE', 'REPAIR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "status" ADD VALUE 'UNDER_MAINTENANCE';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "machine_maintain_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"notes" text,
	"machine_id" integer NOT NULL,
	"next_maintenance" timestamp with time zone,
	"priority" "priority" DEFAULT 'NORMAL'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "maintenanc_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"machine_id" integer NOT NULL,
	"maintainer" varchar,
	"description" text,
	"date" timestamp with time zone DEFAULT now(),
	"type" varchar,
	"scheduled" timestamp with time zone,
	"next_maintenance" timestamp with time zone
);
--> statement-breakpoint
DROP TABLE "maintenances";--> statement-breakpoint
DROP TABLE "maintenance_schedules";--> statement-breakpoint
ALTER TABLE "machines" ADD COLUMN "assigned_maintainer" varchar DEFAULT null;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "employee_idx" ON "machines" ("assigned_employee");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "maintainer_idx" ON "machines" ("assigned_maintainer");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "machine_maintain_info" ADD CONSTRAINT "machine_maintain_info_machine_id_machines_id_fk" FOREIGN KEY ("machine_id") REFERENCES "machines"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "maintenanc_history" ADD CONSTRAINT "maintenanc_history_machine_id_machines_id_fk" FOREIGN KEY ("machine_id") REFERENCES "machines"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
