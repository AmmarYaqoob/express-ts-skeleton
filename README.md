# express-ts-skeleton

Express and TypeScript API skeleton with MySQL, Sequelize, and email-based signup, verification, and password reset.

The server listens on port `4001`. Every route is under `/api/v1`.

## Requirements

- Node.js 18 or newer
- MySQL
- npm

## Run it locally

```bash
npm install
cp .env.example .env
```

On Windows PowerShell, copy the env file with:

```powershell
Copy-Item .env.example .env
```

Set the MySQL user and password in `.env`, then create the database, tables, and seed data:

```bash
npm run db:setup
npm run dev
```

`db:setup` creates the database, runs migrations, and seeds roles plus one admin user.

Check that the server is up:

```bash
curl http://localhost:4001/api/v1/ping
```

```json
{
  "success": true,
  "message": "Success",
  "data": "pong!"
}
```

## Environment

| Variable | Purpose | Default |
| --- | --- | --- |
| `NODE_ENV` | `local`, `development`, or `production` | `local` |
| `NODE_PORT` | HTTP port | `4001` |
| `TYPEORM_HOST` | MySQL host | empty |
| `TYPEORM_PORT` | MySQL port | `3306` in `.env.example` |
| `TYPEORM_USERNAME` | MySQL user | empty |
| `TYPEORM_PASSWORD` | MySQL password | empty |
| `TYPEORM_DATABASE` | Database name | `express_ts_skeleton` |
| `API_BASEURL` | Route prefix | `/api/v1` |
| `SMTP_HOST` | Mail server | `smtp.gmail.com` |
| `SMTP_PORT` | Mail port | `587` |
| `SMTP_SECURE` | Use TLS | `false` |
| `SMTP_USER` | Mail username | empty |
| `SMTP_PASS` | Mail password | empty |
| `SMTP_FROM` | From address | falls back to `SMTP_USER` |
| `secret_key` | Key for `encrypt` / `decrypt` only | empty |

Signup, verify, and password reset do not use `secret_key`. Set it only if you call those helpers. Use a long random value. The old value `secret__sha__key` is rejected.

The app exits on startup if MySQL cannot be reached.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start with reload |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run the compiled app |
| `npm run db:create` | Create the MySQL database |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed roles and the admin user |
| `npm run db:setup` | Create, migrate, and seed |
| `npm run db:undo` | Roll back all migrations |

## Seeded data

Roles:

| id | name |
| --- | --- |
| 1 | super admin |
| 2 | user |

Admin user, already verified:

- Email: `superadmin@example.com`
- Password: `Admin@123`

Signup always assigns role `2` (user).

## Response shape

Success:

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Invalid email or password",
  "data": {}
}
```

Successful auth routes return HTTP 200. The payload is in `data`.

## Auth

Tokens are 64-character hex strings. The database stores a SHA-256 hash, not the raw token. A token expires after 24 hours and can be used once. Email links look like:

```text
/api/v1/sign-in?user=<userId>&token=<token>
/api/v1/forgot-password?user=<userId>&token=<token>
```

Those paths are for the client. The API calls below are what the server accepts. Fill in `SMTP_*` or mail sending will fail.

### Sign up

`POST /api/v1/auth/signup`

`lastName` is required by the `users` table.

```json
{
  "firstName": "Ada",
  "lastName": "Lovelace",
  "email": "ada@example.com",
  "password": "correct-horse",
  "contactNo": "5550100"
}
```

The account is created unverified. A verification link is emailed.

### Verify email

`POST /api/v1/auth/verify`

```json
{
  "email": "ada@example.com",
  "token": "<token from the email link>"
}
```

`POST /api/v1/auth/verifyuserhash` does the same check with `userId` instead of `email`:

```json
{
  "userId": "<user id>",
  "token": "<token from the email link>"
}
```

### Log in

`POST /api/v1/auth/login`

```json
{
  "email": "superadmin@example.com",
  "password": "Admin@123"
}
```

A verified user gets this `data`:

```json
{
  "verified": true,
  "email": "superadmin@example.com",
  "id": "00000000-0000-4000-a000-000000000001",
  "userName": "Super Admin"
}
```

There is no session and no bearer token. An unverified user receives a new verification email and `verified: false`. A wrong email or password returns `401`.

### Forgot password

`POST /api/v1/auth/forgetpassword`

```json
{
  "email": "ada@example.com"
}
```

The response is the same whether or not that email exists. A reset link is sent only when the account exists.

Check the link before setting a password:

`POST /api/v1/auth/verifyforgethash`

```json
{
  "userId": "<user id>",
  "token": "<token from the email link>"
}
```

This does not use up the token.

Set the new password:

`POST /api/v1/auth/resetpassword`

```json
{
  "userId": "<user id>",
  "token": "<token from the email link>",
  "password": "new-password"
}
```

A valid token is deleted as soon as the password is saved.

## Layout

```text
src/
  index.ts                 starts the process
  app.ts                   Express app and middleware
  bootstrap/               database connection
  config/                  environment (convict)
  routes/                  route modules
  controllers/             read the request, call a service
  services/                business logic
  repositories/            Sequelize queries
  database/entities/       models
  dto/                     object shapes
  middlewares/             async handler, response, errors
  utils/                   password hash and tokens
  templates/               email HTML
database/
  migrations/              schema changes
  seeders/                 roles and admin user
  config.js                Sequelize CLI config
```

Request path: route, controller, service, repository, model.

## Add an endpoint

1. Add a model under `src/database/entities/` if you need a new table.
2. Add a migration in `database/migrations/`, then run `npm run db:migrate`.
3. Add a repository method for the query.
4. Add a service method for the behavior.
5. Add a controller method that sets `res.locals.data` and calls `next()`.
6. Register the route in `src/routes/` and add that module to `src/routes/index.ts`.

Pass `responseMiddleware` after the controller so the handler returns JSON. Throw `AppError` for an expected failure. Anything else becomes HTTP 500 with the message `Internal Server Error`.
