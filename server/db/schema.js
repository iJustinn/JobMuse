import {
  boolean,
  date,
  bigint,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  pronouns: text("pronouns"),
  phone: text("phone"),
  location: text("location"),
  openToRemote: boolean("open_to_remote").default(true).notNull(),
  personalSite: text("personal_site"),
  github: text("github"),
  linkedin: text("linkedin"),
  defaultSummary: text("default_summary"),
  avatarUrl: text("avatar_url"),
  initials: text("initials"),
  ...timestamps,
});

export const userSettings = pgTable("user_settings", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  defaultTone: text("default_tone").default("direct").notNull(),
  cvLengthCap: text("cv_length_cap").default("1page").notNull(),
  autoIncludeProjectsWhenJdMentions: text("auto_include_projects_when_jd_mentions"),
  showChangelog: boolean("show_changelog").default(true).notNull(),
  autoCaptureFromCoverLetters: boolean("auto_capture_from_cover_letters").default(true).notNull(),
  confidenceThreshold: numeric("confidence_threshold", { precision: 3, scale: 2 }).default("0.65").notNull(),
  forgetFactsOlderThan: text("forget_facts_older_than"),
  defaultExportFormat: text("default_export_format").default("pdf-letter").notNull(),
  filenamePattern: text("filename_pattern").default("{name}__{company}__{role}.pdf").notNull(),
  includeSourceLinks: boolean("include_source_links").default(false).notNull(),
  density: text("density").default("cozy").notNull(),
  darkMode: boolean("dark_mode").default(false).notNull(),
  cvLayout: text("cv_layout").default("split").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  storagePath: text("storage_path").notNull(),
  filename: text("filename"),
  mime: text("mime"),
  sizeBytes: bigint("size_bytes", { mode: "number" }),
  kind: text("kind").notNull(),
  ...timestamps,
}, (table) => [
  index("files_user_id_idx").on(table.userId),
]);

export const memoryFacts = pgTable("memory_facts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  text: text("text").notNull(),
  sourceKind: text("source_kind").default("manual").notNull(),
  sourceFileId: uuid("source_file_id").references(() => files.id, { onDelete: "set null" }),
  confidence: numeric("confidence", { precision: 3, scale: 2 }).default("1.00").notNull(),
  ...timestamps,
}, (table) => [
  index("memory_facts_user_category_idx").on(table.userId, table.category),
]);

export const applications = pgTable("applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  company: text("company").notNull(),
  role: text("role").notNull(),
  originalUrl: text("original_url"),
  jdText: text("jd_text"),
  jdSignals: jsonb("jd_signals").default([]).notNull(),
  matchScore: smallint("match_score"),
  status: text("status").default("Draft").notNull(),
  notes: text("notes"),
  appliedAt: timestamp("applied_at", { withTimezone: true }),
  ...timestamps,
}, (table) => [
  index("applications_user_created_idx").on(table.userId, table.createdAt),
]);

export const cvs = pgTable("cvs", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  version: integer("version").default(1).notNull(),
  body: jsonb("body").notNull(),
  changes: jsonb("changes").default([]).notNull(),
  generatedBy: text("generated_by").default("deepseek").notNull(),
  promptHash: text("prompt_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  unique("cvs_application_version_unique").on(table.applicationId, table.version),
  index("cvs_application_version_idx").on(table.applicationId, table.version),
]);

export const cvRevisions = pgTable("cv_revisions", {
  id: uuid("id").defaultRandom().primaryKey(),
  cvId: uuid("cv_id").notNull().references(() => cvs.id, { onDelete: "cascade" }),
  userMessage: text("user_message"),
  patch: jsonb("patch").notNull(),
  reply: text("reply"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("cv_revisions_cv_created_idx").on(table.cvId, table.createdAt),
]);

export const applicationEvents = pgTable("application_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: uuid("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  payload: jsonb("payload").default({}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("application_events_application_created_idx").on(table.applicationId, table.createdAt),
]);

export const aiUsage = pgTable("ai_usage", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull(),
  promptTokens: integer("prompt_tokens"),
  completionTokens: integer("completion_tokens"),
  model: text("model"),
  costCents: numeric("cost_cents", { precision: 10, scale: 4 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("ai_usage_user_created_idx").on(table.userId, table.createdAt),
]);

export const aiQuota = pgTable("ai_quota", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  day: date("day").notNull(),
  generatesUsed: integer("generates_used").default(0).notNull(),
  revisesUsed: integer("revises_used").default(0).notNull(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.day] }),
]);
