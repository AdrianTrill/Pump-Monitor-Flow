from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class Message(BaseModel):
    role: Literal["user", "assistant", "system", "function"]
    content: str
    name: Optional[str] = None


class ChatRequest(BaseModel):
    message: str
    chat_history: Optional[List[Message]] = Field(default_factory=list)


class ChatSuggestion(BaseModel):
    suggestions: List[str]


class FunctionCall(BaseModel):
    name: str
    arguments: str


class ChatResponse(BaseModel):
    content: str
    function_call: Optional[FunctionCall] = None