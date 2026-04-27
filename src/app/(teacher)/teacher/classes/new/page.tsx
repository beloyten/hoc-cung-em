import type { Metadata } from "next"
import { BackLink, PageContainer, PageHeader } from "@/components/page-layout"
import { CreateClassForm } from "./create-class-form"

export const metadata: Metadata = { title: "Tạo lớp mới" }

export default function NewClassPage() {
  return (
    <PageContainer size="sm">
      <BackLink href="/teacher/dashboard">Bảng điều khiển</BackLink>
      <PageHeader
        className="mt-2"
        title="Tạo lớp mới"
        description="Sau khi tạo, bạn sẽ nhận một mã lớp 6 ký tự để gửi cho phụ huynh."
      />
      <div className="bg-card rounded-2xl border p-6 shadow-sm">
        <CreateClassForm />
      </div>
    </PageContainer>
  )
}
