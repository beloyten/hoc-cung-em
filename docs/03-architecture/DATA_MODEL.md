# Data Model — HocCungEm

## 1. ERD (Entity Relationship Diagram)

```
┌─────────────────┐
│   teachers      │
│─────────────────│
│ id (PK)         │
│ auth_user_id FK │ → auth.users (Supabase)
│ full_name       │
│ email           │
│ created_at      │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼────────┐         ┌──────────────────┐
│   classes       │         │  parents         │
│─────────────────│         │──────────────────│
│ id (PK)         │         │ id (PK)          │
│ teacher_id FK   │         │ auth_user_id FK  │
│ name            │         │ full_name        │
│ grade           │ 4       │ email            │
│ join_code       │         │ phone            │
│ created_at      │         │ created_at       │
└────────┬────────┘         └────────┬─────────┘
         │ 1                         │ 1
         │                           │
         │ N                         │ N
┌────────▼────────────────────────────▼─────────┐
│              students                         │
│───────────────────────────────────────────────│
│ id (PK)                                       │
│ class_id FK                                   │
│ full_name                                     │
│ student_code (vd: HS01)                       │
│ created_at                                    │
│ deleted_at (soft delete)                      │
└────────┬──────────────────────────────────────┘
         │
         │ N : N (qua bảng parent_students)
         │
┌────────▼─────────┐
│ parent_students  │
│──────────────────│
│ id (PK)          │
│ parent_id FK     │
│ student_id FK    │
│ relationship     │ ('mother' | 'father' | 'guardian')
│ verified_by_teacher│
│ created_at       │
└──────────────────┘

┌─────────────────────────┐
│   study_topics          │  ← Chủ đề tự học GV tạo
│─────────────────────────│
│ id (PK)                 │
│ class_id FK             │
│ title                   │  vd: "Phép cộng có nhớ trong phạm vi 10000"
│ description             │
│ subject                 │  ('math' | future: ...)
│ week_number             │
│ start_date              │
│ end_date                │
│ context                 │  text — ngữ cảnh cho AI
│ created_at              │
└──────────┬──────────────┘
           │ 1
           │
           │ N
┌──────────▼──────────────────┐
│   study_sessions            │  ← Mỗi phiên tự học của 1 HS
│─────────────────────────────│
│ id (PK)                     │
│ student_id FK               │
│ topic_id FK                 │
│ started_at                  │
│ ended_at                    │
│ summary                     │  text — AI sinh sau phiên
│ outcome                     │  ('solved_self' | 'partial' | 'gave_up')
└──────────┬──────────────────┘
           │ 1
           │
           │ N (1 phiên có thể có nhiều cuộc chat AI)
┌──────────▼──────────────────┐
│   ai_chats                  │
│─────────────────────────────│
│ id (PK)                     │
│ session_id FK               │
│ created_by_parent_id FK     │
│ prompt_version              │  vd: 'v1.0'
│ model                       │  vd: 'gemini-2.0-flash'
│ total_tokens                │
│ duration_ms                 │
│ created_at                  │
└──────────┬──────────────────┘
           │ 1
           │
           │ N
┌──────────▼──────────────────┐
│   ai_messages               │
│─────────────────────────────│
│ id (PK)                     │
│ chat_id FK                  │
│ role                        │  ('user' | 'assistant' | 'system')
│ content                     │  text
│ image_paths                 │  text[] — paths trong Storage
│ guard_status                │  ('passed' | 'retried' | 'fallback')
│ created_at                  │
└─────────────────────────────┘

┌─────────────────────────────┐
│   notebook_uploads          │  ← Ảnh vở PH chụp
│─────────────────────────────│
│ id (PK)                     │
│ student_id FK               │
│ topic_id FK (nullable)      │
│ uploaded_by_parent_id FK    │
│ image_paths                 │  text[]
│ note                        │  text (optional)
│ uploaded_at                 │
└──────────┬──────────────────┘
           │ 1
           │
           │ 0..1
┌──────────▼──────────────────┐
│   teacher_reviews           │  ← Tick nhanh GV
│─────────────────────────────│
│ id (PK)                     │
│ upload_id FK                │
│ teacher_id FK               │
│ rating                      │  ('good' | 'needs_support')
│ note                        │  text (optional)
│ reviewed_at                 │
└─────────────────────────────┘

┌─────────────────────────────┐
│   weekly_insights           │  ← Insight cho GV (cron sinh)
│─────────────────────────────│
│ id (PK)                     │
│ class_id FK                 │
│ week_start                  │
│ top_errors                  │  jsonb — top 3-5 lỗi phổ biến
│ student_attention           │  jsonb — em nào cần chú ý
│ teaching_suggestions        │  jsonb — gợi ý điều chỉnh
│ generated_by_model          │
│ generated_at                │
│ teacher_reviewed_at         │  nullable
└─────────────────────────────┘

┌─────────────────────────────┐
│   weekly_reports            │  ← Báo cáo PH (cron sinh)
│─────────────────────────────│
│ id (PK)                     │
│ student_id FK               │
│ week_start                  │
│ summary                     │  text — AI sinh, cá nhân hóa
│ progress_highlights         │  jsonb
│ areas_to_improve            │  jsonb
│ suggested_actions           │  jsonb
│ sent_to_email_at            │  nullable
│ opened_at                   │  nullable
│ generated_at                │
└─────────────────────────────┘

┌─────────────────────────────┐
│   audit_logs                │
│─────────────────────────────│
│ id (PK)                     │
│ actor_type                  │  ('teacher' | 'parent' | 'system')
│ actor_id                    │
│ action                      │
│ resource_type               │
│ resource_id                 │
│ metadata                    │  jsonb
│ created_at                  │
└─────────────────────────────┘
```

