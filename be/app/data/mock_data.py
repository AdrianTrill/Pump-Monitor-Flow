from datetime import datetime, timedelta
import random

# Mock pump data
MOCK_PUMPS = [
    {
        "id": "P001",
        "name": "Feed Pump A1",
        "location": "Unit A",
        "pump_type": "Centrifugal",
        "status": "Normal",
        "pressure": 45.2,
        "temperature": 78.0,
        "vibration": 2.3,
        "flow_rate": 1250.0,
        "power": 75.5,
        "total_runtime": 8760.0,
        "average_uptime": 98.5,
        "efficiency": 87.2,
        "health_score": 73.0,
        "predicted_failure_days": 18,
        "confidence": 85.0,
        "predicted_issue": "Bearing wear detected. Flow rate declining gradually.",
    },
    {
        "id": "P002",
        "name": "Booster Pump B3",
        "location": "Unit B",
        "pump_type": "Centrifugal",
        "status": "Warning",
        "pressure": 52.1,
        "temperature": 92.0,
        "vibration": 3.1,
        "flow_rate": 980.0,
        "power": 82.3,
        "total_runtime": 7200.0,
        "average_uptime": 96.8,
        "efficiency": 84.1,
        "health_score": 68.0,
        "predicted_failure_days": 12,
        "confidence": 87.0,
        "predicted_issue": "Temperature rising above normal range. Cooling system may need attention.",
    },
    {
        "id": "P003",
        "name": "Transfer Pump C2",
        "location": "Unit C",
        "pump_type": "Reciprocating",
        "status": "Critical",
        "pressure": 38.7,
        "temperature": 105.0,
        "vibration": 4.8,
        "flow_rate": 750.0,
        "power": 95.2,
        "total_runtime": 9100.0,
        "average_uptime": 92.1,
        "efficiency": 79.8,
        "health_score": 45.0,
        "predicted_failure_days": 5,
        "confidence": 92.0,
        "predicted_issue": "Critical overheating detected. Immediate maintenance required.",
    },
    {
        "id": "P004",
        "name": "Circulation Pump A2",
        "location": "Unit A",
        "pump_type": "Rotary",
        "status": "Normal",
        "pressure": 41.3,
        "temperature": 82.0,
        "vibration": 1.9,
        "flow_rate": 1150.0,
        "power": 68.7,
        "total_runtime": 6500.0,
        "average_uptime": 99.2,
        "efficiency": 91.5,
        "health_score": 89.0,
        "predicted_failure_days": 45,
        "confidence": 72.0,
        "predicted_issue": "Operating within normal parameters.",
    },
    {
        "id": "P005",
        "name": "Main Feed Pump",
        "location": "Unit B",
        "pump_type": "Centrifugal",
        "status": "Warning",
        "pressure": 48.9,
        "temperature": 88.0,
        "vibration": 2.8,
        "flow_rate": 1100.0,
        "power": 79.1,
        "total_runtime": 8200.0,
        "average_uptime": 97.3,
        "efficiency": 85.7,
        "health_score": 71.0,
        "predicted_failure_days": 22,
        "confidence": 79.0,
        "predicted_issue": "Flow rate fluctuations detected. Check impeller condition.",
    },
    {
        "id": "P006",
        "name": "Service Pump D1",
        "location": "Unit C",
        "pump_type": "Rotary",
        "status": "Normal",
        "pressure": 44.6,
        "temperature": 76.0,
        "vibration": 1.7,
        "flow_rate": 1300.0,
        "power": 72.4,
        "total_runtime": 5800.0,
        "average_uptime": 98.9,
        "efficiency": 93.2,
        "health_score": 94.0,
        "predicted_failure_days": 67,
        "confidence": 68.0,
        "predicted_issue": "Excellent condition. No immediate concerns detected.",
    },
]

# Mock maintenance logs
MOCK_MAINTENANCE_LOGS = [
    {
        "pump_id": "P001",
        "task": "Routine Inspection",
        "status": "Completed",
        "date": datetime(2024, 6, 10),
        "completed_date": datetime(2024, 6, 10),
        "technician": "John Smith",
    },
    {
        "pump_id": "P001",
        "task": "Bearing Replacement",
        "status": "Completed",
        "date": datetime(2024, 5, 15),
        "completed_date": datetime(2024, 5, 15),
        "technician": "Mike Johnson",
    },
    {
        "pump_id": "P001",
        "task": "Oil Change",
        "status": "Completed",
        "date": datetime(2024, 4, 20),
        "completed_date": datetime(2024, 4, 20),
        "technician": "Sarah Davis",
    },
    {
        "pump_id": "P001",
        "task": "Scheduled Inspection",
        "status": "Pending",
        "date": datetime(2024, 6, 25),
        "technician": "TBD",
    },
]

