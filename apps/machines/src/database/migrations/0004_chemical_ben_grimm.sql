ALTER TABLE "maintenance_history" DROP CONSTRAINT "maintenance_history_machine_id_machines_id_fk";
--> statement-breakpoint
ALTER TABLE "machines" ADD COLUMN "access_version" integer;--> statement-breakpoint
ALTER TABLE "machines" ADD COLUMN "status_version" integer;--> statement-breakpoint
ALTER TABLE "machines" DROP COLUMN IF EXISTS "version";