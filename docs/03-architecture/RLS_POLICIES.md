# RLS Policies — HocCungEm

> Row Level Security là **tuyến phòng thủ cuối cùng**. Code có thể có bug, nhưng RLS đảm bảo data không leak.

---

## 1. Nguyên tắc

1. **Bật RLS trên mọi bảng có dữ liệu nhạy cảm** — mặc định DENY ALL
2. **Mỗi bảng có ít nhất 4 policies:** SELECT, INSERT, UPDATE, DELETE
3. **Policy dựa trên `auth.uid()`** (Supabase JWT)
4. **Map auth.uid() → teacher.id / parent.id** qua bảng tương ứng

---

## 2. Helper functions (chạy 1 lần khi setup DB)

```sql
-- Trả về teacher_id của user hiện tại (NULL nếu không phải GV)
CREATE OR REPLACE FUNCTION public.current_teacher_id()
RETURNS UUID
LANGUAGE SQL STABLE
AS $$
  SELECT id FROM teachers WHERE auth_user_id = auth.uid() LIMIT 1
$$;

-- Trả về parent_id của user hiện tại (NULL nếu không phải PH)
CREATE OR REPLACE FUNCTION public.current_parent_id()
RETURNS UUID
LANGUAGE SQL STABLE
AS $$
  SELECT id FROM parents WHERE auth_user_id = auth.uid() LIMIT 1
$$;

-- Kiểm tra GV có sở hữu lớp không
CREATE OR REPLACE FUNCTION public.is_teacher_of_class(p_class_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM classes
    WHERE id = p_class_id AND teacher_id = current_teacher_id()
  )
$$;

-- Kiểm tra PH có liên kết với HS không
CREATE OR REPLACE FUNCTION public.is_parent_of_student(p_student_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM parent_students
    WHERE student_id = p_student_id AND parent_id = current_parent_id()
  )
$$;

-- Kiểm tra GV có dạy HS không
CREATE OR REPLACE FUNCTION public.is_teacher_of_student(p_student_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM students s
    JOIN classes c ON s.class_id = c.id
    WHERE s.id = p_student_id AND c.teacher_id = current_teacher_id()
  )
$$;
```

---

## 3. Policies cho từng bảng

### `teachers`
```sql
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teachers_select_self" ON teachers
  FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "teachers_insert_self" ON teachers
  FOR INSERT TO authenticated
  WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "teachers_update_self" ON teachers
  FOR UPDATE TO authenticated
  USING (auth_user_id = auth.uid());
```

### `parents`
```sql
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "parents_select_self" ON parents
  FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "parents_insert_self" ON parents
  FOR INSERT TO authenticated
  WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "parents_update_self" ON parents
  FOR UPDATE TO authenticated
  USING (auth_user_id = auth.uid());
```

### `classes`
```sql
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- GV thấy lớp mình
CREATE POLICY "classes_select_teacher" ON classes
  FOR SELECT TO authenticated
  USING (teacher_id = current_teacher_id());

-- PH thấy lớp con mình đang học
CREATE POLICY "classes_select_parent" ON classes
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students s
      JOIN parent_students ps ON ps.student_id = s.id
      WHERE s.class_id = classes.id
        AND ps.parent_id = current_parent_id()
    )
  );

-- GV tạo lớp
CREATE POLICY "classes_insert_teacher" ON classes
  FOR INSERT TO authenticated
  WITH CHECK (teacher_id = current_teacher_id());

CREATE POLICY "classes_update_teacher" ON classes
  FOR UPDATE TO authenticated
  USING (teacher_id = current_teacher_id());
```

### `students`
```sql
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- GV thấy HS lớp mình
CREATE POLICY "students_select_teacher" ON students
  FOR SELECT TO authenticated
  USING (is_teacher_of_class(class_id));

-- PH thấy con mình
CREATE POLICY "students_select_parent" ON students
  FOR SELECT TO authenticated
  USING (is_parent_of_student(id));

CREATE POLICY "students_insert_teacher" ON students
  FOR INSERT TO authenticated
  WITH CHECK (is_teacher_of_class(class_id));

CREATE POLICY "students_update_teacher" ON students
  FOR UPDATE TO authenticated
  USING (is_teacher_of_class(class_id));
```

### `parent_students`
```sql
ALTER TABLE parent_students ENABLE ROW LEVEL SECURITY;

-- PH thấy liên kết của mình
CREATE POLICY "ps_select_parent" ON parent_students
  FOR SELECT TO authenticated
  USING (parent_id = current_parent_id());

-- GV thấy liên kết HS lớp mình
CREATE POLICY "ps_select_teacher" ON parent_students
  FOR SELECT TO authenticated
  USING (is_teacher_of_student(student_id));

-- PH tự liên kết với HS (sẽ chờ GV verify)
CREATE POLICY "ps_insert_parent" ON parent_students
  FOR INSERT TO authenticated
  WITH CHECK (parent_id = current_parent_id());

-- GV verify liên kết
CREATE POLICY "ps_update_teacher" ON parent_students
  FOR UPDATE TO authenticated
  USING (is_teacher_of_student(student_id));
```

