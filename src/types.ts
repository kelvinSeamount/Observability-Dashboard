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
