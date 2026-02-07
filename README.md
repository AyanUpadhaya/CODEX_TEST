# Email Server API

Express.js API for:
- storing/retrieving email templates (CRUD)
- sending single and bulk emails with Nodemailer
- user management with JWT authentication and role-based authorization
- activity logging for key system events (signups, logins, template creation, single and bulk sends)
- MongoDB + Mongoose persistence

## Setup

1. Copy env file and update values:
   ```bash
   cp .env.sample .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

## Seed data

Seed sample templates:
```bash
npm run seed
```

Seed one default user:
```bash
npm run seed:users
```

## API endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password/:token`
- `GET /api/auth/users` (admin/manager only)

### Templates CRUD
- `POST /api/templates` (admin/manager)
- `GET /api/templates`
- `GET /api/templates/:id`
- `PUT /api/templates/:id` (admin/manager)
- `PATCH /api/templates/:id` (admin/manager)
- `DELETE /api/templates/:id` (admin/manager)

### Emails
- `POST /api/emails/send` (admin/manager/staff)
- `POST /api/emails/send-bulk` (admin/manager/staff)


### Logs
- `GET /api/logs` (admin/manager)
- `GET /api/logs/:id` (admin/manager)
- `DELETE /api/logs` (admin only, clears all logs)

Log entries are stored automatically for:
- user signup
- user login
- template creation
- single email send
- bulk email send

### JWT auth + RBAC
- Mutation routes (`POST`, `PUT`, `PATCH`, `DELETE`) are protected by Bearer token authentication middleware.
- Role middleware checks the role inside JWT payload and allows access only for configured roles.
- Set `JWT_SECRET` and optionally `JWT_EXPIRES_IN` in `.env`.

Use this header for protected routes:
```http
Authorization: Bearer <jwt-token>
```

### Register payload example
```json
{
  "name": "Alex Admin",
  "email": "alex@example.com",
  "password": "securepass123",
  "role": "admin"
}
```

### Login payload example
```json
{
  "email": "alex@example.com",
  "password": "securepass123"
}
```

### Single send payload examples

Using direct HTML:
```json
{
  "to": "someone@example.com",
  "subject": "Hello",
  "html": "<h1>Hello there</h1>"
}
```

Using template:
```json
{
  "to": "someone@example.com",
  "templateId": "<mongo-template-id>",
  "variables": {
    "name": "Ayan",
    "otp": "123456",
    "expiryMinutes": 10
  }
}
```

### Bulk send payload example
```json
{
  "templateId": "<mongo-template-id>",
  "recipients": [
    { "to": "u1@example.com", "variables": { "name": "User1", "otp": "111111", "expiryMinutes": 10 } },
    { "to": "u2@example.com", "variables": { "name": "User2", "otp": "222222", "expiryMinutes": 10 } }
  ]
}
```
