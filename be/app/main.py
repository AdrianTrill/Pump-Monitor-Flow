from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="API for Pump Monitoring Chatbot with Mock Data",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {
        "message": "Pump Monitor API",
        "version": "1.0.0",
        "docs_url": "/docs",
        "api_prefix": settings.API_V1_STR,
        "data_source": "mock_data"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "pump-monitor-api", "data_source": "mock_data"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)