# Mock alerts
MOCK_ALERTS = [
    {
        "pump_id": "P003",
        "alert_type": "temperature",
        "priority": "Critical",
        "status": "Active",
        "message": "Temperature spike detected - 105°F",
        "remaining_useful_life": 5,
        "confidence": 92.0,
    },
    {
        "pump_id": "P002",
        "alert_type": "vibration",
        "priority": "High",
        "status": "Acknowledged",
        "message": "Vibration levels elevated",
        "remaining_useful_life": 12,
        "confidence": 87.0,
    },
    {
        "pump_id": "P005",
        "alert_type": "flow",
        "priority": "Medium",
        "status": "Active",
        "message": "Flow rate below optimal range",
        "remaining_useful_life": 18,
        "confidence": 75.0,
    },
    {
        "pump_id": "P001",
        "alert_type": "pressure",
        "priority": "Low",
        "status": "Resolved",
        "message": "Pressure fluctuation detected",
        "remaining_useful_life": 45,
        "confidence": 65.0,
    },
]

# Mock sensor data for trends (last 24 hours)
def generate_mock_sensor_data(pump_id: str):
    base_time = datetime.now() - timedelta(hours=24)
    data = []
    
    for i in range(24):
        timestamp = base_time + timedelta(hours=i)
        
        # Get base values from pump data
        pump = next((p for p in MOCK_PUMPS if p["id"] == pump_id), None)
        if not pump:
            continue
            
        # Add some variation
        vibration = pump["vibration"] + random.uniform(-0.5, 0.5)
        temperature = pump["temperature"] + random.uniform(-3, 3)
        pressure = pump["pressure"] + random.uniform(-2, 2)
        flow_rate = pump["flow_rate"] + random.uniform(-50, 50)
        power = pump["power"] + random.uniform(-5, 5)
        
        data.append({
            "pump_id": pump_id,
            "vibration": max(0, vibration),
            "temperature": max(50, temperature),
            "pressure": max(0, pressure),
            "flow_rate": max(0, flow_rate),
            "power": max(0, power),
            "recorded_at": timestamp,
        })
    
    return data


# Dashboard stats
DASHBOARD_STATS = {
    "total_pumps": 127,
    "critical_alerts": 3,
    "predicted_failures": 8,
    "system_health": 94,
}

# AI suggestions for chatbot
PUMP_DOMAIN_KNOWLEDGE = """
You are an AI assistant for a pump monitoring and predictive maintenance system. You have access to the following information:

CURRENT PUMP STATUS:
- Total Pumps: 127 active units
- Critical Alerts: 3 requiring immediate attention
- Predicted Failures: 8 in next 30 days
- System Health: 94% overall performance

PUMP TYPES AND LOCATIONS:
- Centrifugal pumps (most common)
- Rotary pumps
- Reciprocating pumps
- Located across Units A, B, C, and D

COMMON ISSUES AND MAINTENANCE:
- Bearing wear and replacement
- Temperature monitoring and cooling
- Vibration analysis
- Flow rate optimization
- Pressure regulation
- Routine inspections every 30-60 days
- Oil changes and lubrication
- Impeller condition checks

SENSOR MONITORING:
- Vibration sensors (normal: <3.0 mm/s)
- Temperature sensors (normal: <90°F)
- Pressure sensors (normal: 35-55 psi)
- Flow rate sensors (optimal: >1000 gpm)
- Power consumption monitoring

AI PREDICTIONS:
- Health scores calculated from multiple sensor inputs
- Remaining Useful Life (RUL) predictions
- Confidence levels for predictions
- Early warning for component failures

You can help users with:
1. Interpreting pump data and sensor readings
2. Understanding maintenance schedules
3. Explaining AI predictions and recommendations
4. Troubleshooting pump issues
5. Optimizing maintenance planning
6. Understanding alert priorities
"""