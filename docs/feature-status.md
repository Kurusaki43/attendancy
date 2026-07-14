# Feature Status

Snapshot of what's implemented vs. planned, kept up to date as domains land. Cross-reference with
[`docs/todo.md`](todo.md) for in-flight refactor/hardening work on already-shipped features.

Legend: `[x]` shipped · `[~]` partial/in progress · `[ ]` not started

Last updated: **2026-07-14**

---

## Domain status

| Domain / Feature                                                          | Prisma model         | Server (repo/service/action)                | UI / Routes                     | Status                          |
| ------------------------------------------------------------------------- | -------------------- | ------------------------------------------- | ------------------------------- | ------------------------------- |
| Auth (register, login/logout, email verify, password reset, Google OAuth) | `User`, `Otp`        | Full                                        | Full — `(auth)/*` routes        | ✅ Fully implemented            |
| Sessions (list, revoke, revoke-others)                                    | `Session`            | Full                                        | Full — `/dashboard/settings`    | ✅ Fully implemented            |
| Departments                                                               | `Department`         | Full CRUD                                   | Full — `/dashboard/departments` | ✅ Fully implemented            |
| Transactional email (verify / welcome / reset-password)                   | —                    | Full (BullMQ queue + worker + 3 templates)  | n/a                             | ✅ Fully implemented            |
| Dashboard home                                                            | —                    | —                                           | Placeholder (`<div>Home</div>`) | 🚧 Stub                         |
| Role / Permission                                                         | `Role`, `Permission` | Static TS constants only, no DB-backed CRUD | none                            | ⚠️ Schema exists, no admin CRUD |
| Position                                                                  | `Position`           | None — no repository/service/action         | none                            | ⚠️ Schema-only, unwired         |
| Employees                                                                 | **no model**         | None                                        | Nav link only → 404             | ❌ Not started                  |
| Attendance (clock in/out, records)                                        | **no model**         | None                                        | 3 nav links only → 404          | ❌ Not started                  |
| Leave management                                                          | **no model**         | None                                        | 2 nav links only → 404          | ❌ Not started                  |
| Analytics / Audit log                                                     | —                    | None                                        | Nav links only → 404            | ❌ Not started                  |

---

## Checklist by domain

### ✅ Auth

- [x] Register
- [x] Login / logout
- [x] Email verification (send + resend + verify)
- [x] Forgot / reset password
- [x] Google OAuth
- [x] Turnstile captcha
- [x] Session creation + refresh-token rotation

### ✅ Sessions

- [x] List active sessions
- [x] Revoke a single session
- [x] Revoke all other sessions

### ✅ Departments (reference implementation)

- [x] Create
- [x] Read / get one
- [x] List (paginated, searchable, filterable)
- [x] Update
- [x] Delete

### ✅ Mail

- [x] Email verification template + send
- [x] Welcome email
- [x] Password reset email
- [x] BullMQ queue + dedicated worker process

### ⚠️ RBAC (Role / Permission)

- [x] Static permission matrix (`src/server/auth/constants/permissions.ts`)
- [x] Static role → permission mapping (`role_permissions.ts`)
- [x] `requirePermission` / `requireRole` guards wired into actions
- [ ] DB-backed admin CRUD for roles/permissions (currently constants-only; requires `pnpm db:seed` to sync DB rows)

### ⚠️ Position

- [x] Prisma model + migration
- [ ] Repository
- [ ] Service layer
- [ ] Actions
- [ ] UI

### ❌ Employees

- [ ] `Employee` Prisma model (department FK, position FK, hire date, etc.)
- [ ] Repository / service / actions
- [ ] List/create/edit/delete UI
- [ ] Wire up `/dashboard/employees` route (currently 404)

### ❌ Attendance

- [ ] `Attendance` Prisma model
- [ ] Clock in / clock out logic
- [ ] "My attendance" view
- [ ] "All attendance" admin view
- [ ] Wire up `/dashboard/attendance/{all,clock,me}` routes (currently 404)
- [x] Permission constants already defined (`ATTENDANCE_READ_ALL`, `ATTENDANCE_READ_SELF`, `ATTENDANCE_CLOCK_IN`, `ATTENDANCE_CLOCK_OUT`, `ATTENDANCE_EDIT`)

### ❌ Leave management

- [ ] `Leave` Prisma model
- [ ] Request / approve / reject flow
- [ ] "My leave" view
- [ ] "Leave requests" admin view
- [ ] Wire up `/dashboard/leave/{manage,me}` routes (currently 404)
- [x] Permission constants already defined (`LEAVE_CREATE`, `LEAVE_READ_SELF`, `LEAVE_READ_ALL`, `LEAVE_APPROVE`, `LEAVE_REJECT`)

### ❌ Analytics / Audit log

- [ ] Data model
- [ ] Server domain
- [ ] UI

---

## History of changes

| Date       | Change                                                                                                                                                                                                                                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-07-14 | Initial audit: full inventory of `src/server/`, `src/features/`, `src/app/` routes, and `prisma/schema.prisma` models. Confirmed Auth, Sessions, Departments, and Mail are fully implemented; Attendance, Leave, and Employees exist only as permission constants + dead nav links with no data model or backend. |
