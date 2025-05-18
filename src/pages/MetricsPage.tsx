import { useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchMetrics } from "../services/api";
import { SERVICES } from "../config/constants";
import { useQueries } from "@tanstack/react-query";
import MetricsChart from "../components/metrics/MetricsChart";
import Card, { CardContent, CardHeader } from "../components/ui/Card";
import TimeRangeSelector from "../components/ui/TimeRangeSelector";


const METRICS = [
  { label: "metrics.requestRate", value: "requestRate", color: "#3B82F6" },
  { label: "metrics.errorRate", value: "errorRate", color: "#EF4444" },
  { label: "metrics.latency", value: "latency", color: "#10B981" },
  { label: "metrics.cpuUsage", value: "cpuUsage", color: "#F59E0B" },
  { label: "metrics.memoryUsage", value: "memoryUsage", color: "#6366F1" },
  { label: "metrics.throughput", value: "throughput", color: "#8B5CF6" },
];

const MetricsPage = () => {
    const [timeRange,setTimeRange]=useState('1h')
    const[service, setService]=useState('all')
    const{t}= useTranslation()
    const results = useQueries({
      queries: METRICS.map((metric) => ({
        queryKey: ["metrics", metric.value, timeRange, service],
        queryFn: () => fetchMetrics(metric.value, timeRange, { service }),
      })),
    });
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">{t("metrics.title")}</h1>
        <div className="flex gap-4">
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          >
            {SERVICES.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.value === "all" ? "logs.allServices" : option.label)}
              </option>
            ))}
          </select>
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {METRICS.map((metric, index) => (
          <Card key={metric.value}>
            <CardHeader>{t(metric.label)}</CardHeader>
            <CardContent className="h-64">
              {results[index].isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <MetricsChart
                  data={results[index].data || []}
                  dataKey="value"
                  stroke={metric.color}
                  label={t(metric.label)}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default MetricsPage
