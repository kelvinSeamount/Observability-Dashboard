type MetricDataPoint = {
  timestamp: string;
  value: number;
};

export type Metrics = {
  requestRate: MetricDataPoint[];
  errorRate: MetricDataPoint[];
  latency: MetricDataPoint[];
  throughput: MetricDataPoint[];
  cpuUsage: MetricDataPoint[];
  memoryUsage: MetricDataPoint[];
  [key: string]: MetricDataPoint[];
};

export type ServiceHealth = "healthy" | "warning" | "error";
export type DependencyType = "http" | "grpc" | "kafka";
export type TraceStatus = "success" | "error" | "warning";

export interface Service {
  id: string;
  name: string;
  tags: string[];
  health: ServiceHealth;
  errorRate: number;
  latency: number;
}

export interface Dependency {
  source: string;
  target: string;
  type: DependencyType;
  latency: number;
  errorRate: number;
}

export interface ServiceMetrics {
  cpu: Array<{ timestamp: string; value: number }>;
  memory: Array<{ timestamp: string; value: number }>;
  errorRate: Array<{ timestamp: string; value: number }>;
  throughput: Array<{ timestamp: string; value: number }>;
}

export interface Trace {
  id: string;
  name: string;
  duration: number;
  status: TraceStatus;
  timestamp: string;
  serviceName: string;
}