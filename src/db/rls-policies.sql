-- =============================================================================
-- HocCungEm — RLS Policies + Helper Functions
-- =============================================================================
-- Apply sau khi `pnpm db:push` tạo schema xong:
--   psql "$DATABASE_URL" -f src/db/rls-policies.sql
-- Hoặc paste vào Supabase SQL Editor.
-- =============================================================================

-- ===== 1. Helper functions =====
CREATE OR REPLACE FUNCTION public.current_teacher_id()
RETURNS UUID LANGUAGE SQL STABLE AS $$
  SELECT id FROM teachers WHERE auth_user_id = auth.uid() LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.current_parent_id()
RETURNS UUID LANGUAGE SQL STABLE AS $$
  SELECT id FROM parents WHERE auth_user_id = auth.uid() LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_teacher_of_class(p_class_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM classes
    WHERE id = p_class_id AND teacher_id = current_teacher_id()
  )
$$;

CREATE OR REPLACE FUNCTION public.is_parent_of_student(p_student_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM parent_students
    WHERE student_id = p_student_id AND parent_id = current_parent_id()
  )
$$;

CREATE OR REPLACE FUNCTION public.is_teacher_of_student(p_student_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM students s
    JOIN classes c ON s.class_id = c.id
    WHERE s.id = p_student_id AND c.teacher_id = current_teacher_id()
  )
$$;

-- ===== 2. teachers =====
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "teachers_select_self" ON teachers FOR SELECT TO authenticated USING (auth_user_id = auth.uid());
CREATE POLICY "teachers_insert_self" ON teachers FOR INSERT TO authenticated WITH CHECK (auth_user_id = auth.uid());
CREATE POLICY "teachers_update_self" ON teachers FOR UPDATE TO authenticated USING (auth_user_id = auth.uid());

-- ===== 3. parents =====
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "parents_select_self" ON parents FOR SELECT TO authenticated USING (auth_user_id = auth.uid());
CREATE POLICY "parents_insert_self" ON parents FOR INSERT TO authenticated WITH CHECK (auth_user_id = auth.uid());
CREATE POLICY "parents_update_self" ON parents FOR UPDATE TO authenticated USING (auth_user_id = auth.uid());

-- ===== 4. classes =====
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "classes_select_teacher" ON classes FOR SELECT TO authenticated USING (teacher_id = current_teacher_id());
CREATE POLICY "classes_select_parent" ON classes FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM students s
    JOIN parent_students ps ON ps.student_id = s.id
    WHERE s.class_id = classes.id AND ps.parent_id = current_parent_id()
  )
);
CREATE POLICY "classes_insert_teacher" ON classes FOR INSERT TO authenticated WITH CHECK (teacher_id = current_teacher_id());
CREATE POLICY "classes_update_teacher" ON classes FOR UPDATE TO authenticated USING (teacher_id = current_teacher_id());

-- ===== 5. students =====
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "students_select_teacher" ON students FOR SELECT TO authenticated USING (is_teacher_of_class(class_id));
CREATE POLICY "students_select_parent" ON students FOR SELECT TO authenticated USING (is_parent_of_student(id));
CREATE POLICY "students_insert_teacher" ON students FOR INSERT TO authenticated WITH CHECK (is_teacher_of_class(class_id));
CREATE POLICY "students_update_teacher" ON students FOR UPDATE TO authenticated USING (is_teacher_of_class(class_id));

-- ===== 6. parent_students =====
ALTER TABLE parent_students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ps_select_parent" ON parent_students FOR SELECT TO authenticated USING (parent_id = current_parent_id());
CREATE POLICY "ps_select_teacher" ON parent_students FOR SELECT TO authenticated USING (is_teacher_of_student(student_id));
CREATE POLICY "ps_insert_parent" ON parent_students FOR INSERT TO authenticated WITH CHECK (parent_id = current_parent_id());
CREATE POLICY "ps_update_teacher" ON parent_students FOR UPDATE TO authenticated USING (is_teacher_of_student(student_id));

-- ===== 7. study_topics =====
ALTER TABLE study_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "topics_select_teacher" ON study_topics FOR SELECT TO authenticated USING (is_teacher_of_class(class_id));
CREATE POLICY "topics_select_parent" ON study_topics FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM students s
    JOIN parent_students ps ON ps.student_id = s.id
    WHERE s.class_id = study_topics.class_id AND ps.parent_id = current_parent_id()
  )
);
CREATE POLICY "topics_modify_teacher" ON study_topics FOR ALL TO authenticated USING (is_teacher_of_class(class_id)) WITH CHECK (is_teacher_of_class(class_id));

-- ===== 8. study_sessions =====
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sessions_select_teacher" ON study_sessions FOR SELECT TO authenticated USING (is_teacher_of_student(student_id));
CREATE POLICY "sessions_select_parent" ON study_sessions FOR SELECT TO authenticated USING (is_parent_of_student(student_id));
CREATE POLICY "sessions_insert_parent" ON study_sessions FOR INSERT TO authenticated WITH CHECK (is_parent_of_student(student_id));
CREATE POLICY "sessions_update_parent" ON study_sessions FOR UPDATE TO authenticated USING (is_parent_of_student(student_id));

-- ===== 9. ai_chats =====
ALTER TABLE ai_chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chats_access" ON ai_chats FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM study_sessions ss
    WHERE ss.id = ai_chats.session_id
      AND (is_teacher_of_student(ss.student_id) OR is_parent_of_student(ss.student_id))
  )
);

-- ===== 10. ai_messages =====
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_access" ON ai_messages FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM ai_chats c
    JOIN study_sessions ss ON ss.id = c.session_id
    WHERE c.id = ai_messages.chat_id
      AND (is_teacher_of_student(ss.student_id) OR is_parent_of_student(ss.student_id))
  )
);

-- ===== 11. notebook_uploads =====
ALTER TABLE notebook_uploads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "uploads_select_teacher" ON notebook_uploads FOR SELECT TO authenticated USING (is_teacher_of_student(student_id));
CREATE POLICY "uploads_select_parent" ON notebook_uploads FOR SELECT TO authenticated USING (is_parent_of_student(student_id));
CREATE POLICY "uploads_insert_parent" ON notebook_uploads FOR INSERT TO authenticated WITH CHECK (
  is_parent_of_student(student_id) AND uploaded_by_parent_id = current_parent_id()
);

-- ===== 12. teacher_reviews =====
ALTER TABLE teacher_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_teacher" ON teacher_reviews FOR ALL TO authenticated USING (teacher_id = current_teacher_id()) WITH CHECK (teacher_id = current_teacher_id());

-- ===== 13. weekly_insights =====
ALTER TABLE weekly_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insights_teacher" ON weekly_insights FOR ALL TO authenticated USING (is_teacher_of_class(class_id));

-- ===== 14. weekly_reports =====
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports_select_parent" ON weekly_reports FOR SELECT TO authenticated USING (is_parent_of_student(student_id));
CREATE POLICY "reports_select_teacher" ON weekly_reports FOR SELECT TO authenticated USING (is_teacher_of_student(student_id));

-- ===== 15. audit_logs =====
-- Service role only — no policy = deny by default
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
