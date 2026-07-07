# Refactor Todo — ordered by severity

Legend: `[ ]` not started · `[~]` in progress · `[x]` done

---

## 🔴 Critical (blocks safe multi-user use)

- [x] **No authorization on any Department action.** None of the 5 files in
      `src/features/departments/actions/` call `requireAuth`/`requirePermission`/`requireRole`.
      The only auth check in the request path is `getCurrentUser()` in
      [`dashboard/layout.tsx`](<src/app/(protected)/dashboard/layout.tsx>), which gates page
      _rendering_ only — Next.js Server Actions are independent RPC endpoints and do not inherit
      layout checks. Any authenticated user of any role can currently create/update/delete
      departments; permission definitions already exist in
      [`permissions.ts`](src/features/auth/constants/permissions.ts) but are unused here.
  - [x] `create-department.action.ts` — added `requirePermission(PERMISSIONS.DEPARTMENT_CREATE)`
  - [x] `update-department.action.ts` — added `requirePermission(PERMISSIONS.DEPARTMENT_UPDATE)`
  - [x] `delete-department.action.ts` — added `requirePermission(PERMISSIONS.DEPARTMENT_DELETE)`
  - [x] `get-department.action.ts` — added `requirePermission(PERMISSIONS.DEPARTMENT_READ)`
  - [x] `get-all-departments.action.ts` — added `requirePermission(PERMISSIONS.DEPARTMENT_READ)`
  - [x] Convention decided: guard call lives at the top of the **action**'s `try` block (has
        request context via `getCurrentUser`). Also had to guard against a subtle bug: the guard
        chain (`requirePermission` → `getCurrentUser` → `requireAuth`) can call Next's `redirect()`
        on a missing/expired session, which throws a special control-flow error — the existing
        `catch (error) { if (error instanceof AppError) ... }` blocks would have silently swallowed
        that redirect and returned a generic error instead. Fixed by calling
        `unstable_rethrow(error)` (from `next/navigation`) as the first line of every catch block
        touched, so redirects propagate and only real errors get mapped to `ActionResult`.

---

## 🟠 High

- [x] **`BadRequestError.code` is typed `string`, not `ErrorCode`.** Every other AppError subclass
      (`NotFoundError`, `ConflictError`, `ForbiddenError`, `UnauthorizedError`, `InternalServerError`)
      takes `code: ErrorCode` from [`error-codes.ts`](src/lib/errors/error-codes.ts).
      `BadRequestError` ([`bad-request-error.ts`](src/lib/errors/bad-request-error.ts)) is the odd
      one out — a typo'd code there won't be caught at compile time. Change to `ErrorCode`.
      Tightening the type surfaced 3 codes that were never registered
      (`GOOGLE_PROFILE_FETCH_FAILED`, `SOCIAL_LOGIN_ONLY`, `GOOGLE_EMAIL_NOT_VERIFIED`) — added them
      to `ERROR_CODES` and switched every raw string-literal call site (including two on
      `ConflictError`/`InternalServerError` that happened to match by coincidence) to reference
      `ERROR_CODES.*` instead, so a future typo fails to compile instead of silently minting a new
      untracked code.

- [x] **`ApiFeaturesBuilder.filter()` has no field allowlist.** In
      [`api-features.builder.ts`](src/shared/builders/api-features.builder.ts), `filter()` builds
      the Prisma `where` clause directly from arbitrary query-string keys with no allowlist —
      only `search()` restricts itself to `searchableFields`. Low blast radius today (Department
      has few/harmless fields), but if this builder is reused as-is on `User` or a future
      `Employee` model, a request like `?passwordHash[gt]=` would pass straight through to Prisma.
      Add an explicit `filterableFields` list mirroring `searchableFields` before reusing this
      builder on any sensitive model.
      Added a third constructor arg `filterableFields: string[] = []` — defaults to **no** ad-hoc
      filtering (safe by default) rather than "everything", so every future caller must opt in
      explicitly. `getAllDepartments` now passes `DEPARTMENT_FILTERABLE_FIELDS = ['isActive']`.

- [ ] **Identical try/catch error-mapping duplicated 11 times.** Every action in
      `src/features/auth/actions/` (6 files) and `src/features/departments/actions/` (5 files)
      repeats the same `if (error instanceof AppError) { ... } return { success: false, message:
'Something went wrong.' }` block. Extract into a single `runAction()` (or similar) wrapper in
      `src/shared/` so the mapping logic — including future additions like Zod-error formatting —
      lives in one place. - [ ] Design wrapper signature (input: fn that may throw `AppError`; output: `ActionResult<T>`) - [ ] Migrate auth actions (6 files) - [ ] Migrate department actions (5 files)

---

## 🟡 Medium

- [ ] **Dead code left over from the query/pagination refactor:** - [ ] `departmentRepository.getAll()` in [`department.repository.ts`](src/features/departments/department.repository.ts) — unused; `getAllDepartments` service uses `findMany` instead. - [ ] `PaginationUtil` class in [`pagination.ts`](src/shared/utils/pagination.ts) — fully superseded by `buildPaginationMeta` in `api-features.ts`; nothing calls it. - [ ] `GetAllDepartmentsServiceResult` type in [`service-results.ts`](src/features/departments/types/service-results.ts) — unused; service returns an inline interface instead. - [ ] `DepartmentDialog.tsx` — generalized create/update dialog exported from `index.ts` but never rendered anywhere; superseded by `AddDepartmentDialog` + `EditDepartmentDialog`.

- [ ] **Filename/naming inconsistencies:** - [ ] `DeleteDepartementDialog.tsx` (typo in filename) exports `DeleteDepartmentDialog`
      (correct spelling) as default — rename file to match, decide on named vs default export. - [ ] `DepartmentsPageProps.searchParams` in
      [`departments/page.tsx`](<src/app/(protected)/dashboard/departments/page.tsx>) has a
      `seach?: string` typo'd/dead field, and the type doesn't match Next 15's actual
      `Promise<...>` searchParams shape — the annotation isn't protecting anything currently.

---

## 🟢 Low / nice-to-have

- [ ] `Department.isActive` / `Position.isActive` in `schema.prisma` have no `@default(...)` at
      the DB level — currently safe because Zod always supplies a default before the Prisma call,
      but any direct `prisma.department.create` outside the service (seed scripts, console) will
      fail on a missing required field. Consider `@default(true)` for defense in depth.
- [ ] Confirm `docker/dev/Dockerfile` is intentionally a placeholder (currently ~empty) — fine for
      dev-infra-only compose today, but flag before assuming a prod image exists.
