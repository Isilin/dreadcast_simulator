-- Sign-in sessions of the cookie auth (server/feature/auth). The private
-- schema already exists (baseline); only the server's own role reads the
-- table. Applied by hand to the Supabase database too, until the switch.
CREATE SCHEMA IF NOT EXISTS "private";
--> statement-breakpoint
CREATE TABLE "private"."session" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "private"."session" ADD CONSTRAINT "session_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_session_user_id" ON "private"."session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_session_expires_at" ON "private"."session" USING btree ("expires_at");--> statement-breakpoint
REVOKE ALL ON "private"."session" FROM PUBLIC, anon, authenticated;
