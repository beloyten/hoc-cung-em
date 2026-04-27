# Supabase Auth Email Templates — HọcCùngEm

Copy từng template HTML bên dưới rồi dán vào **Supabase Dashboard → Authentication → Email Templates**. Mỗi tab (Confirm signup, Magic Link, Invite user, Change Email Address, Reset Password, Reauthentication) có 2 ô:

- **Subject heading** — dán dòng "Subject:" tương ứng
- **Message body** — dán toàn bộ khối HTML

Tất cả template:

- Tiếng Việt, không hard-code tên lớp / khối / trường
- Brand: nền xanh `#2563eb` (khớp nút CTA trong app), text-primary cho heading
- Ký tên: **Cô Mây & HọcCùngEm** — class-agnostic
- Hỗ trợ cả CTA link **và** mã OTP 6 chữ số (`{{ .Token }}`) cho người dùng dán vào trình duyệt nếu link trong email lỗi
- Plain-text fallback nằm ở comment HTML cuối mỗi template (Supabase tự sinh từ HTML, nhưng nếu cần có thể bật custom plain text)

> 💡 Trước khi dán, kiểm tra **Site URL** và **Redirect URLs** trong **Authentication → URL Configuration**. Nếu sai, link `{{ .ConfirmationURL }}` trong email sẽ bị từ chối.

---

## 1. Confirm signup (xác nhận đăng ký)

**Subject:**

```
Xác nhận tài khoản HọcCùngEm của bạn
```

**Message body (HTML):**

```html
<!doctype html>
<html lang="vi">
  <body
    style="margin:0;padding:0;background:#f5f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#0f172a;"
  >
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="background:#f5f7fb;padding:32px 12px;"
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            width="560"
            cellpadding="0"
            cellspacing="0"
            style="max-width:560px;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;padding:32px;"
          >
            <tr>
              <td style="font-size:20px;font-weight:700;color:#2563eb;padding-bottom:8px;">
                HọcCùngEm
              </td>
            </tr>
            <tr>
              <td style="font-size:16px;line-height:1.6;padding:8px 0;">
                <p style="margin:0 0 12px;">Xin chào,</p>
                <p style="margin:0 0 12px;">
                  Cảm ơn bạn đã tạo tài khoản trên <strong>HọcCùngEm</strong>. Vui lòng xác nhận địa
                  chỉ email <strong>{{ .Email }}</strong> để bắt đầu sử dụng.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:16px 0 8px;">
                <a
                  href="{{ .ConfirmationURL }}"
                  style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;font-size:15px;"
                  >Xác nhận tài khoản</a
                >
              </td>
            </tr>
            <tr>
              <td style="font-size:14px;line-height:1.6;color:#475569;padding-top:8px;">
                <p style="margin:0 0 8px;">Hoặc dán mã 6 chữ số sau khi được hỏi:</p>
                <p
                  style="margin:0;font-family:'SFMono-Regular',Menlo,Monaco,Consolas,monospace;font-size:22px;letter-spacing:4px;background:#f1f5f9;border-radius:8px;padding:10px 14px;display:inline-block;color:#0f172a;"
                >
                  {{ .Token }}
                </p>
              </td>
            </tr>
            <tr>
              <td
                style="font-size:13px;line-height:1.6;color:#64748b;padding-top:24px;border-top:1px solid #e2e8f0;margin-top:24px;"
              >
                <p style="margin:16px 0 8px;">
                  Nếu bạn không tạo tài khoản này, có thể bỏ qua email — tài khoản sẽ không được
                  kích hoạt.
                </p>
                <p style="margin:8px 0 0;">— Cô Mây &amp; HọcCùngEm</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## 2. Magic Link (đăng nhập bằng link)

**Subject:**

```
Link đăng nhập HọcCùngEm
```

**Message body (HTML):**

```html
<!doctype html>
<html lang="vi">
  <body
    style="margin:0;padding:0;background:#f5f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#0f172a;"
  >
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="background:#f5f7fb;padding:32px 12px;"
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            width="560"
            cellpadding="0"
            cellspacing="0"
            style="max-width:560px;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;padding:32px;"
          >
            <tr>
              <td style="font-size:20px;font-weight:700;color:#2563eb;padding-bottom:8px;">
                HọcCùngEm
              </td>
            </tr>
            <tr>
              <td style="font-size:16px;line-height:1.6;padding:8px 0;">
                <p style="margin:0 0 12px;">Xin chào,</p>
                <p style="margin:0 0 12px;">
                  Bạn vừa yêu cầu đăng nhập vào <strong>HọcCùngEm</strong> bằng email
                  <strong>{{ .Email }}</strong>. Bấm nút bên dưới để vào tài khoản — link có hiệu
                  lực trong vòng <strong>15 phút</strong>.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:16px 0 8px;">
                <a
                  href="{{ .ConfirmationURL }}"
                  style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;font-size:15px;"
                  >Đăng nhập ngay</a
                >
              </td>
            </tr>
            <tr>
              <td style="font-size:14px;line-height:1.6;color:#475569;padding-top:8px;">
                <p style="margin:0 0 8px;">Hoặc dán mã 6 chữ số sau:</p>
                <p
                  style="margin:0;font-family:'SFMono-Regular',Menlo,Monaco,Consolas,monospace;font-size:22px;letter-spacing:4px;background:#f1f5f9;border-radius:8px;padding:10px 14px;display:inline-block;color:#0f172a;"
                >
                  {{ .Token }}
                </p>
              </td>
            </tr>
            <tr>
              <td
                style="font-size:13px;line-height:1.6;color:#64748b;padding-top:24px;border-top:1px solid #e2e8f0;margin-top:24px;"
              >
                <p style="margin:16px 0 8px;">
                  Nếu bạn không yêu cầu đăng nhập, vui lòng bỏ qua email này — tài khoản của bạn vẫn
                  an toàn.
                </p>
                <p style="margin:8px 0 0;">— Cô Mây &amp; HọcCùngEm</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## 3. Invite user (mời tham gia)

