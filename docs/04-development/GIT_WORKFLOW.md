# Git Workflow — HocCungEm

> Solo dev sprint 9 ngày → workflow đơn giản, ưu tiên tốc độ.

---

## 1. Branching

- `main` — luôn deployable, mỗi commit auto deploy lên production qua Vercel
- `dev/*` — feature branch ngắn (vd: `dev/chat-streaming`)
- Merge bằng **squash & merge** để main sạch

Solo dev: cho phép push trực tiếp `main` cho hotfix nhỏ. Feature lớn thì PR self-review.

---

## 2. Commit message

Conventional Commits — xem [CODING_CONVENTIONS.md](CODING_CONVENTIONS.md#10-git-commit).

---

## 3. Daily flow

```bash
# Sáng
git pull
pnpm install   # nếu lock đổi

# Code
git checkout -b dev/feature-x
# ... code ...
git add .
git commit -m "feat(x): ..."

# Tối
git push origin dev/feature-x
# Mở PR self-review trên GitHub
# Merge squash
```

---

## 4. Pre-commit

`.husky/pre-commit`:
```sh
pnpm lint-staged
pnpm typecheck
```

`lint-staged.config.js`:
```js
export default {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"],
};
```

---

## 5. Vercel deploy

- Push lên `main` → auto deploy production
- Push lên branch khác → auto preview URL
- Test preview trước khi merge

---

## 6. Rollback

```bash
# Revert commit gần nhất trên main
git revert HEAD
git push

# Vercel sẽ build và deploy bản revert
```

Hoặc ở Vercel dashboard: Promote previous deploy.

---

## 7. Backup migration

Trước khi chạy migration production:
1. Snapshot Supabase DB (Settings → Database → Backups)
2. Chạy migration
3. Test smoke
4. Nếu lỗi: restore từ snapshot

→ Đọc tiếp: [DEPLOYMENT.md](DEPLOYMENT.md)
