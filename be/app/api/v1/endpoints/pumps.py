from fastapi import APIRouter, HTTPException
from typing import Optional
from app.schemas.pump import Pump, PumpList
from app.data.mock_data import MOCK_PUMPS, MOCK_MAINTENANCE_LOGS, generate_mock_sensor_data
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/", response_model=PumpList)
async def get_all_pumps():
    """Get all pumps with their current status"""
    try:
        return PumpList(pumps=MOCK_PUMPS, total=len(MOCK_PUMPS))
    except Exception as e:
        logger.error(f"Error getting all pumps: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving pumps")


@router.get("/{pump_id}", response_model=Pump)
async def get_pump_details(pump_id: str):
    """Get detailed information about a specific pump"""
    try:
        pump = next((p for p in MOCK_PUMPS if p["id"] == pump_id), None)
        if not pump:
            raise HTTPException(status_code=404, detail=f"Pump {pump_id} not found")
        return pump
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting pump {pump_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving pump details")


@router.get("/{pump_id}/maintenance")
async def get_pump_maintenance(pump_id: str):
    """Get maintenance history for a specific pump"""
    try:
        # Check if pump exists
        pump = next((p for p in MOCK_PUMPS if p["id"] == pump_id), None)
        if not pump:
            raise HTTPException(status_code=404, detail=f"Pump {pump_id} not found")
        
        # Get maintenance logs for this pump
        maintenance_logs = [log for log in MOCK_MAINTENANCE_LOGS if log["pump_id"] == pump_id]
        
        return {
            "pump_id": pump_id,
            "maintenance_logs": maintenance_logs,
            "count": len(maintenance_logs)
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting maintenance for pump {pump_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving pump maintenance")


@router.get("/{pump_id}/trends")
async def get_pump_trends(pump_id: str):
    """Get sensor data trends for a specific pump"""
    try:
        # Check if pump exists
        pump = next((p for p in MOCK_PUMPS if p["id"] == pump_id), None)
        if not pump:
            raise HTTPException(status_code=404, detail=f"Pump {pump_id} not found")
        
        sensor_data = generate_mock_sensor_data(pump_id)
        return {
            "pump_id": pump_id,
            "sensor_data": sensor_data,
            "data_points": len(sensor_data)
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting trends for pump {pump_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving pump trends")


@router.get("/search/")
async def search_pumps(
    location: Optional[str] = None,
    pump_type: Optional[str] = None,
    status: Optional[str] = None
):
    """Search pumps by location, type, or status"""
    try:
        pumps = MOCK_PUMPS
        
        if location:
            pumps = [p for p in pumps if location.lower() in p["location"].lower()]
        if pump_type:
            pumps = [p for p in pumps if pump_type.lower() in p["pump_type"].lower()]
        if status:
            pumps = [p for p in pumps if p["status"].lower() == status.lower()]
        
        return {
            "pumps": pumps,
            "total": len(pumps),
            "filters": {
                "location": location,
                "pump_type": pump_type,
                "status": status
            }
        }
    except Exception as e:
        logger.error(f"Error searching pumps: {str(e)}")
        raise HTTPException(status_code=500, detail="Error searching pumps")