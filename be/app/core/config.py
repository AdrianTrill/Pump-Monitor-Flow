from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App settings
    APP_ENV: str
    
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Pump Monitor"
    
    # OpenAI
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-4.1"
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str]
    
    # Security
    SECRET_KEY: str
    
    class Config:
        env_file = ".env.local"
        case_sensitive = True


settings = Settings()