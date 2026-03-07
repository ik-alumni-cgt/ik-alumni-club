CREATE TYPE "public"."email_send_status" AS ENUM('pending', 'success', 'failed');--> statement-breakpoint
CREATE TABLE "email_send_recipients" (
	"id" text PRIMARY KEY NOT NULL,
	"email_send_id" text NOT NULL,
	"member_id" text,
	"email" varchar(255) NOT NULL,
	"status" "email_send_status" DEFAULT 'pending' NOT NULL,
	"error_message" text,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_sends" (
	"id" text PRIMARY KEY NOT NULL,
	"subject" varchar(255) NOT NULL,
	"body" text NOT NULL,
	"sent_by" text,
	"total_count" integer NOT NULL,
	"success_count" integer DEFAULT 0 NOT NULL,
	"fail_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "email_send_recipients" ADD CONSTRAINT "email_send_recipients_email_send_id_email_sends_id_fk" FOREIGN KEY ("email_send_id") REFERENCES "public"."email_sends"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_send_recipients" ADD CONSTRAINT "email_send_recipients_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_sends" ADD CONSTRAINT "email_sends_sent_by_users_id_fk" FOREIGN KEY ("sent_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;