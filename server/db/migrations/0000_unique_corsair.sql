CREATE TABLE "ai_quota" (
	"user_id" uuid NOT NULL,
	"day" date NOT NULL,
	"generates_used" integer DEFAULT 0 NOT NULL,
	"revises_used" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "ai_quota_user_id_day_pk" PRIMARY KEY("user_id","day")
);
--> statement-breakpoint
CREATE TABLE "ai_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"endpoint" text NOT NULL,
	"prompt_tokens" integer,
	"completion_tokens" integer,
	"model" text,
	"cost_cents" numeric(10, 4),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "application_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"company" text NOT NULL,
	"role" text NOT NULL,
	"original_url" text,
	"jd_text" text,
	"jd_signals" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"match_score" smallint,
	"status" text DEFAULT 'Draft' NOT NULL,
	"notes" text,
	"applied_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cv_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cv_id" uuid NOT NULL,
	"user_message" text,
	"patch" jsonb NOT NULL,
	"reply" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cvs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"body" jsonb NOT NULL,
	"changes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"generated_by" text DEFAULT 'deepseek' NOT NULL,
	"prompt_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cvs_application_version_unique" UNIQUE("application_id","version")
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"storage_path" text NOT NULL,
	"filename" text,
	"mime" text,
	"size_bytes" bigint,
	"kind" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memory_facts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"category" text NOT NULL,
	"text" text NOT NULL,
	"source_kind" text DEFAULT 'manual' NOT NULL,
	"source_file_id" uuid,
	"confidence" numeric(3, 2) DEFAULT '1.00' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"default_tone" text DEFAULT 'direct' NOT NULL,
	"cv_length_cap" text DEFAULT '1page' NOT NULL,
	"auto_include_projects_when_jd_mentions" text,
	"show_changelog" boolean DEFAULT true NOT NULL,
	"auto_capture_from_cover_letters" boolean DEFAULT true NOT NULL,
	"confidence_threshold" numeric(3, 2) DEFAULT '0.65' NOT NULL,
	"forget_facts_older_than" text,
	"default_export_format" text DEFAULT 'pdf-letter' NOT NULL,
	"filename_pattern" text DEFAULT '{name}__{company}__{role}.pdf' NOT NULL,
	"include_source_links" boolean DEFAULT false NOT NULL,
	"density" text DEFAULT 'cozy' NOT NULL,
	"dark_mode" boolean DEFAULT false NOT NULL,
	"cv_layout" text DEFAULT 'split' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"display_name" text,
	"pronouns" text,
	"phone" text,
	"location" text,
	"open_to_remote" boolean DEFAULT true NOT NULL,
	"personal_site" text,
	"github" text,
	"linkedin" text,
	"default_summary" text,
	"avatar_url" text,
	"initials" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "ai_quota" ADD CONSTRAINT "ai_quota_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_usage" ADD CONSTRAINT "ai_usage_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_events" ADD CONSTRAINT "application_events_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv_revisions" ADD CONSTRAINT "cv_revisions_cv_id_cvs_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."cvs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cvs" ADD CONSTRAINT "cvs_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memory_facts" ADD CONSTRAINT "memory_facts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memory_facts" ADD CONSTRAINT "memory_facts_source_file_id_files_id_fk" FOREIGN KEY ("source_file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_usage_user_created_idx" ON "ai_usage" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "application_events_application_created_idx" ON "application_events" USING btree ("application_id","created_at");--> statement-breakpoint
CREATE INDEX "applications_user_created_idx" ON "applications" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "cv_revisions_cv_created_idx" ON "cv_revisions" USING btree ("cv_id","created_at");--> statement-breakpoint
CREATE INDEX "cvs_application_version_idx" ON "cvs" USING btree ("application_id","version");--> statement-breakpoint
CREATE INDEX "files_user_id_idx" ON "files" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "memory_facts_user_category_idx" ON "memory_facts" USING btree ("user_id","category");--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "files" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "memory_facts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "applications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "cvs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "cv_revisions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "application_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "ai_usage" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "ai_quota" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "users_is_self" ON "users" FOR ALL USING ("id" = auth.uid()) WITH CHECK ("id" = auth.uid());--> statement-breakpoint
CREATE POLICY "user_settings_is_self" ON "user_settings" FOR ALL USING ("user_id" = auth.uid()) WITH CHECK ("user_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "files_is_owner" ON "files" FOR ALL USING ("user_id" = auth.uid()) WITH CHECK ("user_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "memory_facts_is_owner" ON "memory_facts" FOR ALL USING ("user_id" = auth.uid()) WITH CHECK ("user_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "applications_is_owner" ON "applications" FOR ALL USING ("user_id" = auth.uid()) WITH CHECK ("user_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "ai_usage_is_owner" ON "ai_usage" FOR ALL USING ("user_id" = auth.uid()) WITH CHECK ("user_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "ai_quota_is_owner" ON "ai_quota" FOR ALL USING ("user_id" = auth.uid()) WITH CHECK ("user_id" = auth.uid());--> statement-breakpoint
CREATE POLICY "cvs_is_owner" ON "cvs" FOR ALL USING (EXISTS (SELECT 1 FROM "applications" WHERE "applications"."id" = "cvs"."application_id" AND "applications"."user_id" = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM "applications" WHERE "applications"."id" = "cvs"."application_id" AND "applications"."user_id" = auth.uid()));--> statement-breakpoint
CREATE POLICY "cv_revisions_is_owner" ON "cv_revisions" FOR ALL USING (EXISTS (SELECT 1 FROM "cvs" INNER JOIN "applications" ON "applications"."id" = "cvs"."application_id" WHERE "cvs"."id" = "cv_revisions"."cv_id" AND "applications"."user_id" = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM "cvs" INNER JOIN "applications" ON "applications"."id" = "cvs"."application_id" WHERE "cvs"."id" = "cv_revisions"."cv_id" AND "applications"."user_id" = auth.uid()));--> statement-breakpoint
CREATE POLICY "application_events_is_owner" ON "application_events" FOR ALL USING (EXISTS (SELECT 1 FROM "applications" WHERE "applications"."id" = "application_events"."application_id" AND "applications"."user_id" = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM "applications" WHERE "applications"."id" = "application_events"."application_id" AND "applications"."user_id" = auth.uid()));
