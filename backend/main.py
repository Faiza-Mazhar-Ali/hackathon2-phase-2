from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base

from auth_router import router as auth_router
from tasks_router import router as tasks_router

# Create all tables if they don't exist
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Todo App Backend",
    description="A Todo application backend with JWT authentication",
    version="1.0.0"
)

# Add CORS middleware with specific origins for security
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js default
        "http://127.0.0.1:3000",  # Alternative localhost
        "http://localhost:3001",  # Next.js alternative port
        "http://127.0.0.1:3001",  # Alternative localhost
        "http://localhost:8000",  # Same origin as backend (for debugging)
        "http://127.0.0.1:8000",  # Alternative localhost for backend
        "https://localhost:3000", # HTTPS versions
        "https://127.0.0.1:3000",
        "https://localhost:3001",
        "https://127.0.0.1:3001",
        # Add your production frontend URL when deploying
        # "https://your-production-domain.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    # Allow specific headers that might be sent by frontend
    allow_origin_regex=r"https?://localhost(:[0-9]+)?|https?://127\.0\.0\.1(:[0-9]+)?"
)

# Include routers
app.include_router(auth_router)
app.include_router(tasks_router)


@app.get("/", tags=["default"])
def read_root():
    return {"message": "Welcome to the Todo App Backend!"}


@app.get("/health", tags=["default"])
def health_check():
    return {"status": "healthy", "message": "Service is operational"}


# For running the application directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)