# Email Server API

Express.js API for:
- storing/retrieving email templates (CRUD)
- sending single and bulk emails with Nodemailer
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

## Seed sample templates

```bash
npm run seed
```

## API endpoints

### Templates CRUD
- `POST /api/templates`
- `GET /api/templates`
- `GET /api/templates/:id`
- `PUT /api/templates/:id`
- `DELETE /api/templates/:id`

### Emails
- `POST /api/emails/send`
- `POST /api/emails/send-bulk`

### API key auth
- All mutation routes (`POST`, `PUT`, `PATCH`, `DELETE`) require the `x-api-key` header.
- Set the API key in `.env` as `API_KEY`.

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
