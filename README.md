
# Client Lead Management System (Mini CRM)

This is a full-stack Client Lead Management System built for tracking, managing, and converting prospects. 

## Tech Stack
- **Frontend**: React.js (Vite) + Tailwind CSS + React Router + Lucide Icons + React Hot Toast
- **Backend**: Node.js + Express
- **Database**: MongoDB & Mongoose
- **Authentication**: JWT & bcrypt

## Features
- **Admin Authentication**: Secure JWT-based login with bcrypt hashed passwords.
- **Dashboard**: High-level summary metrics (Total, New, Contacted, Converted leads) and interactive data table.
- **Lead Detail View**: Full screen view to trace client engagement, update status, and manage activity notes.
- **Modern UI**: Polished Tailwind CSS integration focusing on user experience, responsive design, formatting, and interactive states.
- **Security**: Complete JWT protected API endpoints with error boundaries and data validation.

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (Local or Atlas)

### Setup & Installation

1. Clone or download the repository, then navigate to the root directory `FUTURE_FS_02`.

2. Install dependencies for the **Backend**:
   ```bash
   cd server
   npm install
   ```
   
3. Setup the **Backend** environment:
   Make a copy of `.env.example` to `.env` in the `server/` directory and update your values, primarily `MONGODB_URI`.
   ```bash
   cp .env.example .env
   ```

4. Install dependencies for the **Frontend**:
   ```bash
   cd ../client
   npm install
   ```

5. Setup the **Frontend** environment:
   Make a copy of `.env.example` to `.env` in the `client/` directory and ensure it points to the backend.
   ```bash
   cp .env.example .env
   ```

### Running the Application

1. Open a new terminal to start the **Backend** Server:
   ```bash
   cd server
   npm run dev
   ```
   *(Running on port 5000 by default)*

2. Open another terminal to start the **Frontend** Client:
   ```bash
   cd client
   npm run dev
   ```
   *(Running on Vite's default port, e.g., 5173)*

### Seeding Dummy Data & Initial Admin Credentials
The database starts empty. To log in, you must have an Admin User. I've prepared a data seeder script.
In your `server/` terminal, run:
```bash
npm run data:import
```
This will insert dummy leads and 1 default admin account:
- **Email:** `admin@crm.com`
- **Password:** `password123`

To reset database and clear data:
```bash
npm run data:destroy
```

---

## Deployment Instructions

### Deploying the Backend (e.g., Render / Heroku)
1. Commit the `server/` folder to your Git repository.
2. In Render, create a new "Web Service" linking the repo.
3. Choose Node environment and run configuration:
   - Location: `./server`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Set required Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`.

### Deploying the Frontend (e.g., Vercel / Netlify)
1. Connect your repository to Vercel.
2. Ensure Vercel knows the Root Directory is `client`.
3. Framework Preset: *Vite*
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add the environment variable `VITE_API_URL` pointing to your deployed Backend API URL (e.g., `https://your-backend.onrender.com/api`).
