# AssetFlow

AssetFlow is an Asset Management and Tracking System designed with a React frontend and a Node.js/Express backend.

## Directory Structure

```
assetflow/
├── backend/                  # Express API Server
│   ├── config/               # Database connection configurations
│   ├── controllers/          # Route controller handlers
│   ├── models/               # MongoDB/Mongoose schemas
│   ├── routes/               # Express routes
│   ├── package.json          # Backend dependencies & scripts
│   └── server.js             # Main server entrypoint
└── frontend/                 # Vite + React Frontend
    ├── public/
    ├── src/
    │   ├── components/       # Shared UI components and configurations
    │   ├── pages/            # Feature-specific pages (Yash, Daksh, Ayush)
    │   ├── App.jsx           # Main layout & router entrypoint
    │   ├── index.css         # Styling system
    │   └── main.jsx          # React app DOM mounting entrypoint
    ├── index.html            # Main HTML document
    ├── package.json          # Frontend dependencies & scripts
    └── vite.config.js        # Vite build tool configuration
```

---

## Setup & Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+ recommended) and [MongoDB](https://www.mongodb.com/) installed on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/DakshN07/ODOO-2026.git
cd ODOO-2026
```

---

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd assetflow/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `assetflow/backend/` and configure your environment variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/assetflow
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`.

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd assetflow/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend application will run on `http://localhost:3000`.

---

## Development Features

- **Yash (Admin & Auth)**: Authentication (Login), initial Admin Setup, Dashboard analytics, and central Activity Logs.
- **Daksh (Assets & Audits)**: Asset Directory catalog, Asset Registration, and Audit Cycle scheduling.
- **Ayush (Allocations & Maintenance)**: Asset Allocations tracking, Resource Bookings, and Kanban-style Maintenance Boards.
