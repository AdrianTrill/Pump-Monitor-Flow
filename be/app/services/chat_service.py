import json
import logging
from typing import List, Dict, Any, AsyncGenerator
from datetime import datetime

from openai import AsyncOpenAI
from app.schemas.chat import Message
from app.data.mock_data import (
    MOCK_PUMPS, MOCK_MAINTENANCE_LOGS, MOCK_ALERTS, 
    DASHBOARD_STATS, PUMP_DOMAIN_KNOWLEDGE, generate_mock_sensor_data
)
from app.core.config import settings

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# Current date for context
CURRENT_DATE = datetime.now().strftime("%d %b %Y")

SYSTEM_PROMPT = f"""
You are an AI assistant for a pump monitoring and predictive maintenance system. The current date is {CURRENT_DATE}.

{PUMP_DOMAIN_KNOWLEDGE}

Your role is to help answer questions about:
1. Pump status and performance data
2. Maintenance schedules and history
3. AI predictions and recommendations
4. System alerts and anomalies
5. Sensor data interpretation
6. Troubleshooting and optimization

Available functions:
- get_pump_details: Get detailed information about a specific pump
- get_all_pumps: Get list of all pumps with their status
- get_pump_maintenance: Get maintenance history for a pump
- get_system_alerts: Get current system alerts
- get_dashboard_stats: Get overall system statistics
- get_pump_trends: Get sensor data trends for a pump
- search_pumps: Search pumps by location, type, or status

Instructions:
- Always be helpful and provide actionable insights
- When discussing pump health, include specific sensor readings and recommendations
- For maintenance questions, reference actual maintenance history
- Explain AI predictions with confidence levels
- Prioritize critical issues and safety concerns
- Use technical terminology appropriately but explain complex concepts clearly

Answer in a professional and informative manner, focusing on operational insights and recommendations.
"""

AVAILABLE_FUNCTIONS = [
    {
        "name": "get_pump_details",
        "description": "Get detailed information about a specific pump including sensors, AI insights, and operational data",
        "parameters": {
            "type": "object",
            "properties": {
                "pump_id": {
                    "type": "string",
                    "description": "The pump ID (e.g., 'P001', 'P002')",
                },
            },
            "required": ["pump_id"],
        },
    },
    {
        "name": "get_all_pumps",
        "description": "Get list of all pumps with their current status and key metrics",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
    {
        "name": "get_pump_maintenance",
        "description": "Get maintenance history for a specific pump",
        "parameters": {
            "type": "object",
            "properties": {
                "pump_id": {
                    "type": "string",
                    "description": "The pump ID for which to get maintenance history",
                },
            },
            "required": ["pump_id"],
        },
    },
    {
        "name": "get_system_alerts",
        "description": "Get current system alerts and anomalies",
        "parameters": {
            "type": "object",
            "properties": {
                "status": {
                    "type": "string",
                    "description": "Optional filter by status: 'Active', 'Acknowledged', 'Resolved'",
                },
                "priority": {
                    "type": "string",
                    "description": "Optional filter by priority: 'Critical', 'High', 'Medium', 'Low'",
                },
            },
            "required": [],
        },
    },
    {
        "name": "get_dashboard_stats",
        "description": "Get overall system statistics and health metrics",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
    {
        "name": "get_pump_trends",
        "description": "Get sensor data trends for a specific pump over the last 24 hours",
        "parameters": {
            "type": "object",
            "properties": {
                "pump_id": {
                    "type": "string",
                    "description": "The pump ID for which to get trend data",
                },
            },
            "required": ["pump_id"],
        },
    },
    {
        "name": "search_pumps",
        "description": "Search pumps by location, type, status, or other criteria",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "Filter by location (e.g., 'Unit A', 'Unit B')",
                },
                "pump_type": {
                    "type": "string",
                    "description": "Filter by pump type (e.g., 'Centrifugal', 'Rotary')",
                },
                "status": {
                    "type": "string",
                    "description": "Filter by status (e.g., 'Normal', 'Warning', 'Critical')",
                },
            },
            "required": [],
        },
    },
]


async def execute_function(function_name: str, args: Dict[str, Any]) -> Dict[str, Any]:
    logger.info(f"Executing function: {function_name} with args: {args}")

    if function_name == "get_pump_details":
        pump_id = args.get("pump_id")
        pump = next((p for p in MOCK_PUMPS if p["id"] == pump_id), None)
        if pump:
            return {
                "pump": pump,
                "found": True
            }
        else:
            return {
                "error": f"Pump with ID {pump_id} not found",
                "found": False
            }

    elif function_name == "get_all_pumps":
        return {
            "pumps": MOCK_PUMPS,
            "total": len(MOCK_PUMPS)
        }

    elif function_name == "get_pump_maintenance":
        pump_id = args.get("pump_id")
        maintenance = [log for log in MOCK_MAINTENANCE_LOGS if log["pump_id"] == pump_id]
        return {
            "pump_id": pump_id,
            "maintenance_logs": maintenance,
            "count": len(maintenance)
        }

    elif function_name == "get_system_alerts":
        status_filter = args.get("status")
        priority_filter = args.get("priority")
        
        alerts = MOCK_ALERTS
        if status_filter:
            alerts = [a for a in alerts if a["status"] == status_filter]
        if priority_filter:
            alerts = [a for a in alerts if a["priority"] == priority_filter]
        
        return {
            "alerts": alerts,
            "count": len(alerts),
            "filters": {"status": status_filter, "priority": priority_filter}
        }

    elif function_name == "get_dashboard_stats":
        return DASHBOARD_STATS

    elif function_name == "get_pump_trends":
        pump_id = args.get("pump_id")
        sensor_data = generate_mock_sensor_data(pump_id)
        return {
            "pump_id": pump_id,
            "sensor_data": sensor_data,
            "data_points": len(sensor_data)
        }

    elif function_name == "search_pumps":
        location = args.get("location")
        pump_type = args.get("pump_type")
        status = args.get("status")
        
        pumps = MOCK_PUMPS
        if location:
            pumps = [p for p in pumps if location.lower() in p["location"].lower()]
        if pump_type:
            pumps = [p for p in pumps if pump_type.lower() in p["pump_type"].lower()]
        if status:
            pumps = [p for p in pumps if p["status"] == status]
        
        return {
            "pumps": pumps,
            "count": len(pumps),
            "filters": {"location": location, "pump_type": pump_type, "status": status}
        }

    else:
        return {"error": f"Function {function_name} is not implemented"}


