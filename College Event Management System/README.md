# College Event Management System (MERN)

A small web app where **admins** create and manage college events and **students** view events and register online.

## Features
- Students: see upcoming events (technical, cultural, workshop, seminar, sports), register with name / roll no / email (duplicate roll no blocked)
- Admin (login): add / edit / delete events, view participants of an event, mark attendance

## Tech
MongoDB (Atlas) · Express · React (Vite) · Node.js

## Folder structure
```
backend/
  server.js            app start, DB connection, admin login
  models/              Event.js, Registration.js (database schemas)
  routes/              events.js, registrations.js (API endpoints)
  middleware/auth.js   checks admin token
  .env                 settings (DB url, admin username/password)
frontend/src/
  App.jsx              navigation (Events / Admin)
  Events.jsx           student page
  Admin.jsx            admin page
  api.js               helper to call the backend
```

## How to run (two terminals)
```bash
cd backend
npm install
npm start
```
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

Admin login: `admin` / `admin123` (change in `backend/.env`).

## API
| Method | URL | Who |
|---|---|---|
| POST | /api/admin/login | admin |
| GET | /api/events | everyone |
| POST / PUT / DELETE | /api/events, /api/events/:id | admin |
| POST | /api/registrations | student |
| GET | /api/registrations/event/:eventId | admin |
| PUT | /api/registrations/:id/attendance | admin |
