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

- [x] **Identical try/catch error-mapping duplicated 11 times.** Every action in
      `src/features/auth/actions/` (6 files) and `src/features/departments/actions/` (5 files)
      repeats the same `if (error instanceof AppError) { ... } return { success: false, message:
'Something went wrong.' }` block. Extract into a single `runAction()` (or similar) wrapper in
      `src/shared/` so the mapping logic — including future additions like Zod-error formatting —
      lives in one place.
  - [x] Added `runAction()` in [`shared/utils/run-action.ts`](src/shared/utils/run-action.ts):
        runs the action body, maps `AppError` → `ActionResult` failure, calls `unstable_rethrow`
        first so redirects from guards still propagate. Takes an optional `onError` escape hatch
        for the couple of actions that need custom handling before the default mapping.
  - [x] Migrated all 6 auth actions and all 5 department actions.
  - [x] **Bug found during migration (fixed):** `login.action.ts`'s special-case handler for
        "email not verified" checked `error.code === ERROR_CODES.UNAUTHORIZED`, but
        `login.service.ts` actually throws `ERROR_CODES.EMAIL_NOT_VERIFIED` for that case — so the
        branch was dead code. The pending-email-verification cookie never got set on a failed
        login, which meant a returning unverified user got bounced `/login` → `/verify-email` →
        `/register` in a loop (the verify-email page redirects to `/register` when that cookie is
        missing). Fixed the code comparison to match what the service actually throws.

---

## 🟡 Medium

- [x] **Dead code left over from the query/pagination refactor:**
  - [x] `departmentRepository.getAll()` — removed; `getAllDepartments` service uses `findMany` instead.
  - [x] `PaginationUtil` class in `shared/utils/pagination.ts` — file deleted; fully superseded by `buildPaginationMeta` in `api-features.ts`.
  - [x] `GetAllDepartmentsServiceResult` type — removed from `service-results.ts`; service returns an inline interface instead.
  - [x] `DepartmentDialog.tsx` — deleted; was exported from `index.ts` but never rendered anywhere, superseded by `AddDepartmentDialog` + `EditDepartmentDialog`.

- [x] **Filename/naming inconsistencies:**
  - [x] `DeleteDepartementDialog.tsx` → renamed to `DeleteDepartmentDialog.tsx`; dropped the
        redundant `export default` so it's a named export like `AddDepartmentDialog` /
        `EditDepartmentDialog`, and updated the one import site in `DepartmentsTable.tsx`.
  - [x] `DepartmentsPageProps.searchParams` in `departments/page.tsx` — replaced the dead/typo'd
        inline shape with `Promise<Record<string, string>>`, matching both Next 15's actual async
        searchParams and what `getAllDepartmentsAction` expects.

---

## 🟢 Low / nice-to-have

- [ ] `Department.isActive` / `Position.isActive` in `schema.prisma` have no `@default(...)` at
      the DB level — currently safe because Zod always supplies a default before the Prisma call,
      but any direct `prisma.department.create` outside the service (seed scripts, console) will
      fail on a missing required field. Consider `@default(true)` for defense in depth.
- [ ] Confirm `docker/dev/Dockerfile` is intentionally a placeholder (currently ~empty) — fine for
      dev-infra-only compose today, but flag before assuming a prod image exists.
