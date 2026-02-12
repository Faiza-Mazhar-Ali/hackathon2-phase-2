from fastapi import FastAPI
from routers import auth, tasks

# Create the main FastAPI application instance
app = FastAPI(title="Hackathon Backend API", version="1.0.0")

# Include the routers with their prefixes
app.include_router(auth.router)
app.include_router(tasks.router)


@app.get("/", tags=["default"])
async def read_root():
    """Root endpoint returning a welcome message"""
    return {"message": "Welcome to the Hackathon Backend API!"}


@app.get("/health", tags=["default"])
async def health_check():
    """Health check endpoint to verify the service is running"""
    return {"status": "healthy", "message": "Service is operational"}


# For running the application directly (optional)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)