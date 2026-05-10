# PAX Shop

E-commerce Platform. A modern e-commerce platform built with React and Django, featuring a robust product management system, user authentication, and seamless shopping experience.

![PAX Shop Demo](frontend/public/assets/gifs/intro.gif)

## Features

- **User Authentication**

  - Secure login/signup system
  - User profile management
  - Role-based access control

  ![PAX Shop Demo](frontend/public/assets/gifs/register.gif)

- **Product Management**

  - Dynamic product catalog
  - Category-based navigation
  - Advanced search and filtering
  - Responsive product grid

    <img src="frontend/public/assets/gifs/mobile.gif" alt="PAX Shop Demo" width="300" margin-top="10px">

- **Shopping Experience**

  - Real-time cart management
  - Secure checkout process
  - Order tracking
  - Wishlist functionality

  ![PAX Shop Demo](frontend/public/assets/gifs/pay.gif)

- **Admin Dashboard**

  - Product CRUD operations
  - Order management
  - User management
  - Analytics and reporting

  ![PAX Shop Demo](frontend/public/assets/gifs/products.gif)

### Frontend

- React.js
- Redux for state management
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests

### Backend

- Django
- Django REST Framework
- PostgreSQL database
- JWT authentication
- Celery for async tasks

### Database

- PostgreSQL 14.0
  - Robust relational database
  - Advanced indexing for optimal performance
  - Full-text search capabilities
  - JSON support for flexible data storage

### Deployment

- Frontend: Netlify
  - Continuous deployment from Git
  - Automatic HTTPS
  - Global CDN
  - Custom domain support
- Backend: Railway
  - Automated deployments
  - Built-in PostgreSQL support
  - Scalable infrastructure
  - SSL/TLS encryption

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- PostgreSQL 14.0
- yarn
- pip

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/pax-shop.git
   cd pax-shop
   ```

2. **Backend Setup**

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

   **Local demo (SQLite + snapshot data, no PostgreSQL)**  
   Add `DEMO_MODE=True` to `backend/.env`. This uses `demo/demo.sqlite3` instead of `DATABASE_URL` and local file storage instead of S3. Then load the bundled fixture (anonymized copy of the production catalog and users):

   ```bash
   cd backend
   chmod +x demo/load_demo.sh   # once
   ./demo/load_demo.sh
   python manage.py runserver
   ```

   The load script runs **`download_demo_media --recover-missing`**, which reads every `image` path in `demo/shop_demo_fixture.json`, then tries: **`--from-dir`** (if set), **S3**, then **HTTPS**. Files land in `backend/media/`. **`--recover-missing`** fills paths that are gone from S3 by copying **stand-in** files from whatever images you already have locally (not the real lost originals—use **`--from-dir`** with a real backup for that). Re-run anytime (existing non-empty files are skipped). Anything still missing after that uses Picsum (`DEMO_MEDIA_FALLBACK`).

   Point the frontend at the API: locally use `yarn start` (proxied `/api/v1/`). On Netlify, set `VITE_API_BASE_URL` or use the bundled `netlify.toml` proxy to Railway. With `DEMO_MODE`, images that are not under `backend/media/` use **placeholder photos** by default (`DEMO_MEDIA_FALLBACK=picsum`, stable per file path). To try real files from a public bucket instead, set `DEMO_MEDIA_FALLBACK=s3` and `DEMO_REMOTE_MEDIA_BASE=…`.

   Demo logins use password **`demo`** (for example `vendor@demo.pax.shop` / `demo`). For Railway/production again, set `DEMO_MODE=False` so `DATABASE_URL` is used.

3. **Frontend Setup**

   ```bash
   cd frontend
   yarn install
   yarn start
   ```

4. **Environment Variables**
   Create `.env` files in both frontend and backend directories with the following variables:

   Backend (.env):

   ```
   DEBUG=True
   SECRET_KEY=your_secret_key
   DEMO_MODE=True
   # When DEMO_MODE is True, DATABASE_URL is not used (local demo SQLite + fixture).
   DATABASE_URL=postgresql://user:password@localhost:5432/paxshop
   ```

   **Netlify static demo (no Railway DB):** In `frontend/netlify.toml`, `VITE_STATIC_DEMO=true` is set under `[build.environment]`. The UI loads bundled products/categories and images from `frontend/public/demo/`. Turn it off and restore an `/api/*` proxy (or `VITE_API_BASE_URL`) when you want a real backend again.

   Frontend (Vite — use `VITE_*`, not `REACT_APP_*`):

   - **Local:** no file needed; `yarn start` uses `/api/v1/` and proxies to Django (see `vite.config.js`).
   - **Netlify:** either rely on `frontend/netlify.toml` (proxy `/api/*` to your Railway URL), **or** set build env `VITE_API_BASE_URL=https://your-api.host/api/v1/` and **remove** the proxy rule if you prefer direct API calls (then enable CORS for your Netlify URL on Django).

   ```bash
   # Optional — direct API URL for production build (e.g. Vercel, or Netlify without proxy)
   VITE_API_BASE_URL=https://your-backend.example.com/api/v1/
   ```
