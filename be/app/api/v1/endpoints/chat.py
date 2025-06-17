from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.schemas.chat import ChatRequest, ChatSuggestion
from app.services.chat_service import stream_chat_message, generate_chat_suggestions
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

router = APIRouter()


@router.post("/stream")
async def stream_chat_message_endpoint(chat_request: ChatRequest):
    """
    Process a chat message and stream the response tokens
    """
    try:
        logger.info(f"Received chat request: {chat_request.message[:50]}...")
        return StreamingResponse(
            stream_chat_message(chat_request.message, chat_request.chat_history),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
            }
        )
    except Exception as e:
        logger.error(f"Error processing chat message: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error processing message: {str(e)}"
        )


@router.post("/suggestions", response_model=ChatSuggestion)
async def get_chat_suggestions_endpoint(chat_request: ChatRequest):
    """
    Generate follow-up chat suggestions based on the user's last message and conversation history.
    Returns a JSON response with a list of suggestions.
    """
    try:
        logger.info(f"Generating suggestions for: {chat_request.message[:50]}...")
        suggestions = await generate_chat_suggestions(chat_request.message, chat_request.chat_history)
        return suggestions
    except Exception as e:
        logger.error(f"Error generating chat suggestions: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error generating suggestions: {str(e)}"
        )