async def stream_chat_message(
    user_message: str, chat_history: List[Message]
) -> AsyncGenerator[str, None]:
    logger.info(f"Starting chat message stream with user message: {user_message}")
    
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *[
            {"role": msg.role, "content": msg.content, "name": msg.name}
            for msg in chat_history
            if msg.name
        ],
        *[
            {"role": msg.role, "content": msg.content}
            for msg in chat_history
            if not msg.name
        ],
        {"role": "user", "content": user_message},
    ]
    
    async for token in _stream_with_function_call_handling(messages):
        yield token


async def _stream_with_function_call_handling(
    messages: List[Dict[str, Any]],
) -> AsyncGenerator[str, None]:
    request_params = {
        "model": settings.OPENAI_MODEL,
        "messages": messages,
        "stream": True,
        "tools": [{"type": "function", "function": func} for func in AVAILABLE_FUNCTIONS],
        "tool_choice": "auto",
    }
    
    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    logger.debug("Initiating streaming chat completion with function call handling")
    
    stream = await client.chat.completions.create(**request_params)

    function_name = None
    function_args = []
    capturing_function = False

    async for chunk in stream:
        delta = chunk.choices[0].delta

        if delta.tool_calls:
            for tool_call in delta.tool_calls:
                if tool_call.function.name:
                    function_name = tool_call.function.name
                    capturing_function = True
                    logger.info(f"Detected function call: {function_name}")
                if tool_call.function.arguments:
                    function_args.append(tool_call.function.arguments)
            continue

        if delta.content:
            if capturing_function:
                continue
            yield delta.content

    if function_name:
        args_str = "".join(function_args).strip()
        logger.info(f"Executing function {function_name} with arguments: {args_str}")
        
        try:
            parsed_args = json.loads(args_str) if args_str else {}
        except json.JSONDecodeError:
            parsed_args = {}
            logger.error("Failed to parse function call arguments.")
        
        function_result = await execute_function(function_name, parsed_args)
        logger.debug(f"Function {function_name} executed with result")

        messages.append({
            "role": "assistant",
            "content": None,
            "tool_calls": [{
                "id": "call_1",
                "type": "function",
                "function": {
                    "name": function_name,
                    "arguments": args_str,
                }
            }]
        })
        
        messages.append({
            "role": "tool",
            "tool_call_id": "call_1",
            "content": json.dumps(function_result),
        })
        
        logger.info("Sending second request to get final response after function execution")
        second_request_params = {
            "model": settings.OPENAI_MODEL,
            "messages": messages,
            "stream": True,
            "tools": [{"type": "function", "function": func} for func in AVAILABLE_FUNCTIONS],
            "tool_choice": "auto",
        }
        
        second_stream = await client.chat.completions.create(**second_request_params)
        async for chunk in second_stream:
            delta = chunk.choices[0].delta
            if delta.content:
                yield delta.content


async def generate_chat_suggestions(
    user_message: str, chat_history: List[Message]
) -> Dict[str, Any]:
    logger.info("Generating follow-up chat suggestions")
    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    suggestion_prompt = f"""
You are an AI assistant for a pump monitoring system. Analyze the conversation and suggest 3-5 relevant follow-up questions.

Current context:
- Total pumps: 127 active units
- Critical alerts: 3 requiring attention
- System health: 94%

Based on the user's message: "{user_message}"

Suggest practical follow-up questions they might ask about:
1. Specific pump details and diagnostics
2. Maintenance schedules and history
3. Alert investigation and resolution
4. AI predictions and recommendations
5. System optimization and troubleshooting

Return only valid JSON in this format:
{{
  "suggestions": [
    "Follow-up question 1",
    "Follow-up question 2",
    ...
  ]
}}
"""

    messages = [
        {"role": "system", "content": "You are a helpful assistant that only responds with valid JSON."},
        *[{"role": msg.role, "content": msg.content} for msg in chat_history],
        {"role": "user", "content": suggestion_prompt},
    ]

    logger.debug("Sending request to generate chat suggestions")
    response = await client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=messages,
        temperature=0.7,
        response_format={"type": "json_object"}
    )

    suggestions_str = response.choices[0].message.content.strip()
    logger.debug(f"Received suggestions response: {suggestions_str}")
    
    try:
        suggestions_json = json.loads(suggestions_str)
        logger.info("Chat suggestions generated successfully")
    except json.JSONDecodeError:
        logger.error("Failed to parse suggestions into JSON")
        suggestions_json = {"suggestions": []}

    return suggestions_json