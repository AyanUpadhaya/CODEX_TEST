# Lovable Prompt for Full Authentication + Authorization (Frontend integrated with API)

Build a production-ready authentication and authorization system for my existing API-driven app.

## Objective
Create complete **AuthN + AuthZ** flows in the frontend, fully integrated with backend APIs, including:
1. Sign up
2. Login
3. Logout
4. Forgot password / reset password
5. Email verification (optional but preferred)
6. Protected routes and role-based access control (RBAC)
7. Token/session handling with refresh flow
8. User profile + role-aware UI rendering

Use:
- **React + TypeScript**
- **shadcn/ui** for UI components
- **TanStack Query** for server state
- **Axios** for API calls
- **React Router** for route protection
- **Zod + React Hook Form** for validation/forms

---

## Backend Integration Contract
Base URL: `http://localhost:5000` (make configurable from environment/settings)

> If my backend endpoints differ, keep the architecture and quickly map endpoint paths in one config file.

### Auth Endpoints (assume this shape)
- `POST /api/auth/register`
  - body: `{ name, email, password }`
  - response: `{ user, accessToken, refreshToken }` or `{ message }`

- `POST /api/auth/login`
  - body: `{ email, password }`
  - response: `{ user, accessToken, refreshToken }`

- `POST /api/auth/refresh`
  - body: `{ refreshToken }` (or use httpOnly cookie if backend supports it)
  - response: `{ accessToken, refreshToken? }`

- `POST /api/auth/logout`
  - body: optional
  - response: `{ message }`

- `POST /api/auth/forgot-password`
  - body: `{ email }`

- `POST /api/auth/reset-password`
  - body: `{ token, newPassword }`

- `GET /api/auth/me`
  - returns current user profile: `{ id, name, email, role, permissions[] }`

- Optional:
  - `POST /api/auth/verify-email`
  - `POST /api/auth/resend-verification`

### User / Admin Endpoints (for authorization checks)
- `GET /api/users/me`
- `GET /api/admin/*` (admin-only examples)

---

## Required Features

### 1) Auth State Management
Implement a centralized auth module:
- `AuthProvider` + `useAuth()` hook
- Store `accessToken` securely in memory + persistence strategy (localStorage/sessionStorage configurable)
- Support refresh token flow (preferred via httpOnly cookie; if not available, secure fallback)
- Auto-hydrate session on app startup by calling `/auth/me` or refresh endpoint

### 2) Axios Client with Interceptors
Create a shared Axios client:
- Attach `Authorization: Bearer <accessToken>` on protected requests
- On `401`, attempt single refresh flow and retry failed request
- Queue pending requests while refresh is in progress to avoid refresh storms
- If refresh fails, clear auth state and redirect to `/login`
- Normalize API errors into friendly format for UI

### 3) Pages / Screens
Create polished pages with shadcn components:
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password?token=...`
- `/verify-email` (if enabled)
- `/profile`
- `/unauthorized`
- Protected app pages (dashboard + sample admin page)

Each page should include:
- Loading states
- Validation messages
- Error/success toasts
- Proper disabled/submit states

### 4) Route Protection
Implement reusable guards:
- `ProtectedRoute` → requires authenticated user
- `PublicOnlyRoute` → blocks login/register when already authenticated
- `RoleGuard` → restrict by role (`admin`, `manager`, `user`)
- `PermissionGuard` → restrict by permission strings if provided

Handle edge cases:
- Unknown auth state during startup (show splash loader)
- Expired token while on protected page
- Redirect back to originally requested route after login

### 5) Role-Based UI / Navigation
- Build navigation that shows/hides menu items by role/permission
- Example:
  - Admin sees “Admin Panel”, “User Management”
  - User sees only allowed routes
- Add a simple `Can` component/helper:
  - `<Can roles={["admin"]}>...</Can>`
  - `<Can permissions={["user:read"]}>...</Can>`

### 6) Forms + Validation Rules
- Registration: name, email, password, confirm password
- Login: email, password
- Forgot/reset password with strong password rules
- Validate via Zod schemas with reusable validators
- Show backend validation messages gracefully

### 7) Security Best Practices
- Prefer httpOnly secure cookies for refresh tokens when backend supports it
- Never expose refresh token unnecessarily in UI state
- Clear all auth-sensitive cache/query data on logout
- Add CSRF note/strategy if cookie-based auth is used
- Prevent infinite refresh loops
- Add basic brute-force UX protections (e.g., temporary lock message when API indicates too many attempts)

### 8) Developer Experience / Architecture
Organize files by feature:
- `features/auth/api/*`
- `features/auth/hooks/*`
- `features/auth/components/*`
- `features/auth/pages/*`
- `features/auth/guards/*`
- `shared/api/*`
- `shared/types/*`
- `shared/lib/*`

Include:
- Strong TypeScript DTOs for auth/user responses
- Reusable query keys and hooks
- Clean separation of UI, domain logic, and API logic

---

## Suggested Hook/API Layer
- `useLoginMutation`
- `useRegisterMutation`
- `useLogoutMutation`
- `useForgotPasswordMutation`
- `useResetPasswordMutation`
- `useCurrentUserQuery`
- `useRefreshTokenMutation`

Utilities:
- `setAuthToken/getAuthToken/clearAuthToken`
- `isTokenExpired`
- `decodeJwtPayload` (if needed for lightweight checks)

---

## Acceptance Criteria
1. User can register, login, and logout successfully.
2. Protected routes are inaccessible without auth.
3. RBAC works for admin vs non-admin routes/components.
4. Access token refresh works automatically on expiry.
5. On refresh failure, user is safely logged out and redirected.
6. Forgot/reset password flow is fully functional.
7. Auth state persists across reloads and restores correctly.
8. UI is responsive, clean, and consistent with shadcn.
9. All API integration uses Axios + TanStack Query.
10. Codebase is modular, typed, and maintainable.

---

## Deliverables
1. Complete frontend auth + authorization implementation.
2. Route guard system (auth + role + permission).
3. Axios interceptor + refresh token handling.
4. Reusable auth hooks and components.
5. Minimal README section with:
   - environment variables
   - how to run
   - endpoint mapping/configuration
   - auth flow explanation.

Also add sample mock role matrix in code comments so it is easy to adapt to real backend roles.
