# TodoApp Setup Guide

This document provides a comprehensive guide to setting up and running the TodoApp locally.

## Prerequisites

Before setting up the application, ensure you have the following installed:

- **Python 3.10+** (for the backend)
- **Node.js 18+** (for the frontend)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

## Backend Setup

### 1. Navigate to the backend directory

```bash
cd backend
```

### 2. Create a virtual environment (recommended)

```bash
python -m venv venv
```

### 3. Activate the virtual environment

On Windows:
```bash
venv\Scripts\activate
```

On macOS/Linux:
```bash
source venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

If requirements.txt doesn't exist, install the required packages manually:

```bash
pip install fastapi uvicorn sqlalchemy python-jose[cryptography] passlib[bcrypt] python-multipart python-dotenv
```

### 5. Set up environment variables

Create a `.env` file in the backend directory with the following content:

```env
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./todoapp.db
```

> **Note:** For the SECRET_KEY, you can generate a secure random key using Python:
> ```python
> import secrets
> print(secrets.token_urlsafe(32))
> ```

### 6. Run the backend server

```bash
uvicorn main:app --reload
```

The backend server will start on `http://127.0.0.1:8000`.

## Frontend Setup

### 1. Navigate to the frontend directory

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the frontend directory with the following content:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

### 4. Run the development server

```bash
npm run dev
```

The frontend development server will start on `http://localhost:3000`.

## Running the Application

1. Start the backend server first (as described in the Backend Setup section)
2. Then start the frontend server (as described in the Frontend Setup section)
3. Open your browser and navigate to `http://localhost:3000`

## API Documentation

Once the backend server is running, you can access the interactive API documentation at:
- Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

## Key Features

### Authentication
- User registration with username, email, and password
- Secure JWT-based authentication
- Protected routes ensuring data privacy

### Task Management
- Create, read, update, and delete tasks
- Mark tasks as completed/incomplete
- Filter and sort tasks by status, priority, and date
- Add due dates and tags to tasks
- Set task priorities (low, medium, high)

### UI/UX Features
- Responsive design that works on all device sizes
- Dark/light mode toggle
- Intuitive dashboard with task statistics
- Search and filter functionality
- Clean, modern interface with glassmorphism effects

## Troubleshooting

### Common Issues

1. **Backend server won't start**
   - Ensure you have activated the virtual environment
   - Check that all dependencies are installed
   - Verify your `.env` file contains the required variables

2. **Frontend can't connect to backend**
   - Ensure the backend server is running
   - Check that `NEXT_PUBLIC_API_BASE_URL` in `.env.local` matches your backend URL
   - Verify that CORS settings in the backend allow requests from the frontend

3. **Database connection errors**
   - Ensure the SQLite database file has proper permissions
   - Check that the `DATABASE_URL` in the backend `.env` file is correct

### Resetting the Database

If you need to reset the database, simply delete the `todoapp.db` file in the backend directory. The application will recreate it automatically on the next run.

## Development Notes

### Backend Development
- Use the `--reload` flag with uvicorn for hot-reloading during development
- All API endpoints are documented with automatic OpenAPI/Swagger documentation
- Database models are defined in `models.py`
- Request/response schemas are defined in `schemas.py`

### Frontend Development
- Pages are organized using the Next.js App Router in `src/app/`
- Authentication state is managed via `AuthContext`
- API calls are handled through the `apiClient` utility
- Components are reusable UI elements in `src/components/`

## Security Considerations
- JWT tokens are used for authentication
- Passwords are hashed using BCrypt
- Input validation is performed using Pydantic schemas
- SQL injection prevention through SQLAlchemy ORM
- CORS is configured for specific origins only

## Production Deployment

For production deployment:
- Use PostgreSQL instead of SQLite
- Set up proper reverse proxy (nginx)
- Configure proper SSL certificates
- Use environment variables for sensitive data
- Set up process managers (PM2, systemd)
- Implement proper logging and monitoring