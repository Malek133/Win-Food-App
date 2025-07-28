-- Migration pour créer la table sport_activities
CREATE TABLE IF NOT EXISTS "sport_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_Id":text("user_id")
	"type" text NOT NULL,
	"duration" integer NOT NULL,
	"distance" numeric(5,2) NOT NULL,
	"calories" integer NOT NULL,
	"date" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS "idx_sport_activities_date" ON "sport_activities" ("date");
CREATE INDEX IF NOT EXISTS "idx_sport_activities_type" ON "sport_activities" ("type");



