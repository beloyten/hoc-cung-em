# Database Schema — Drizzle code

> File này là **reference** cho schema. Code thực tế sẽ ở `src/db/schema/*.ts`.

---

## 1. Setup Drizzle

```ts
// src/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// Pool cho server actions (Transaction pooler của Supabase)
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
```

```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/*.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
  verbose: true,
  strict: true,
});
```

---

## 2. Schema files

### `src/db/schema/teachers.ts`
```ts
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const teachers = pgTable("teachers", {
  id: uuid("id").defaultRandom().primaryKey(),
  authUserId: uuid("auth_user_id").notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Teacher = typeof teachers.$inferSelect;
export type NewTeacher = typeof teachers.$inferInsert;
```

### `src/db/schema/parents.ts`
```ts
export const parents = pgTable("parents", {
  id: uuid("id").defaultRandom().primaryKey(),
  authUserId: uuid("auth_user_id").notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Parent = typeof parents.$inferSelect;
export type NewParent = typeof parents.$inferInsert;
```

### `src/db/schema/classes.ts`
```ts
import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { teachers } from "./teachers";

export const classes = pgTable(
  "classes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teacherId: uuid("teacher_id").notNull().references(() => teachers.id),
    name: text("name").notNull(),                       // "4A1"
    grade: integer("grade").notNull(),                  // 4
    joinCode: text("join_code").notNull().unique(),     // 6 ký tự (vd: "K7M2P9")
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    teacherIdx: index("idx_classes_teacher").on(t.teacherId),
    joinCodeIdx: index("idx_classes_join_code").on(t.joinCode),
  })
);
```

### `src/db/schema/students.ts`
```ts
export const students = pgTable(
  "students",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    classId: uuid("class_id").notNull().references(() => classes.id),
    fullName: text("full_name").notNull(),
    studentCode: text("student_code"),  // vd: "HS01"
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => ({
    classIdx: index("idx_students_class").on(t.classId),
  })
);
```

### `src/db/schema/parent_students.ts`
```ts
import { pgEnum } from "drizzle-orm/pg-core";

export const relationshipEnum = pgEnum("relationship", [
  "mother", "father", "guardian", "other"
]);

export const parentStudents = pgTable(
  "parent_students",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    parentId: uuid("parent_id").notNull().references(() => parents.id),
    studentId: uuid("student_id").notNull().references(() => students.id),
    relationship: relationshipEnum("relationship").default("guardian").notNull(),
    verifiedByTeacher: boolean("verified_by_teacher").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    parentIdx: index("idx_ps_parent").on(t.parentId),
    studentIdx: index("idx_ps_student").on(t.studentId),
    uniquePair: uniqueIndex("uniq_parent_student").on(t.parentId, t.studentId),
  })
);
```

### `src/db/schema/study_topics.ts`
```ts
export const subjectEnum = pgEnum("subject", ["math"]);  // mở rộng sau

export const studyTopics = pgTable(
  "study_topics",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    classId: uuid("class_id").notNull().references(() => classes.id),
    title: text("title").notNull(),
    description: text("description"),
    subject: subjectEnum("subject").default("math").notNull(),
    weekNumber: integer("week_number").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    context: text("context"),  // ngữ cảnh cho AI
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    classWeekIdx: index("idx_topics_class_week").on(t.classId, t.weekNumber),
  })
);
```

### `src/db/schema/study_sessions.ts`
```ts
export const sessionOutcomeEnum = pgEnum("session_outcome", [
  "in_progress", "solved_self", "partial", "gave_up"
]);

export const studySessions = pgTable(
  "study_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id").notNull().references(() => students.id),
    topicId: uuid("topic_id").references(() => studyTopics.id),
    startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    summary: text("summary"),
    outcome: sessionOutcomeEnum("outcome").default("in_progress").notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => ({
    studentDateIdx: index("idx_sessions_student_date").on(t.studentId, t.startedAt),
  })
);
```

### `src/db/schema/ai_chats.ts`
```ts
export const aiChats = pgTable("ai_chats", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id").notNull().references(() => studySessions.id),
  createdByParentId: uuid("created_by_parent_id").notNull().references(() => parents.id),
  promptVersion: text("prompt_version").notNull(),     // "v1.0"
  model: text("model").notNull(),                       // "gemini-2.0-flash"
  totalTokens: integer("total_tokens").default(0).notNull(),
  durationMs: integer("duration_ms"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
```

### `src/db/schema/ai_messages.ts`
```ts
export const messageRoleEnum = pgEnum("message_role", ["user", "assistant", "system"]);
export const guardStatusEnum = pgEnum("guard_status", ["passed", "retried", "fallback"]);

export const aiMessages = pgTable(
  "ai_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    chatId: uuid("chat_id").notNull().references(() => aiChats.id),
    role: messageRoleEnum("role").notNull(),
    content: text("content").notNull(),
    imagePaths: text("image_paths").array(),
    guardStatus: guardStatusEnum("guard_status"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    chatIdx: index("idx_messages_chat").on(t.chatId, t.createdAt),
  })
);
```

