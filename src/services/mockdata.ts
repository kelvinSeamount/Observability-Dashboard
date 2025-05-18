// Mock data generation for development purposes
import { sub } from "date-fns";

// Helper to generate random data points
const generateDataPoints = (
  count: number,
  min: number,
  max: number,
  trend: "up" | "down" | "stable" = "stable"
) => {
  const now = new Date();
  const points = [];

  for (let i = 0; i < count; i++) {
    // Create base value
    let baseValue = Math.random() * (max - min) + min;

    // Apply trend
    if (trend === "up") {
      baseValue = baseValue * (1 + (i / count) * 0.5);
    } else if (trend === "down") {
      baseValue = baseValue * (1 - (i / count) * 0.3);
    }

    // Add some noise
    const value = baseValue + (Math.random() - 0.5) * (max - min) * 0.1;

    // Calculate timestamp (going back in time)
    const timestamp = new Date(now.getTime() - (count - i) * (60 * 1000));

    points.push({
      timestamp: timestamp.toISOString(),
      value: Math.max(0, value), // Ensure no negative values
    });
  }

  return points;
};

// Generate mock traces
const generateTraces = (count: number) => {
  const services = [
    "api-gateway",
    "user-service",
    "product-service",
    "payment-service",
    "notification-service",
  ];
  const statuses = ["success", "error", "warning"];
  const traces = [];

  for (let i = 0; i < count; i++) {
    const traceId = `trace-${Math.random().toString(36).substr(2, 9)}`;
    const service = services[Math.floor(Math.random() * services.length)];
    const status =
      Math.random() > 0.8
        ? "error"
        : Math.random() > 0.7
        ? "warning"
        : "success";
    const duration = Math.random() * 500 + 20; // 20-520ms

    traces.push({
      id: `span-${Math.random().toString(36).substr(2, 9)}`,
      traceId,
      name: `${service} ${i % 2 === 0 ? "GET" : "POST"} request`,
      service,
      duration,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      status,
    });
  }

  return traces;
};

