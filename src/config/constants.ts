// API Configuration
export const API_URL = "http://localhost:5000/api";

// Time ranges for metrics and logs
export const TIME_RANGES = [
  { label: "Last 15 minutes", value: "15m" },
  { label: "Last hour", value: "1h" },
  { label: "Last 3 hours", value: "3h" },
  { label: "Last 6 hours", value: "6h" },
  { label: "Last 12 hours", value: "12h" },
  { label: "Last day", value: "1d" },
  { label: "Last 3 days", value: "3d" },
  { label: "Last week", value: "1w" },
];

// Log levels for filtering
export const LOG_LEVELS = [
  { label: "All Levels", value: "all" },
  { label: "Error", value: "error" },
  { label: "Warning", value: "warn" },
  { label: "Info", value: "info" },
  { label: "Debug", value: "debug" },
];

// Services for filtering
export const SERVICES = [
  { label: "All Services", value: "all" },
  { label: "API Gateway", value: "api-gateway" },
  { label: "User Service", value: "user-service" },
  { label: "Product Service", value: "product-service" },
  { label: "Payment Service", value: "payment-service" },
  { label: "Notification Service", value: "notification-service" },
];
