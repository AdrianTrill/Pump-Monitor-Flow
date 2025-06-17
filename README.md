# Pump Monitoring & Predictive Maintenance System

A modern web application for monitoring pump systems with AI-powered predictive maintenance capabilities. The application displays real-time pump data, system health metrics, alerts, and provides an AI assistant for operational insights.

**Note**: Currently uses mock data for demonstration purposes. Backend is primarily for AI chat functionality.

## Features

- **Dashboard**: Real-time pump status overview and system health monitoring
- **Pump Management**: Detailed pump information, sensor data, and performance metrics  
- **Alerts & Anomalies**: Critical event monitoring and alert management
- **AI Assistant**: Intelligent chat interface for maintenance recommendations and system insights
- **Predictive Analytics**: AI-powered failure prediction and maintenance scheduling

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, Python 3.11, OpenAI API
- **Data**: Mock data for pumps, sensors, alerts, and maintenance logs

## Setup Instructions

### Local Development

#### Backend Setup:
1. Navigate to `be/` directory
2. Create a Python virtual environment: `python -m venv venv`
3. Activate virtual environment: `source venv/bin/activate` (Linux/Mac) or `venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Configure `.env.development` from `.env.example`
6. Set environment: `export APP_ENV=development`
7. Run the application: `python -m app.main` or `uvicorn app.main:app --reload`

#### Frontend Setup:
1. Navigate to `fe/` directory
2. Install dependencies: `npm install`
3. Configure `.env.local` from `.env.example`
4. Run the development server: `npm run dev`

### Docker Setup:
1. Configure environment variables in `.env` file
2. Run both services: `docker-compose up -d`
3. Or build individually:
   - Backend: `cd be && docker build -t pump-monitor-backend .`
   - Frontend: `cd fe && docker build -t pump-monitor-frontend .`

## Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Environment Variables

### Backend (.env.development)
```
APP_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
SECRET_KEY=your-secret-key-here
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```
