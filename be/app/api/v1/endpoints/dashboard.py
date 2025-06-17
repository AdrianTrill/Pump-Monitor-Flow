from fastapi import APIRouter, HTTPException
from app.data.mock_data import MOCK_PUMPS, MOCK_ALERTS
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/stats")
async def get_dashboard_stats():
    """Get overall system statistics and health metrics"""
    try:
        # Calculate real-time stats from mock data
        total_pumps = len(MOCK_PUMPS)
        critical_alerts = len([a for a in MOCK_ALERTS if a["priority"] == "Critical"])
        predicted_failures = len([p for p in MOCK_PUMPS if p["predicted_failure_days"] <= 30])
        
        # Calculate average health score
        health_scores = [p["health_score"] for p in MOCK_PUMPS if p["health_score"]]
        avg_health = sum(health_scores) / len(health_scores) if health_scores else 0
        
        return {
            "total_pumps": total_pumps,
            "critical_alerts": critical_alerts,
            "predicted_failures": predicted_failures,
            "system_health": round(avg_health, 1),
            "pump_status_breakdown": {
                "normal": len([p for p in MOCK_PUMPS if p["status"] == "Normal"]),
                "warning": len([p for p in MOCK_PUMPS if p["status"] == "Warning"]),
                "critical": len([p for p in MOCK_PUMPS if p["status"] == "Critical"])
            }
        }
    except Exception as e:
        logger.error(f"Error getting dashboard stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving dashboard statistics")


@router.get("/health-trends")
async def get_system_health_trends():
    """Get system health trends for the last 24 hours"""
    try:
        # Mock 24-hour health data
        health_data = [
            {"time": "00:00", "value": 94},
            {"time": "04:00", "value": 93},
            {"time": "08:00", "value": 96},
            {"time": "12:00", "value": 94},
            {"time": "16:00", "value": 95},
            {"time": "20:00", "value": 96},
            {"time": "24:00", "value": 95},
        ]
        
        return {
            "health_data": health_data,
            "current_health": 95,
            "trend": "stable"
        }
    except Exception as e:
        logger.error(f"Error getting health trends: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving health trends")


@router.get("/recent-activity")
async def get_recent_activity():
    """Get recent system activity and events"""
    try:
        # Combine recent alerts and maintenance for activity feed
        activities = []
        
        # Add recent alerts
        for alert in MOCK_ALERTS[:3]:  # Last 3 alerts
            pump = next((p for p in MOCK_PUMPS if p["id"] == alert["pump_id"]), None)
            activities.append({
                "type": "alert",
                "timestamp": "2024-06-17T10:30:00Z",  # Mock timestamp
                "message": f"Alert: {alert['message']} on {pump['name'] if pump else alert['pump_id']}",
                "priority": alert["priority"],
                "pump_id": alert["pump_id"]
            })
        
        # Add some maintenance activities
        activities.extend([
            {
                "type": "maintenance",
                "timestamp": "2024-06-17T08:15:00Z",
                "message": "Routine inspection completed on Feed Pump A1",
                "priority": "Info",
                "pump_id": "P001"
            },
            {
                "type": "prediction",
                "timestamp": "2024-06-17T07:45:00Z",
                "message": "AI model updated predictions for 12 pumps",
                "priority": "Info",
                "pump_id": None
            }
        ])
        
        return {
            "activities": activities[:5],  # Return last 5 activities
            "total": len(activities)
        }
    except Exception as e:
        logger.error(f"Error getting recent activity: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving recent activity")