# Hackathon2 - All Phases Todo Application

A comprehensive full-stack todo application built with FastAPI (backend) and Next.js (frontend) featuring JWT authentication, secure user management, and task organization.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)

## Features
- User authentication with JWT tokens
- Secure user registration and login
- Personalized task management
- CRUD operations for tasks
- Task completion toggling
- Protected routes ensuring data privacy
- Responsive UI/UX design

## Tech Stack
### Backend
- **Python 3.10+**
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database (for development)
- **PyJWT** - JSON Web Token implementation
- **Passlib** - Password hashing
- **BCrypt** - Password hashing algorithm

### Frontend
- **Next.js 16+** - React framework
- **React 19+** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Notification library

## Project Structure
```
hackathon2-all-phases/
├── backend/
│   ├── main.py              # Main FastAPI application
│   ├── auth_router.py       # Authentication routes
│   ├── tasks_router.py      # Task management routes
│   ├── models.py           # SQLAlchemy models
│   ├── schemas.py          # Pydantic schemas
│   ├── database.py         # Database configuration
│   ├── dependencies.py     # JWT and security utilities
│   └── .env               # Environment variables
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js app router pages
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React contexts (AuthContext)
│   │   ├── lib/           # Utilities and API client
│   │   └── types/         # TypeScript type definitions
│   ├── package.json       # Frontend dependencies
│   └── next.config.js     # Next.js configuration
├── README.md             # This file
└── ...
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- pip (Python package installer)

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- On Windows:
```bash
venv\Scripts\activate
```
- On macOS/Linux:
```bash
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```
If requirements.txt doesn't exist, install the required packages:
```bash
pip install fastapi uvicorn sqlalchemy python-jose[cryptography] passlib[bcrypt] python-multipart python-dotenv
```

5. Set up environment variables (see [Environment Variables](#environment-variables))

6. Run the backend server:
```bash
uvicorn main:app --reload
```

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

### Backend (.env file in backend directory)
```env
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./todoapp.db
```

### Frontend (.env.local file in frontend directory)
```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

## API Documentation
Once the backend server is running, visit:
- Interactive API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Alternative API docs: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

## Development
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

## Testing
### Backend Tests
Run backend tests using pytest:
```bash
cd backend
pytest tests/ -v
```

### Frontend Tests
Run frontend tests using Jest:
```bash
cd frontend
npm run test
```

## Deployment
### Backend Deployment
For production deployment, consider:
- Using PostgreSQL instead of SQLite
- Setting up proper reverse proxy (nginx)
- Configuring proper SSL certificates
- Using environment variables for sensitive data
- Setting up process managers (PM2, systemd)

### Frontend Deployment
- Build for production: `npm run build`
- Serve the build output with a static server
- Configure proper environment variables for production API URL

## Security Considerations
- JWT tokens are used for authentication
- Passwords are hashed using BCrypt
- Input validation is performed using Pydantic schemas
- SQL injection prevention through SQLAlchemy ORM
- CORS is configured for specific origins only

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

When contributing:
- Follow the existing code style
- Write tests for new functionality
- Update documentation as needed
- Ensure all tests pass before submitting

## License
This project is licensed under the MIT License - see the LICENSE file for details."# hackathon2-phase-2" 
