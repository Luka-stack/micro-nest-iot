ALTER TABLE "maintenance_schedules" ADD COLUMN "next_maintenance" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "maintenance_schedules" ADD COLUMN "prev_maintenance" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "maintenance_schedules" DROP COLUMN IF EXISTS "date";