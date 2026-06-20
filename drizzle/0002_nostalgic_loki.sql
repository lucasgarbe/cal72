ALTER TABLE "events" DROP CONSTRAINT "events_club_clubs_id_fk";
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_club_clubs_id_fk" FOREIGN KEY ("club") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE no action;