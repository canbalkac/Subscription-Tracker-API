# 📦 Subscription Tracker API

A modular and secure RESTful API for managing users, subscriptions, and workflows. Built with **Express.js**, **MongoDB**, and **Upstash Workflow**. Includes features like JWT authentication, role-based access, and email notifications.

---

## 🚀 Features

- 🔐 **User Authentication** (JWT-based)
- 👤 **Admin/User Role Management**
- 📬 **Subscription Tracking**
- 📈 **Workflow Triggering via Upstash**
- 📧 **Email Notification System (via Nodemailer)**
- 🛡️ **Request Inspection (Arcjet)**

---

## 📁 Project Structure

```
subscription-tracker-api/
├── app.js                  # Main Express app
├── config/                 # Configuration for env, mail, Arcjet, Upstash
├── controllers/            # Business logic per feature
├── database/               # MongoDB connection
├── middlewares/           # Custom Express middlewares
├── models/                # Mongoose models
├── routes/                # Route definitions
├── utils/                 # Utility helpers (email, auth)
├── .env.*                 # Local environment files
├── package.json           # Project metadata and dependencies
```

---

## ⚙️ Installation

```bash
git clone https://github.com/your-username/subscription-tracker-api.git
cd subscription-tracker-api
npm install
```

---

## 📁 Environment Variables

Create a `.env.<development | production>.local` file and fill in:

```env
PORT=3000
SERVER_URL=your_server_url
NODE_ENV=node_environment
DB_URI=mongo_db_uri
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=expires_date
ARCJET_KEY=your_arcjet_key
ARCJET_ENV=arcjet_environment
QSTASH_URL=your_qstash_url
QSTASH_TOKEN=your_qstash_token
EMAIL_PASSWORD=google_application_password_for_node_mailer
ADMIN_CREATION_KEY=admin_creation_key
```

---

## 🧪 Development

Start the development server with `nodemon`:

```bash
npm run dev
```

Or run the app normally:

```bash
npm start
```

---

## 📌 API Endpoints

### 🔑 Auth (`/api/auth`)

| Method | Endpoint        | Description       |
| ------ | --------------- | ----------------- |
| POST   | `/sign-up`      | User registration |
| POST   | `/sign-in`      | Sign in           |
| POST   | `/sign-out`     | Sign out          |
| POST   | `/create-admin` | Create admin user |

---

### 👥 Users (`/api/users`)

| Method | Endpoint | Auth | Description    |
| ------ | -------- | ---- | -------------- |
| GET    | `/`      | ❌   | Get all users  |
| GET    | `/:id`   | ✅   | Get user by ID |
| PUT    | `/:id`   | ✅   | Update user    |
| DELETE | `/:id`   | ✅   | Delete user    |

---

### 📬 Subscriptions (`/api/subscriptions`)

| Method | Endpoint             | Auth | Description                   |
| ------ | -------------------- | ---- | ----------------------------- |
| GET    | `/`                  | ✅👑 | Get all subscriptions (Admin) |
| GET    | `/:id`               | ✅   | Get subscription details      |
| POST   | `/`                  | ✅   | Create subscription           |
| PUT    | `/:id`               | ✅   | Update subscription           |
| DELETE | `/:id`               | ✅   | Delete subscription           |
| PUT    | `/:id/cancel`        | ✅   | Cancel subscription           |
| GET    | `/user/:id`          | ✅   | Get user's subscriptions      |
| GET    | `/upcoming-renewals` | ✅   | Get upcoming renewals         |

---

### ⚙️ Workflow (`/api/workflow`)

| Method | Endpoint                 | Description                            |
| ------ | ------------------------ | -------------------------------------- |
| POST   | `/subscription/reminder` | Trigger subscription reminder workflow |

---

## 🧰 Scripts

```bash
npm run dev       # Starts development server
npm start         # Starts production server
```

---

## 📡 Technologies

- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + Bcrypt
- **Email**: Nodemailer
- **Monitoring**: Arcjet
- **Workflow**: Upstash

---
