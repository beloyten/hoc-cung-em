// src/app/(teacher)/teacher/topics/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { desc, eq } from "drizzle-orm"
import { db } from "@/db"
import { classes, studyTopics } from "@/db/schema"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { BackLink, EmptyState, PageContainer, PageHeader } from "@/components/page-layout"
import { AuthError, requireTeacher } from "@/server/auth"
import { TopicCreateForm } from "./topic-create-form"
import { DeleteTopicButton } from "./delete-topic-button"

export const metadata: Metadata = {
  title: "Chủ đề tuần",
}

export default async function TeacherTopicsPage() {
  let teacherId: string
  try {
    const { teacher } = await requireTeacher()
    teacherId = teacher.id
  } catch (e) {
    if (e instanceof AuthError) {
      redirect(e.code === "UNAUTHENTICATED" ? "/login" : "/onboarding")
    }
    throw e
  }

  const teacherClasses = await db
    .select({ id: classes.id, name: classes.name, grade: classes.grade })
    .from(classes)
    .where(eq(classes.teacherId, teacherId))

  const topicsByClass = await Promise.all(
    teacherClasses.map(async (c) => ({
      class: c,
      topics: await db
        .select()
        .from(studyTopics)
        .where(eq(studyTopics.classId, c.id))
        .orderBy(desc(studyTopics.weekNumber)),
    })),
  )

  return (
    <PageContainer>
      <BackLink href="/teacher/dashboard">Bảng điều khiển</BackLink>
      <PageHeader
        className="mt-2"
        title="Chủ đề tuần"
        description="Đặt chủ đề học mỗi tuần để Cô Mây hỗ trợ con đúng nội dung lớp đang học."
      />

      {teacherClasses.length === 0 ? (
        <EmptyState
          icon="🎓"
          title="Bạn chưa có lớp nào"
          description="Tạo lớp đầu tiên để bắt đầu thêm chủ đề học tuần."
          action={
            <Link href="/teacher/classes/new" className={buttonVariants()}>
              + Tạo lớp đầu tiên
            </Link>
          }
        />
      ) : (
        <div className="space-y-10">
          {topicsByClass.map(({ class: c, topics }) => (
            <section key={c.id}>
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-semibold">
                  Lớp {c.name}{" "}
                  <span className="text-muted-foreground text-sm font-normal">
                    (Khối {c.grade})
                  </span>
                </h2>
                <span className="text-muted-foreground text-xs">{topics.length} chủ đề</span>
              </div>

              <details className="bg-card mb-4 rounded-2xl border p-5 shadow-sm open:shadow-md">
                <summary className="cursor-pointer list-none text-sm font-medium select-none">
                  <span className="text-primary">+ Thêm chủ đề mới</span>
                  <span className="text-muted-foreground ml-2 text-xs font-normal">
                    (chạm để mở rộng)
                  </span>
                </summary>
                <div className="mt-5 border-t pt-5">
                  <TopicCreateForm classId={c.id} />
                </div>
              </details>

              {topics.length === 0 ? (
                <EmptyState
                  icon="📚"
                  title="Chưa có chủ đề nào cho lớp này"
                  description="Mở khung phía trên để thêm chủ đề tuần đầu tiên."
                />
              ) : (
                <ul className="space-y-3">
                  {topics.map((t) => (
                    <li
                      key={t.id}
                      className="bg-card flex items-start justify-between gap-3 rounded-2xl border p-4 shadow-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            Tuần {t.weekNumber}
                          </Badge>
                          <span className="text-muted-foreground text-xs">
                            {t.startDate} → {t.endDate}
                          </span>
                        </div>
                        <p className="font-medium">{t.title}</p>
                        {t.description && (
                          <p className="text-muted-foreground mt-1 text-sm">{t.description}</p>
                        )}
                        {t.context && (
                          <p className="text-muted-foreground mt-2 line-clamp-2 text-xs italic">
                            🤖 Cô Mây sẽ dùng: {t.context.slice(0, 200)}
                            {t.context.length > 200 ? "…" : ""}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <Link
                          href={`/teacher/topics/${t.id}/edit`}
                          className={buttonVariants({ variant: "outline", size: "sm" })}
                        >
                          Sửa
                        </Link>
                        <DeleteTopicButton topicId={t.id} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
