# 🚀 Fastify API Boilerplate

A clean, scalable, and production-ready **Fastify + PostgreSQL + Knex** API boilerplate designed for high-performance backend services.

---

## 🏆 Tech Stack

| Category            | Technology               |
| ------------------- | ------------------------ |
| Backend Framework   | **Fastify (v5)**         |
| Database            | **PostgreSQL**           |
| ORM / Query Builder | **Knex**                 |
| Auth                | **Fastify JWT**          |
| Utilities           | Puppeteer, DayJS, Lodash |
| Logging             | Winston + Daily Rotate   |
| Validator           | TypeBox                  |
| API Docs            | Swagger                  |
| Coding Standards    | ESLint + Prettier        |
| Git Hooks           | Husky                    |
| Runtime             | Node.js (ESM)            |

---

## 🎯 Features

✨ **Modern Features Included**

* ⚙️ **ES Module support** (`type: module`)
* 🌍 **Environment-based configuration**
* 🔐 **Authentication (JWT)**
* 🧩 **Role-based architecture** (controllers, services, models)
* 🗄️ **Database migrations + seeds**
* ⏰ **Cron Jobs** (Token cleanup job included)
* 📊 **Pagination**, Helpers, Validators
* 📁 **File upload + static hosting**
* 📘 **Swagger auto documentation**
* 🛑 **Global error handler**
* 🛡️ **Secure headers via Helmet**
* 🚦 **Rate limiting**
* 📜 **Production-level logging**
* 🔗 **Folder alias imports** (#utils, #models, #configs, etc.)

---

## 📦 Installation

Clone project:

```bash
git clone https://github.com/taqiuddin6987/node-boiler-plate-new.git
cd project-folder
npm install
```

---

## ⚙️ Environment Setup

```
PROTOCOL = http
PORT=3000
HOST = "<your-host>"
DOMAIN = "<yout-domain>"
BASEPATH = "<your-basepath>"
DB_HOST = "<your-db-host>"
DB_PORT = your_db_port
DB_USER = "<your-db-user>"
DB_PASSWORD = "<your-db-password>"
DATABASE = "<your-database-name>"
ACCESS_JWT_SECRET = JWT-secret
ACCESS_JWT_EXPIRES_IN = 24h
REFRESH_JWT_SECRET = JWT-refresh-secret
REFRESH_JWT_EXPIRES_IN = 48h
NODE_ENV=development
```

---

## ▶️ Run Development Server

```
npm run start:dev
```

---

## 🗄️ Database Management (Knex)

```
npm run migrate:latest
npm run migrate:rollback
npm run migrate:make migration_name
npm run seed:make seed_name
npm run seed:all
```

---

## 🧪 Running Utility Scripts

```
npm run script:run
npm run format
npm run lint
```

---

## 📚 API Documentation (Swagger)

[http://localhost:3000/documentation](http://localhost:3000/documentation)

---

## 📂 Project Structure (Tree)

```
│   .commitlintrc.json
│   .env.development
│   .gitignore
│   cron-job.js
│   eslint.config.js
│   global-constants.js
│   knexfile.js
│   LICENSE
│   package-lock.json
│   package.json
│   prettierrc.json
│   README.md
│   server.js
│
├── .husky
│   │   commit-msg
│   │   pre-commit
│   └── _
│
├── cron_job
│   └── tokens.job.js
│
├── db
│   │   knex.utilities.js
│   ├── migrations
│   │   20240516125000_update_timestamp_trigger.js
│   │   20241128111945_create_users.js
│   │   20250725132623_create_tokens.js
│   └── script
│       ├── run-script.js
│       └── user.js
│
├── public
│   └── uploads
│       └── profile
│           └── bd395e37-51de-4d47-a06f-9290591e9224.png
│
└── src
    │   routes.js
    │
    ├── configs
    │   env.config.js
    │   jwt.config.js
    │   knex.config.js
    │   logger.config.js
    │   multipart.config.js
    │   swagger.config.js
    │
    ├── models
    │   token.model.js
    │   user.model.js
    │
    ├── plugins
    │   jwt.plugin.js
    │   logger.plugin.js
    │
    ├── utils
    │   bcrypt.js
    │   case-converter.js
    │   constants.js
    │   db-query-helpers.js
    │   htmlToPDF.js
    │   http-status.js
    │   keyGenerator.js
    │   knex.js
    │   logger.js
    │   module-names.js
    │   otp.js
    │   pagination-helpers.js
    │   promise-handler.js
    │   response-handler.js
    │   timeConstants.js
    │   token-helpers.js
    │   uploadFile.js
    │
    └── web
        │   web.routes.js
        └── user
            │   user.controller.js
            │   user.routes.js
            │   user.service.js
            │   user.swagger.js
```

---

## 🔐 Authentication Flow

Client → /auth/login
Server verifies user → JWT token generate
Client uses Bearer Token for protected routes

---

## 📦 Modules Architecture

```
module/
│── controller.js
│── service.js
│── swagger.js
│── routes.js
```

## 📝 Commitlint Configuration (For Git Commits)

The repository uses **commitlint** to enforce conventional commit messages.

`.commitlintrc.json` file:

### ✔️ How to Use These Commit Types

Example commit messages:

* `feat: user login API added`
* `fix: pagination crash issue resolved`
* `docs: updated README with commitlint rules`
* `review: PR feedback changes added`
* `chore: dependencies updated`

---

## 📜 License

This project is licensed under the ISC License.






