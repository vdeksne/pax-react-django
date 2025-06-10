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
    <br/>
    <img src="frontend/public/assets/gifs/mobile.gif" alt="PAX Shop Demo" width="300">

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
   DATABASE_URL=postgresql://user:password@localhost:5432/paxshop
   ```

   Frontend (.env):

   ```
   REACT_APP_API_URL=http://localhost:8000
   ```
