from typing import Optional, List
from pydantic import BaseModel


class PumpBase(BaseModel):
    id: str
    name: str
    location: str
    pump_type: str
    status: str


class PumpSensorData(BaseModel):
    pressure: Optional[float] = None
    temperature: Optional[float] = None
    vibration: Optional[float] = None
    flow_rate: Optional[float] = None
    power: Optional[float] = None


class PumpAIInsights(BaseModel):
    health_score: Optional[float] = None
    predicted_failure_days: Optional[int] = None
    confidence: Optional[float] = None
    predicted_issue: Optional[str] = None


class PumpOperational(BaseModel):
    total_runtime: Optional[float] = None
    average_uptime: Optional[float] = None
    efficiency: Optional[float] = None


class Pump(PumpBase):
    # Sensor data
    pressure: Optional[float] = None
    temperature: Optional[float] = None
    vibration: Optional[float] = None
    flow_rate: Optional[float] = None
    power: Optional[float] = None
    
    # Operational data
    total_runtime: Optional[float] = None
    average_uptime: Optional[float] = None
    efficiency: Optional[float] = None
    
    # AI insights
    health_score: Optional[float] = None
    predicted_failure_days: Optional[int] = None
    confidence: Optional[float] = None
    predicted_issue: Optional[str] = None

    class Config:
        from_attributes = True


class PumpList(BaseModel):
    pumps: List[Pump]
    total: int