CREATE TABLE "clubs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"color" text
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"club" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_club_clubs_id_fk" FOREIGN KEY ("club") REFERENCES "public"."clubs"("id") ON DELETE no action ON UPDATE no action;