**Subject:**

```
Lời mời tham gia HọcCùngEm
```

**Message body (HTML):**

```html
<!doctype html>
<html lang="vi">
  <body
    style="margin:0;padding:0;background:#f5f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#0f172a;"
  >
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="background:#f5f7fb;padding:32px 12px;"
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            width="560"
            cellpadding="0"
            cellspacing="0"
            style="max-width:560px;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;padding:32px;"
          >
            <tr>
              <td style="font-size:20px;font-weight:700;color:#2563eb;padding-bottom:8px;">
                HọcCùngEm
              </td>
            </tr>
            <tr>
              <td style="font-size:16px;line-height:1.6;padding:8px 0;">
                <p style="margin:0 0 12px;">Xin chào,</p>
                <p style="margin:0 0 12px;">
                  Bạn vừa được mời tham gia <strong>HọcCùngEm</strong> — nền tảng học tập có Cô Mây
                  AI đồng hành cùng học sinh và phụ huynh.
                </p>
                <p style="margin:0 0 12px;">
                  Bấm nút bên dưới để xác nhận lời mời và đặt mật khẩu cho tài khoản
                  <strong>{{ .Email }}</strong>:
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:16px 0 8px;">
                <a
                  href="{{ .ConfirmationURL }}"
                  style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;font-size:15px;"
                  >Chấp nhận lời mời</a
                >
              </td>
            </tr>
            <tr>
              <td
                style="font-size:13px;line-height:1.6;color:#64748b;padding-top:24px;border-top:1px solid #e2e8f0;margin-top:24px;"
              >
                <p style="margin:16px 0 8px;">
                  Nếu bạn không quen ai từ HọcCùngEm hoặc cho rằng email gửi nhầm, có thể bỏ qua
                  email này.
                </p>
                <p style="margin:8px 0 0;">— Cô Mây &amp; HọcCùngEm</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## 4. Change Email Address (đổi email)

**Subject:**

```
Xác nhận đổi email cho tài khoản HọcCùngEm
```

**Message body (HTML):**

```html
<!doctype html>
<html lang="vi">
  <body
    style="margin:0;padding:0;background:#f5f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#0f172a;"
  >
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="background:#f5f7fb;padding:32px 12px;"
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            width="560"
            cellpadding="0"
            cellspacing="0"
            style="max-width:560px;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;padding:32px;"
          >
            <tr>
              <td style="font-size:20px;font-weight:700;color:#2563eb;padding-bottom:8px;">
                HọcCùngEm
              </td>
            </tr>
            <tr>
              <td style="font-size:16px;line-height:1.6;padding:8px 0;">
                <p style="margin:0 0 12px;">Xin chào,</p>
                <p style="margin:0 0 12px;">Bạn đang yêu cầu đổi email tài khoản HọcCùngEm:</p>
                <p style="margin:0 0 12px;font-size:14px;color:#475569;">
                  Từ: <strong style="color:#0f172a;">{{ .Email }}</strong><br />Sang:
                  <strong style="color:#0f172a;">{{ .NewEmail }}</strong>
                </p>
                <p style="margin:0 0 12px;">
                  Bấm nút bên dưới để xác nhận. Sau khi xác nhận, bạn sẽ đăng nhập bằng email mới.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:16px 0 8px;">
                <a
                  href="{{ .ConfirmationURL }}"
                  style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;font-size:15px;"
                  >Xác nhận đổi email</a
                >
              </td>
            </tr>
            <tr>
              <td style="font-size:14px;line-height:1.6;color:#475569;padding-top:8px;">
                <p style="margin:0 0 8px;">Hoặc dán mã 6 chữ số sau:</p>
                <p
                  style="margin:0;font-family:'SFMono-Regular',Menlo,Monaco,Consolas,monospace;font-size:22px;letter-spacing:4px;background:#f1f5f9;border-radius:8px;padding:10px 14px;display:inline-block;color:#0f172a;"
                >
                  {{ .Token }}
                </p>
              </td>
            </tr>
            <tr>
              <td
                style="font-size:13px;line-height:1.6;color:#64748b;padding-top:24px;border-top:1px solid #e2e8f0;margin-top:24px;"
              >
                <p style="margin:16px 0 8px;">
                  Nếu bạn không yêu cầu đổi email, hãy bỏ qua email này. Email tài khoản của bạn sẽ
                  không thay đổi.
                </p>
                <p style="margin:8px 0 0;">— Cô Mây &amp; HọcCùngEm</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## 5. Reset Password (đặt lại mật khẩu)

