ALTER TABLE "maintenanc_history" RENAME TO "maintenance_history";--> statement-breakpoint
ALTER TABLE "maintenance_history" DROP CONSTRAINT "maintenanc_history_machine_id_machines_id_fk";
--> statement-breakpoint
ALTER TABLE "machine_maintain_info" ADD COLUMN "defects" json;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "maintenance_history" ADD CONSTRAINT "maintenance_history_machine_id_machines_id_fk" FOREIGN KEY ("machine_id") REFERENCES "machines"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "machine_maintain_info" DROP COLUMN IF EXISTS "notes";