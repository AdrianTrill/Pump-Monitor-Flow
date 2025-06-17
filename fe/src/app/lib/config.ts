/**
 * Frontend configuration - reads environment variables
 */

const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  },
  
  // Development flags
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
};

// Validation - ensure required environment variables are set
if (!config.api.baseUrl) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is required");
}

// Log configuration in development
if (config.isDevelopment) {
  console.log("Frontend Config:", {
    apiUrl: config.api.baseUrl,
    environment: process.env.NODE_ENV
  });
}

export default config;