---

## 2. Bảng tổng kết

| Bảng | Mục đích | RLS | Note |
|---|---|---|---|
| `teachers` | Hồ sơ giáo viên | ✅ self-only | Linked với `auth.users` |
| `parents` | Hồ sơ phụ huynh | ✅ self-only | Linked với `auth.users` |
| `classes` | Lớp học | ✅ teacher-owned | Có `join_code` 6 ký tự |
| `students` | Học sinh | ✅ teacher of class + linked parents | Soft delete |
| `parent_students` | Liên kết PH ↔ HS | ✅ self-only | Nhiều PH có thể liên kết 1 HS |
| `study_topics` | Chủ đề tự học | ✅ teacher of class + parents in class | GV tạo, PH thấy |
| `study_sessions` | Phiên tự học | ✅ teacher of class + linked parents | Auto-create khi PH mở chat |
| `ai_chats` | Cuộc chat AI | ✅ same as session | Aggregate theo session |
| `ai_messages` | Từng message | ✅ same as chat | Có `image_paths` |
| `notebook_uploads` | Ảnh vở | ✅ teacher of class + linked parents | Storage path |
| `teacher_reviews` | Tick nhanh GV | ✅ teacher-owned | 1-1 với upload |
| `weekly_insights` | Insight cho GV | ✅ teacher-owned | Cron sinh |
| `weekly_reports` | Báo cáo PH | ✅ linked parents | Cron sinh |
| `audit_logs` | Audit trail | ✅ admin-only | Cho compliance |

---

## 3. Quan hệ chính

- **1 GV** dạy **N lớp**
- **1 lớp** có **N HS**
- **1 HS** có thể có **N PH** (M-N qua `parent_students`)
- **1 lớp** có **N chủ đề tự học**
- **1 chủ đề** có **N phiên tự học** (1 cho mỗi HS)
- **1 phiên** có **N cuộc chat AI**
- **1 cuộc chat** có **N messages**
- **1 HS** có **N ảnh vở** (qua `notebook_uploads`)
- **1 ảnh vở** có **0-1 review** từ GV
- **1 lớp** có **N weekly_insights** (1/tuần)
- **1 HS** có **N weekly_reports** (1/tuần)

---

## 4. Indexes quan trọng

```sql
-- Lookup nhanh
CREATE INDEX idx_classes_teacher ON classes(teacher_id);
CREATE INDEX idx_classes_join_code ON classes(join_code);
CREATE INDEX idx_students_class ON students(class_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_parent_students_parent ON parent_students(parent_id);
CREATE INDEX idx_parent_students_student ON parent_students(student_id);

-- Time-series queries (dashboard, insights)
CREATE INDEX idx_sessions_student_date ON study_sessions(student_id, started_at DESC);
CREATE INDEX idx_uploads_student_date ON notebook_uploads(student_id, uploaded_at DESC);
CREATE INDEX idx_messages_chat ON ai_messages(chat_id, created_at);

-- Insight aggregation
CREATE INDEX idx_insights_class_week ON weekly_insights(class_id, week_start DESC);
CREATE INDEX idx_reports_student_week ON weekly_reports(student_id, week_start DESC);

-- Audit
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
```

---

## 5. Storage buckets (Supabase Storage)

| Bucket | Mục đích | Public? | RLS |
|---|---|---|---|
| `notebook-uploads` | Ảnh vở | ❌ Private | ✅ Same as `notebook_uploads` table |
| `chat-images` | Ảnh đề bài / bài làm trong chat | ❌ Private | ✅ Parent-owned (tạm) |
| `avatars` | Ảnh đại diện (optional) | ⚠️ Public | — |

→ Tất cả paths trong DB là dạng `[bucket]/[user_id]/[uuid].[ext]`.

---

## 6. Soft delete pattern

Mọi bảng có dữ liệu HS đều có cột `deleted_at TIMESTAMPTZ NULL`:
- `students`
- `notebook_uploads`
- `study_sessions`

Query mặc định filter `WHERE deleted_at IS NULL`. Không xóa cứng.

---

## 7. Migration & seed

### Migration files
- Quản lý bằng Drizzle Kit
- Folder: `src/db/migrations/`
- Naming: `0001_initial_schema.sql`, `0002_add_audit.sql`, ...

### Seed data (cho dev)
- File: `src/db/seed.ts`
- Tạo: 1 GV mẫu, 1 lớp 4A1, 5 HS mẫu, 5 PH mẫu, 1 topic mẫu

→ Đọc tiếp: [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)
