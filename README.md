# Vessels Management

Monorepo for a fleet operations admin system with:

- `admin/`: React + Vite admin console
- `server/`: Express + MongoDB API

The project currently covers user administration, company management, vessel registration, crew management, assignment history, and a dashboard that summarizes all major domains.

## What The System Handles

### Admin Console

- Authentication with protected admin routes
- Dashboard summary cards for users, vessels, companies, and crew
- User management with list, detail, create, update, lock, and delete flows
- Company management with list, detail, create, update, and delete flows
- Vessel management with:
  - list and detail views
  - tabbed create and edit form
  - repeatable onboard device sections
  - company ownership display
  - captain and line manager display sourced from crew assignments
- Crew management with:
  - list and detail views
  - single-role crew records
  - vessel assignment and certificate management
  - company selection
- Toast notifications for important mutation errors and successes

### Server API

- JWT-based authentication
- Role-based authorization for `admin` and `staff`
- CRUD APIs for users, companies, vessels, and crew members
- Validation with Joi
- Mongoose models for operational relationships, including:
  - `Company`
  - `CompanyVesselAssignment`
  - `CompanyCrewAssignment`
  - `VesselCrewAssignment`
  - vessel device collections
- Company-to-vessel and company-to-crew relation syncing
- Crew-to-vessel leadership syncing for captain and line manager
- Vessel device syncing during create and update requests

## Tech Stack

### Admin

- React 19
- Vite
- Material UI
- React Router
- Redux Toolkit
- Redux-Saga
- React Hook Form
- Axios
- React Toastify

### Server

- Node.js
- Express 5
- MongoDB / Mongoose
- Joi
- JWT authentication
- Nodemon for local development

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
│   ├── src/repositories
│   ├── src/routes
│   ├── src/services
│   └── src/validators
└── README.md
```

## Main Admin Pages

- `/dashboard`
- `/users`
- `/companies`
- `/vessels`
- `/crew-members`

## Permission Model

- `admin` users can create, update, lock, and delete protected resources
- `staff` users can view dashboard, lists, and detail pages, but restricted mutations remain admin-only

## Prerequisites

- Node.js 18+
- npm
- MongoDB database

## Environment Setup

### 1. Admin

Create `admin/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 2. Server

Create `server/.env` from `server/.env.example`.

Example local values:

```env
BUILD_MODE=development
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster/db
MONGO_DB_NAME=mern_users_auth
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d

PORT=8080
LOCAL_DEV_PORT=5000
LOCAL_DEV_HOST=localhost
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
SERVER_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
AUTHOR=your_name
```

## Install Dependencies

```bash
cd admin
npm install

cd ../server
npm install
```

## Run Locally

### Start the API server

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

## API Overview

### Auth

- `POST /api/auth/login`
- token refresh and logout flows are also handled by the auth module

### Admin Resources

- `GET/POST/PATCH/DELETE /api/admin/users`
- `PATCH /api/admin/users/:id/lock`
- `GET/POST/PATCH/DELETE /api/admin/companies`
- `GET/POST/PATCH/DELETE /api/admin/vessels`
- `GET/POST/PATCH/DELETE /api/admin/crew-members`

All admin endpoints are protected by authentication and role checks.

## Operational Data Notes

- A vessel can belong to a company
- A crew member can belong to a company
- Company-to-vessel and company-to-crew links are tracked in dedicated assignment collections
- Vessel-to-crew history is tracked in `VesselCrewAssignment`
- Captain and line manager display are derived from vessel crew assignments
- Vessel create and update flows can sync multiple onboard device records in one request
- The vessel admin form organizes devices into tabbed sections for machinery, navigation, and safety

## Notes

- The admin app talks to the backend through `VITE_API_BASE_URL`
- The admin console is intended to run on `http://localhost:5174`
- The server allows both `http://localhost:5173` and `http://localhost:5174` by default for local CORS
