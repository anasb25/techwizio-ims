# Techwizio Invoice Management System (IMS)

Full-stack invoice management for **Techwizio** with a NestJS API and React dashboard, including a print-ready invoice template with your company logo.

## Stack

- **Backend:** NestJS, TypeORM, SQLite (`better-sqlite3`)
- **Frontend:** React, TypeScript, Vite, React Router

## Quick start

### 1. Backend

```bash
cd backend
npm install
npm run start:dev
```

API base URL: `http://localhost:3001/api` (default port; override with `PORT`)

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App URL: `http://localhost:5173`

## Features

- Dashboard with revenue and outstanding totals
- Client CRUD
- Invoice create / edit / delete with auto-generated numbers (`TW-YYYY-0001`)
- Company settings used on every invoice
- Professional invoice layout with **Techwizio logo** (`frontend/public/techwizio-logo.png`)
- Print or save as PDF from the invoice view (browser print dialog)

## API overview

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard/summary` | Dashboard stats |
| GET/POST | `/api/clients` | List / create clients |
| PATCH/DELETE | `/api/clients/:id` | Update / delete client |
| GET/POST | `/api/invoices` | List / create invoices |
| GET/PATCH/DELETE | `/api/invoices/:id` | Invoice detail / update / delete |
| GET/PATCH | `/api/settings` | Company profile for invoices |

Database file: `backend/techwizio-ims.sqlite` (created on first run). Sample client and invoice are seeded once.
