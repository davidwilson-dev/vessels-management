# Vessels Management

Monorepo for the Vessels Management project with:

- `admin/`: React + Vite admin interface
- `server/`: Express + MongoDB backend API

## Tech Stack

### Admin
- React
- Vite
- Material UI
- Redux Toolkit
- Redux-Saga
- Axios

### Server
- Node.js
- Express
- MongoDB / Mongoose
- JWT authentication

## Project Structure

```text
.
├── admin/
│   ├── src/app
│   ├── src/features
│   └── src/shared
├── server/
│   ├── src/controllers
│   ├── src/models
│   ├── src/routes
│   └── src/services
└── README.md
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB database

## Environment Setup

### Admin

Create `admin/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Server

Create `server/.env` from `server/.env.example`.

Typical local development values:

```env
BUILD_MODE=development
LOCAL_DEV_PORT=5000
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
ADMIN_URL=http://localhost:5174
SERVER_URL=http://localhost:5000
```

## Install Dependencies

```bash
cd admin && npm install
cd ../server && npm install
```

## Run Locally

### Start the server

```bash
cd server
npm run dev
```

The backend runs on `http://localhost:5000` in local development.

### Start the admin app

```bash
cd admin
npm run dev
```

The admin app runs on `http://localhost:5174`.

## Available Scripts

### Admin

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Server

```bash
npm run dev
npm start
```

## Notes

- The admin app is configured to call the backend through `VITE_API_BASE_URL`.
- Admin user management supports auth, user listing, detail view, locking, and deleting with permission checks.
- Staff users can view the list and user details, but restricted actions require admin permission.
