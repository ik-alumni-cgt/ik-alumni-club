CREATE TABLE "editor_invite_uses" (
	"id" text PRIMARY KEY NOT NULL,
	"invite_id" text NOT NULL,
	"user_id" text NOT NULL,
	"used_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "editor_invite_uses_invite_user_unique" UNIQUE("invite_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "editor_invites" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"label" varchar(100),
	"created_by" text,
	"expires_at" timestamp NOT NULL,
	"max_uses" integer DEFAULT 30 NOT NULL,
	"used_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "editor_invites_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "editor_invite_uses" ADD CONSTRAINT "editor_invite_uses_invite_id_editor_invites_id_fk" FOREIGN KEY ("invite_id") REFERENCES "public"."editor_invites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "editor_invite_uses" ADD CONSTRAINT "editor_invite_uses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "editor_invites" ADD CONSTRAINT "editor_invites_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;