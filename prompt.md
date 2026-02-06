# Lovable Prompt for Frontend UI (Email Template + Send Email App)

Build a production-quality frontend for my existing backend API (Node.js + Express + MongoDB) for managing email templates and sending emails.

## Product Goal
Create a clean, modern dashboard-style web app where users can:
1. View and manage email templates (CRUD).
2. Compose and preview email template content with variables.
3. Send single emails using either direct HTML or a selected saved template.
4. Send bulk emails using a selected template and recipient-wise variables.
5. Automatically show a dynamic input form when a template is selected so users can fill required variable values.

Use:
- **React + TypeScript**
- **shadcn/ui** for all UI components and layout primitives
- **TanStack Query** for all data fetching/caching/mutations
- **Axios** for all HTTP calls

## Backend Contract to Integrate
Base URL: `http://localhost:5000`

### Health
- `GET /health`

### Templates
- `POST /api/templates`
- `GET /api/templates`
- `GET /api/templates/:id`
- `PUT /api/templates/:id`
- `DELETE /api/templates/:id`

Template entity shape:
- `name: string` (required, unique)
- `subject: string` (required)
- `htmlBody: string` (required)
- `description?: string`
- plus timestamps and `_id`

### Emails
- `POST /api/emails/send`
  - Mode A (direct html): `{ to, subject, html }`
  - Mode B (template): `{ to, templateId, variables }`
- `POST /api/emails/send-bulk`
  - Recommended payload: `{ templateId, recipients: [{ to, variables }] }`

Bulk response includes summary and per-recipient results.

### API Key Requirement
All mutation routes require `x-api-key` header (`POST/PUT/PATCH/DELETE`).
Implement a simple API key setting in UI (stored in localStorage), and inject it in axios request interceptor for mutation requests.

## Required Screens / UX

### 1) App Shell
- Left sidebar navigation (Dashboard, Templates, Send Email, Bulk Send, Settings)
- Top bar with page title and quick actions
- Responsive layout for desktop/tablet/mobile

### 2) Dashboard
- Cards: Total templates, last template updated, recent send attempts
- Lightweight activity section using available API data

### 3) Templates Page
- Data table of templates with search/filter/sort
- Row actions: View, Edit, Delete
- “Create Template” button opens modal or dedicated form page
- Form fields: name, subject, description, htmlBody
- Include **live preview panel** for htmlBody
- Extract template variables from htmlBody (e.g., `{{name}}`, `{{otp}}`) and display detected variable chips

### 4) Template Details / Editor
- Rich editing experience (textarea is fine, but polished)
- Variable helper section with insertion shortcuts
- Save as new / update existing
- Validation and user-friendly error messages

### 5) Send Email Page (Single)
- Toggle between:
  - Direct Compose mode (to, subject, html)
  - Template mode (to, template selector)
- When a template is selected:
  - Parse placeholders from `htmlBody`
  - Dynamically render form inputs for each variable
  - Allow user to fill variable values
  - Show final rendered preview before send
- Submit via `/api/emails/send`
- Show success/failure toast + response messageId

### 6) Bulk Send Page
- Template selector (required)
- After selection, auto-generate variable columns/fields
- Provide recipient input methods:
  - add rows manually
  - paste CSV-like lines
- Each row: `to` + variable inputs derived from selected template
- Preview payload before submit
- Submit to `/api/emails/send-bulk`
- Render results table with status badges and summary counts (sent/failed/total)

### 7) Settings Page
- API base URL field
- API key field
- Persist in localStorage
- “Test Connection” button hitting `/health`

## Technical Requirements
1. Use **TanStack Query** hooks for all reads and mutations.
2. Use a centralized **Axios client** with:
   - baseURL from settings
   - request interceptor for `x-api-key` on mutation methods
   - response error normalization
3. Organize code by feature modules:
   - `features/templates/*`
   - `features/email/*`
   - `features/settings/*`
   - `shared/api/*`, `shared/components/*`, `shared/utils/*`
4. Include strong typing for request/response DTOs.
5. Add loading, empty, and error states on every async screen.
6. Use shadcn components consistently (Card, Table, Dialog, Form, Input, Textarea, Tabs, Badge, Toast, etc.).
7. Keep UI polished and visually cohesive.

## Suggested Component/Hook Ideas
- `useTemplatesQuery`, `useTemplateQuery`, `useCreateTemplateMutation`, `useUpdateTemplateMutation`, `useDeleteTemplateMutation`
- `useSendEmailMutation`, `useSendBulkEmailMutation`
- `extractTemplateVariables(html: string): string[]`
- `renderTemplatePreview(html: string, variables: Record<string,string>): string`
- `ApiClientProvider` + query client provider

## Acceptance Criteria
- Full template CRUD works end-to-end.
- Single send and bulk send flows work end-to-end.
- Selecting a template dynamically shows variable form inputs.
- User can compose/manage templates and send emails from UI.
- All network operations use TanStack Query + Axios.
- UI is built with shadcn and is responsive.
- Clear validation + toasts + submit states included.

Also include a short README section explaining how to run the frontend and configure API base URL + API key.