### `src/db/schema/notebook_uploads.ts`
```ts
export const notebookUploads = pgTable(
  "notebook_uploads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id").notNull().references(() => students.id),
    topicId: uuid("topic_id").references(() => studyTopics.id),
    uploadedByParentId: uuid("uploaded_by_parent_id").notNull().references(() => parents.id),
    imagePaths: text("image_paths").array().notNull(),
    note: text("note"),
    uploadedAt: timestamp("uploaded_at", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => ({
    studentDateIdx: index("idx_uploads_student_date").on(t.studentId, t.uploadedAt),
  })
);
```

### `src/db/schema/teacher_reviews.ts`
```ts
export const ratingEnum = pgEnum("rating", ["good", "needs_support"]);

export const teacherReviews = pgTable("teacher_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  uploadId: uuid("upload_id").notNull().references(() => notebookUploads.id).unique(),
  teacherId: uuid("teacher_id").notNull().references(() => teachers.id),
  rating: ratingEnum("rating").notNull(),
  note: text("note"),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }).defaultNow().notNull(),
});
```

### `src/db/schema/weekly_insights.ts`
```ts
export const weeklyInsights = pgTable(
  "weekly_insights",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    classId: uuid("class_id").notNull().references(() => classes.id),
    weekStart: date("week_start").notNull(),
    topErrors: jsonb("top_errors"),               // [{ topic, count, examples }]
    studentAttention: jsonb("student_attention"), // [{ studentId, reason }]
    teachingSuggestions: jsonb("teaching_suggestions"),
    generatedByModel: text("generated_by_model").notNull(),
    generatedAt: timestamp("generated_at", { withTimezone: true }).defaultNow().notNull(),
    teacherReviewedAt: timestamp("teacher_reviewed_at", { withTimezone: true }),
  },
  (t) => ({
    classWeekIdx: uniqueIndex("uniq_insights_class_week").on(t.classId, t.weekStart),
  })
);
```

### `src/db/schema/weekly_reports.ts`
```ts
export const weeklyReports = pgTable(
  "weekly_reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id").notNull().references(() => students.id),
    weekStart: date("week_start").notNull(),
    summary: text("summary").notNull(),
    progressHighlights: jsonb("progress_highlights"),
    areasToImprove: jsonb("areas_to_improve"),
    suggestedActions: jsonb("suggested_actions"),
    sentToEmailAt: timestamp("sent_to_email_at", { withTimezone: true }),
    openedAt: timestamp("opened_at", { withTimezone: true }),
    generatedAt: timestamp("generated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    studentWeekIdx: uniqueIndex("uniq_reports_student_week").on(t.studentId, t.weekStart),
  })
);
```

### `src/db/schema/audit_logs.ts`
```ts
export const audit_logs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorType: text("actor_type").notNull(),     // 'teacher' | 'parent' | 'system'
    actorId: uuid("actor_id"),
    action: text("action").notNull(),            // 'view_student' | 'upload_image' | ...
    resourceType: text("resource_type").notNull(),
    resourceId: uuid("resource_id"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    resourceIdx: index("idx_audit_resource").on(t.resourceType, t.resourceId),
    createdIdx: index("idx_audit_created").on(t.createdAt),
  })
);
```

### `src/db/schema/index.ts`
```ts
export * from "./teachers";
export * from "./parents";
export * from "./classes";
export * from "./students";
export * from "./parent_students";
export * from "./study_topics";
export * from "./study_sessions";
export * from "./ai_chats";
export * from "./ai_messages";
export * from "./notebook_uploads";
export * from "./teacher_reviews";
export * from "./weekly_insights";
export * from "./weekly_reports";
export * from "./audit_logs";
```

---

## 3. Migration commands

```bash
# Tạo migration sau khi sửa schema
pnpm drizzle-kit generate

# Apply lên DB
pnpm drizzle-kit migrate

# Mở Studio (web UI)
pnpm drizzle-kit studio
```

---

## 4. Seed data

```ts
// src/db/seed.ts
import { db } from "./index";
import { teachers, classes, students, parents, parentStudents, studyTopics } from "./schema";

async function seed() {
  // 1 GV mẫu
  const [teacher] = await db.insert(teachers).values({
    authUserId: "00000000-0000-0000-0000-000000000001", // mock
    fullName: "Cô Linh",
    email: "co.linh@hoccungem.test",
  }).returning();

  // Lớp 4A1
  const [classRow] = await db.insert(classes).values({
    teacherId: teacher.id,
    name: "4A1",
    grade: 4,
    joinCode: "K7M2P9",
  }).returning();

  // 5 HS mẫu
  const studentNames = ["Nguyễn An", "Trần Bình", "Lê Châu", "Phạm Dung", "Hoàng Em"];
  const studentRows = await db.insert(students).values(
    studentNames.map((name, i) => ({
      classId: classRow.id,
      fullName: name,
      studentCode: `HS${String(i + 1).padStart(2, "0")}`,
    }))
  ).returning();

  // 1 chủ đề mẫu
  await db.insert(studyTopics).values({
    classId: classRow.id,
    title: "Phép cộng có nhớ trong phạm vi 10000",
    weekNumber: 1,
    startDate: "2026-04-27",
    endDate: "2026-05-03",
    context: "Học sinh ôn tập phép cộng có nhớ với số có 4 chữ số.",
  });

  console.log("✅ Seed done");
}

seed().catch(console.error);
```

Run: `pnpm tsx src/db/seed.ts`

→ Đọc tiếp: [RLS_POLICIES.md](RLS_POLICIES.md)