**Subject:**

```
Đặt lại mật khẩu HọcCùngEm
```

**Message body (HTML):**

```html
<!doctype html>
<html lang="vi">
  <body
    style="margin:0;padding:0;background:#f5f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#0f172a;"
  >
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="background:#f5f7fb;padding:32px 12px;"
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            width="560"
            cellpadding="0"
            cellspacing="0"
            style="max-width:560px;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;padding:32px;"
          >
            <tr>
              <td style="font-size:20px;font-weight:700;color:#2563eb;padding-bottom:8px;">
                HọcCùngEm
              </td>
            </tr>
            <tr>
              <td style="font-size:16px;line-height:1.6;padding:8px 0;">
                <p style="margin:0 0 12px;">Xin chào,</p>
                <p style="margin:0 0 12px;">
                  Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản <strong>{{ .Email }}</strong> trên
                  HọcCùngEm. Bấm nút bên dưới để chọn mật khẩu mới — link có hiệu lực trong
                  <strong>30 phút</strong>.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:16px 0 8px;">
                <a
                  href="{{ .ConfirmationURL }}"
                  style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;font-size:15px;"
                  >Đặt lại mật khẩu</a
                >
              </td>
            </tr>
            <tr>
              <td style="font-size:14px;line-height:1.6;color:#475569;padding-top:8px;">
                <p style="margin:0 0 8px;">Hoặc dán mã 6 chữ số sau:</p>
                <p
                  style="margin:0;font-family:'SFMono-Regular',Menlo,Monaco,Consolas,monospace;font-size:22px;letter-spacing:4px;background:#f1f5f9;border-radius:8px;padding:10px 14px;display:inline-block;color:#0f172a;"
                >
                  {{ .Token }}
                </p>
              </td>
            </tr>
            <tr>
              <td
                style="font-size:13px;line-height:1.6;color:#64748b;padding-top:24px;border-top:1px solid #e2e8f0;margin-top:24px;"
              >
                <p style="margin:16px 0 8px;">
                  Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này — mật khẩu hiện tại
                  vẫn còn hiệu lực.
                </p>
                <p style="margin:8px 0 0;">— Cô Mây &amp; HọcCùngEm</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## 6. Reauthentication (xác thực lại trước thao tác nhạy cảm)

**Subject:**

```
Mã xác thực HọcCùngEm
```

**Message body (HTML):**

```html
<!doctype html>
<html lang="vi">
  <body
    style="margin:0;padding:0;background:#f5f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#0f172a;"
  >
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="background:#f5f7fb;padding:32px 12px;"
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            width="560"
            cellpadding="0"
            cellspacing="0"
            style="max-width:560px;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;padding:32px;"
          >
            <tr>
              <td style="font-size:20px;font-weight:700;color:#2563eb;padding-bottom:8px;">
                HọcCùngEm
              </td>
            </tr>
            <tr>
              <td style="font-size:16px;line-height:1.6;padding:8px 0;">
                <p style="margin:0 0 12px;">Xin chào,</p>
                <p style="margin:0 0 12px;">
                  Bạn vừa thực hiện một thao tác cần xác thực lại trên tài khoản
                  <strong>{{ .Email }}</strong>. Vui lòng nhập mã 6 chữ số sau vào ứng dụng — mã có
                  hiệu lực trong <strong>10 phút</strong>:
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:16px 0;">
                <p
                  style="margin:0;font-family:'SFMono-Regular',Menlo,Monaco,Consolas,monospace;font-size:28px;letter-spacing:6px;background:#f1f5f9;border-radius:10px;padding:14px 20px;display:inline-block;color:#0f172a;font-weight:700;"
                >
                  {{ .Token }}
                </p>
              </td>
            </tr>
            <tr>
              <td
                style="font-size:13px;line-height:1.6;color:#64748b;padding-top:24px;border-top:1px solid #e2e8f0;margin-top:24px;"
              >
                <p style="margin:16px 0 8px;">
                  Nếu bạn không thực hiện thao tác này, hãy đổi mật khẩu ngay và liên hệ với chúng
                  tôi qua
                  <a href="mailto:noreply@hoccungem.vn" style="color:#2563eb;"
                    >noreply@hoccungem.vn</a
                  >.
                </p>
                <p style="margin:8px 0 0;">— Cô Mây &amp; HọcCùngEm</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## Checklist sau khi cập nhật

- [ ] Dán xong cả 6 template ở Supabase Dashboard
- [ ] Authentication → URL Configuration: **Site URL** trỏ đúng `https://...` của production
- [ ] Authentication → URL Configuration: **Redirect URLs** đã include cả `localhost:3000` (dev) và domain production
- [ ] Test thử: tạo 1 tài khoản phụ huynh mới → kiểm tra inbox nhận email "Xác nhận tài khoản" đúng style
- [ ] Test thử: nhấn "Quên mật khẩu" trên `/login` → kiểm tra email reset

## Đổi màu thương hiệu

Tất cả template dùng `#2563eb` (blue-600) cho CTA. Nếu muốn đổi sang xanh ngọc (sky-600) `#0284c7` hoặc tím (`#4f46e5`), thay tất cả `background:#2563eb` và `color:#2563eb` bằng màu mới.
