"""
Sarthi FastAPI Main Server Application Entrypoint
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.api.router import router as api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Backend API and AI Pipeline for Sarthi - Government Benefits Copilot"
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router under /api and root /
app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(api_router)


@app.get("/")
def root():
    """Root health check endpoint."""
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "documentation": "/docs"
    }


@app.get("/health")
def health_check():
    """System health check endpoint."""
    return {"status": "healthy", "ai_pipeline": "active"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=True)
