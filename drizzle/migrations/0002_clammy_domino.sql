DROP TABLE "sport_activities" CASCADE;--> statement-breakpoint
DROP TABLE "todo" CASCADE;--> statement-breakpoint
ALTER TABLE "gallery" ADD COLUMN "urlmaps" text NOT NULL;--> statement-breakpoint
ALTER TABLE "gallery" ADD COLUMN "dispo" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "gallery" ADD COLUMN "video_url" text;