### `study_topics`
```sql
ALTER TABLE study_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "topics_select_teacher" ON study_topics
  FOR SELECT TO authenticated
  USING (is_teacher_of_class(class_id));

CREATE POLICY "topics_select_parent" ON study_topics
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students s
      JOIN parent_students ps ON ps.student_id = s.id
      WHERE s.class_id = study_topics.class_id
        AND ps.parent_id = current_parent_id()
    )
  );

CREATE POLICY "topics_modify_teacher" ON study_topics
  FOR ALL TO authenticated
  USING (is_teacher_of_class(class_id))
  WITH CHECK (is_teacher_of_class(class_id));
```

### `study_sessions`, `ai_chats`, `ai_messages`
```sql
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sessions_select_teacher" ON study_sessions
  FOR SELECT TO authenticated
  USING (is_teacher_of_student(student_id));

CREATE POLICY "sessions_select_parent" ON study_sessions
  FOR SELECT TO authenticated
  USING (is_parent_of_student(student_id));

CREATE POLICY "sessions_insert_parent" ON study_sessions
  FOR INSERT TO authenticated
  WITH CHECK (is_parent_of_student(student_id));

CREATE POLICY "sessions_update_parent" ON study_sessions
  FOR UPDATE TO authenticated
  USING (is_parent_of_student(student_id));

-- Tương tự cho ai_chats, ai_messages — qua session.student_id
ALTER TABLE ai_chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chats_access" ON ai_chats
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM study_sessions ss
      WHERE ss.id = ai_chats.session_id
        AND (is_teacher_of_student(ss.student_id) OR is_parent_of_student(ss.student_id))
    )
  );

ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_access" ON ai_messages
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_chats c
      JOIN study_sessions ss ON ss.id = c.session_id
      WHERE c.id = ai_messages.chat_id
        AND (is_teacher_of_student(ss.student_id) OR is_parent_of_student(ss.student_id))
    )
  );
```

### `notebook_uploads`
```sql
ALTER TABLE notebook_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "uploads_select_teacher" ON notebook_uploads
  FOR SELECT TO authenticated
  USING (is_teacher_of_student(student_id));

CREATE POLICY "uploads_select_parent" ON notebook_uploads
  FOR SELECT TO authenticated
  USING (is_parent_of_student(student_id));

CREATE POLICY "uploads_insert_parent" ON notebook_uploads
  FOR INSERT TO authenticated
  WITH CHECK (
    is_parent_of_student(student_id)
    AND uploaded_by_parent_id = current_parent_id()
  );
```

### `teacher_reviews`, `weekly_insights`
```sql
ALTER TABLE teacher_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_teacher" ON teacher_reviews
  FOR ALL TO authenticated
  USING (teacher_id = current_teacher_id())
  WITH CHECK (teacher_id = current_teacher_id());

ALTER TABLE weekly_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insights_teacher" ON weekly_insights
  FOR ALL TO authenticated
  USING (is_teacher_of_class(class_id));
```

### `weekly_reports`
```sql
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_select_parent" ON weekly_reports
  FOR SELECT TO authenticated
  USING (is_parent_of_student(student_id));

CREATE POLICY "reports_select_teacher" ON weekly_reports
  FOR SELECT TO authenticated
  USING (is_teacher_of_student(student_id));
```

### `audit_logs`
```sql
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Chỉ admin mới đọc được — MVP để service_role only (no policy = deny)
-- Production: thêm policy cho admin role
```

---

## 4. Storage RLS

### Bucket `notebook-uploads`
Storage policies trong Supabase Studio (Storage → Policies):

```sql
-- Path format: notebook-uploads/{student_id}/{filename}
CREATE POLICY "notebook_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'notebook-uploads'
    AND (
      is_teacher_of_student((storage.foldername(name))[1]::uuid)
      OR is_parent_of_student((storage.foldername(name))[1]::uuid)
    )
  );

CREATE POLICY "notebook_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'notebook-uploads'
    AND is_parent_of_student((storage.foldername(name))[1]::uuid)
  );
```

### Bucket `chat-images`
Tương tự `notebook-uploads` nhưng path `chat-images/{parent_id}/{uuid}.jpg`.

---

## 5. Service Role bypass

**Service Role key** (`SUPABASE_SECRET_KEY`) **bypass tất cả RLS**.

Dùng ở các trường hợp:
- Cron jobs (insight engine, weekly reports)
- Admin scripts
- Backfill data

→ **TUYỆT ĐỐI** không expose service role key xuống client.

---

## 6. Test RLS

### Manual test
1. Tạo 2 GV (A, B), mỗi người 1 lớp
2. Đăng nhập GV A → query `students` → chỉ thấy HS lớp A
3. Tạo 2 PH, mỗi PH liên kết 1 HS
4. Đăng nhập PH X → query `students` → chỉ thấy con X

### Automated test (sau MVP)
- Dùng Supabase test helpers
- pgTAP cho SQL-level test

---

## 7. Workflow khi tạo bảng mới

1. Tạo schema Drizzle
2. `pnpm drizzle-kit generate`
3. **Trước khi merge:** thêm RLS policies vào file `src/db/migrations/[timestamp]_rls.sql`
4. Apply migration
5. Verify bằng manual test với 2 user khác role

→ Đọc tiếp: [API_DESIGN.md](API_DESIGN.md)