// Generate mock logs
const generateLogs = (count: number) => {
  const services = [
    "api-gateway",
    "user-service",
    "product-service",
    "payment-service",
    "notification-service",
  ];
  const levels = ["info", "warn", "error", "debug"];
  const messages = [
    "Request processed successfully",
    "Database query completed",
    "Authentication succeeded",
    "User session created",
    "Payment processed",
    "Failed to connect to database",
    "Request timeout",
    "API rate limit exceeded",
    "Invalid authentication token",
    "Resource not found",
  ];

  const logs = [];

  for (let i = 0; i < count; i++) {
    const service = services[Math.floor(Math.random() * services.length)];
    let level = "info";

    // Distribution: 60% info, 20% warn, 15% error, 5% debug
    const rand = Math.random();
    if (rand > 0.95) level = "debug";
    else if (rand > 0.8) level = "error";
    else if (rand > 0.6) level = "warn";

    // Select message based on level
    let message = "";
    if (level === "error") {
      message = messages.slice(5).at(Math.floor(Math.random() * 5)) || "";
    } else {
      message = messages.slice(0, 5).at(Math.floor(Math.random() * 5)) || "";
    }

    // Add some randomization to the message
    const suffix = Math.random().toString(36).substring(2, 10);
    message = `${message} (${suffix})`;

    const metadata =
      level !== "info"
        ? {
            requestId: `req-${Math.random().toString(36).substring(2, 10)}`,
            userId: Math.floor(Math.random() * 1000),
            duration: Math.floor(Math.random() * 500),
          }
        : undefined;

    logs.push({
      id: `log-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      level,
      message,
      service,
      metadata,
    });
  }

  // Sort by timestamp (newest first)
  return logs.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Dashboard data
export const mockDashboardData = (timeRange: string) => {
  // Generate metrics based on time range
  const getPointCount =(range:string):number=>{

 switch (range) {
   case "15m":
     return 15;
   case "1h":
     return 30;
   case "3h":
     return 36;
   case "6h":
   case "12h":
     return 72;
   case "1d":
     return 96;
   case "3d":
     return 72;
   default: // 1w
     return 60;
 }

  }
   const pointCount = getPointCount(timeRange);
  return {
    metrics: {
      requestRate: generateDataPoints(pointCount, 10, 100, "up"),
      errorRate: generateDataPoints(pointCount, 0, 8, "down"),
      latency: generateDataPoints(pointCount, 50, 200, "stable"),
      throughput: generateDataPoints(pointCount, 50, 500, "up"),
      cpuUsage: generateDataPoints(pointCount, 20, 80, "up"),
      memoryUsage: generateDataPoints(pointCount, 30, 90, "stable"),
    },
    traces: generateTraces(10),
    logs: generateLogs(20),
    stats: {
      requestRate: {
        value: 53.2,
        change: 5.3,
      },
      errorRate: {
        value: 2.1,
        change: -0.8,
      },
      avgLatency: {
        value: 121,
        change: 3.2,
      },
      uptime: {
        value: 99.98,
      },
    },
  };
};

// Trace details
export const mockTraceDetails = (traceId: string) => {
  const services = [
    "api-gateway",
    "user-service",
    "product-service",
    "payment-service",
    "notification-service",
  ];
  const rootService = services[Math.floor(Math.random() * services.length)];

  // Generate a root span
  const rootSpan = {
    id: `span-root-${Math.random().toString(36).substr(2, 9)}`,
    parentId: null,
    name: `${rootService} request`,
    service: rootService,
    startTime: 0,
    duration: 240,
    status: Math.random() > 0.7 ? "error" : "success",
    metadata: {
      "http.method": "GET",
      "http.url": "/api/products",
      "http.status_code": 200,
      "http.user_agent": "Mozilla/5.0",
      "net.peer.ip": "192.168.1.1",
    },
    logs: [
      {
        timestamp: new Date().toISOString(),
        level: "info",
        message: "Request received",
      },
      {
        timestamp: new Date(Date.now() + 50).toISOString(),
        level: "info",
        message: "Processing request",
      },
      {
        timestamp: new Date(Date.now() + 200).toISOString(),
        level: "info",
        message: "Request completed",
      },
    ],
    events: [
      {
        timestamp: new Date().toISOString(),
        name: "request.start",
        attributes: {
          method: "GET",
          path: "/api/products",
        },
      },
      {
        timestamp: new Date(Date.now() + 240).toISOString(),
        name: "request.end",
        attributes: {
          statusCode: 200,
          duration: 240,
        },
      },
    ],
  };

  // Generate child spans
  const childSpans = [];
  let currentStartTime = 20; // Start 20ms into the trace

  // DB query span
  childSpans.push({
    id: `span-db-${Math.random().toString(36).substr(2, 9)}`,
    parentId: rootSpan.id,
    name: "Database query",
    service: "product-service",
    startTime: currentStartTime,
    duration: 100,
    status: "success",
    metadata: {
      "db.system": "mongodb",
      "db.name": "products",
      "db.operation": "find",
      "db.statement": 'db.products.find({status: "active"})',
    },
    logs: [
      {
        timestamp: new Date(Date.now() + currentStartTime).toISOString(),
        level: "info",
        message: "Executing database query",
      },
      {
        timestamp: new Date(Date.now() + currentStartTime + 100).toISOString(),
        level: "info",
        message: "Query completed successfully",
      },
    ],
    events: [
      {
        timestamp: new Date(Date.now() + currentStartTime).toISOString(),
        name: "db.query.start",
        attributes: {
          query: "find",
          collection: "products",
        },
      },
      {
        timestamp: new Date(Date.now() + currentStartTime + 100).toISOString(),
        name: "db.query.end",
        attributes: {
          rowCount: 42,
          duration: 100,
        },
      },
    ],
  });

  currentStartTime += 120;

  // Cache span
  childSpans.push({
    id: `span-cache-${Math.random().toString(36).substr(2, 9)}`,
    parentId: rootSpan.id,
    name: "Cache lookup",
    service: "product-service",
    startTime: currentStartTime,
    duration: 15,
    status: "success",
    metadata: {
      "cache.operation": "get",
      "cache.key": "product:popular",
    },
    logs: [
      {
        timestamp: new Date(Date.now() + currentStartTime).toISOString(),
        level: "info",
        message: "Cache lookup",
      },
      {
        timestamp: new Date(Date.now() + currentStartTime + 15).toISOString(),
        level: "info",
        message: "Cache hit",
      },
    ],
    events: [
      {
        timestamp: new Date(Date.now() + currentStartTime).toISOString(),
        name: "cache.get",
        attributes: {
          key: "product:popular",
        },
      },
    ],
  });

  currentStartTime += 20;

  // External API call span
  childSpans.push({
    id: `span-api-${Math.random().toString(36).substr(2, 9)}`,
    parentId: rootSpan.id,
    name: "External API call",
    service: "payment-service",
    startTime: currentStartTime,
    duration: 80,
    status: Math.random() > 0.7 ? "warning" : "success",
    metadata: {
      "http.method": "POST",
      "http.url": "https://api.payment-processor.com/check",
      "http.status_code": 200,
    },
    logs: [
      {
        timestamp: new Date(Date.now() + currentStartTime).toISOString(),
        level: "info",
        message: "Making external API call",
      },
      {
        timestamp: new Date(Date.now() + currentStartTime + 40).toISOString(),
        level: "warn",
        message: "Slow response from external API",
      },
      {
        timestamp: new Date(Date.now() + currentStartTime + 80).toISOString(),
        level: "info",
        message: "External API call completed",
      },
    ],
    events: [
      {
        timestamp: new Date(Date.now() + currentStartTime).toISOString(),
        name: "http.request",
        attributes: {
          method: "POST",
          url: "https://api.payment-processor.com/check",
        },
      },
      {
        timestamp: new Date(Date.now() + currentStartTime + 80).toISOString(),
        name: "http.response",
        attributes: {
          statusCode: 200,
          duration: 80,
        },
      },
    ],
  });

  return {
    trace: {
      id: traceId,
      name: `${rootService} request`,
      rootService,
      timestamp: new Date().toISOString(),
      duration: rootSpan.duration,
    },
    spans: [rootSpan, ...childSpans],
  };
};

// Mock service metrics
export const mockServiceMetrics = (serviceId: string) => {
  return {
    cpu: generateDataPoints(30, 20, 80, "up"),
    memory: generateDataPoints(30, 30, 90, "stable"),
    errorRate: generateDataPoints(30, 0, 8, "down"),
    throughput: generateDataPoints(30, 50, 500, "up"),
  };
};

// Mock service dependencies
export const mockServiceDependencies = (serviceId: string) => {
  const services = [
    { id: "api-gateway", name: "API Gateway", health: "healthy" },
    { id: "user-service", name: "User Service", health: "healthy" },
    { id: "product-service", name: "Product Service", health: "warning" },
    { id: "payment-service", name: "Payment Service", health: "error" },
    {
      id: "notification-service",
      name: "Notification Service",
      health: "healthy",
    },
  ];

  const dependencies = [
    {
      source: "api-gateway",
      target: "user-service",
      type: "http",
      latency: 45,
      errorRate: 0.5,
    },
    {
      source: "api-gateway",
      target: "product-service",
      type: "http",
      latency: 65,
      errorRate: 1.2,
    },
    {
      source: "product-service",
      target: "payment-service",
      type: "grpc",
      latency: 120,
      errorRate: 2.5,
    },
    {
      source: "payment-service",
      target: "notification-service",
      type: "kafka",
      latency: 250,
      errorRate: 0.8,
    },
  ];

  return { services, dependencies };
};

// Mock service traces
export const mockServiceTraces = (serviceId: string) => {
  const traces = [];
  const now = new Date();

  for (let i = 0; i < 20; i++) {
    traces.push({
      id: `trace-${Math.random().toString(36).substr(2, 9)}`,
      name: `${i % 2 === 0 ? "GET" : "POST"} /api/${serviceId}`,
      duration: Math.random() * 500 + 20,
      status:
        Math.random() > 0.8
          ? "error"
          : Math.random() > 0.7
          ? "warning"
          : "success",
      timestamp: sub(now, {
        minutes: Math.floor(Math.random() * 60),
      }).toISOString(),
      serviceName: serviceId,
    });
  }

  return traces.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};
