from fastapi import APIRouter
from app.api.v1.endpoints import chat, pumps, dashboard, alerts

api_router = APIRouter()

api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(pumps.router, prefix="/pumps", tags=["pumps"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])