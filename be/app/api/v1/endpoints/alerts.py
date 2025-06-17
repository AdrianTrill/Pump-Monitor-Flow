from fastapi import APIRouter, HTTPException
from typing import Optional
from app.data.mock_data import MOCK_ALERTS, MOCK_PUMPS
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/")
async def get_alerts(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    pump_id: Optional[str] = None
):
    """Get system alerts with optional filtering"""
    try:
        alerts = MOCK_ALERTS
        
        if status:
            alerts = [a for a in alerts if a["status"].lower() == status.lower()]
        if priority:
            alerts = [a for a in alerts if a["priority"].lower() == priority.lower()]
        if pump_id:
            alerts = [a for a in alerts if a["pump_id"] == pump_id]
        
        # Enrich alerts with pump information
        enriched_alerts = []
        for alert in alerts:
            pump = next((p for p in MOCK_PUMPS if p["id"] == alert["pump_id"]), None)
            enriched_alert = {
                **alert,
                "pump_name": pump["name"] if pump else "Unknown",
                "pump_location": pump["location"] if pump else "Unknown"
            }
            enriched_alerts.append(enriched_alert)
        
        return {
            "alerts": enriched_alerts,
            "total": len(enriched_alerts),
            "filters": {
                "status": status,
                "priority": priority,
                "pump_id": pump_id
            }
        }
    except Exception as e:
        logger.error(f"Error getting alerts: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving alerts")


@router.get("/summary")
async def get_alerts_summary():
    """Get alert summary statistics"""
    try:
        total_alerts = len(MOCK_ALERTS)
        active_alerts = len([a for a in MOCK_ALERTS if a["status"] == "Active"])
        critical_alerts = len([a for a in MOCK_ALERTS if a["priority"] == "Critical"])
        
        # Alert breakdown by priority
        priority_breakdown = {}
        for priority in ["Critical", "High", "Medium", "Low"]:
            priority_breakdown[priority.lower()] = len([a for a in MOCK_ALERTS if a["priority"] == priority])
        
        # Alert breakdown by status
        status_breakdown = {}
        for status in ["Active", "Acknowledged", "Resolved"]:
            status_breakdown[status.lower()] = len([a for a in MOCK_ALERTS if a["status"] == status])
        
        return {
            "total_alerts": total_alerts,
            "active_alerts": active_alerts,
            "critical_alerts": critical_alerts,
            "priority_breakdown": priority_breakdown,
            "status_breakdown": status_breakdown
        }
    except Exception as e:
        logger.error(f"Error getting alerts summary: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving alerts summary")


@router.put("/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: int):
    """Acknowledge an alert"""
    try:
        # In a real app, this would update the database
        # For now, just return success
        return {
            "message": f"Alert {alert_id} acknowledged successfully",
            "alert_id": alert_id,
            "status": "Acknowledged"
        }
    except Exception as e:
        logger.error(f"Error acknowledging alert {alert_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error acknowledging alert")


@router.put("/{alert_id}/resolve")
async def resolve_alert(alert_id: int):
    """Resolve an alert"""
    try:
        # In a real app, this would update the database
        # For now, just return success
        return {
            "message": f"Alert {alert_id} resolved successfully",
            "alert_id": alert_id,
            "status": "Resolved"
        }
    except Exception as e:
        logger.error(f"Error resolving alert {alert_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error resolving alert")