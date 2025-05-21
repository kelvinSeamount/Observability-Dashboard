import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import Card, { CardHeader, CardContent } from "../components/ui/Card";
import TimeRangeSelector from "../components/ui/TimeRangeSelector";
import MetricsChart from "../components/metrics/MetricsChart";
import SpanList from "../components/traces/SpanList";
import { fetchDashboardData } from "../services/api";
import { useTranslation } from "react-i18next";
import LogTable from "../components/logs/LogTable";

interface DashboardData {
  metrics: {
    requestRate: Array<{ timestamp: string; value: number }>;
    errorRate: Array<{ timestamp: string; value: number }>;
    latency: Array<{ timestamp: string; value: number }>;
    throughput: Array<{ timestamp: string; value: number }>;
    cpuUsage: Array<{ timestamp: string; value: number }>;
    memoryUsage: Array<{ timestamp: string; value: number }>;
  };
  traces: Array<{
    id: string;
    traceId: string;
    name: string;
    service: string;
    duration: number;
    timestamp: string;
    status: "success" | "error" | "warning";
  }>;
  logs: Array<{
    id: string;
    timestamp: string;
    level: string;
    message: string;
    service: string;
    metadata?: Record<string, any>;
  }>;
  stats: {
    requestRate: { value: number; change: number };
    errorRate: { value: number; change: number };
    avgLatency: { value: number; change: number };
    uptime: { value: number };
  };
}

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("1h");
  const { t } = useTranslation();

  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["dashboard", timeRange],
    queryFn: async () =>{
      const result = await fetchDashboardData(timeRange);
      return result as unknown as DashboardData
    } 
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-error/10 p-4 rounded-lg text-error">
          Failed to load dashboard data. Please try again.
        </div>
      </div>
    );
  }

  const defaultData: DashboardData = {
    metrics: {
      requestRate: [],
      errorRate: [],
      latency: [],
      throughput: [],
      cpuUsage: [],
      memoryUsage: [],
    },
    traces: [],
    logs: [],
    stats: {
      requestRate: { value: 0, change: 0 },
      errorRate: { value: 0, change: 0 },
      avgLatency: { value: 0, change: 0 },
      uptime: { value: 0 },
    },
  };

  const dashboardData = data || defaultData;
  const { metrics, traces, logs, stats } = dashboardData;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("dashboard.systemOverview")}
        </h1>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("dashboard.requestRate")}
              </p>
              <p className="text-2xl font-semibold mt-1">
                {stats.requestRate.value} {t("dashboard.reqPerSec")}
              </p>
              <div
                className={`flex items-center text-xs mt-1 ${
                  stats.requestRate.change >= 0 ? "text-success" : "text-error"
                }`}
              >
                {stats.requestRate.change >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                <span>
                  {Math.abs(stats.requestRate.change)}%{" "}
                  {t("dashboard.fromPrevious")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("dashboard.errorRate")}
              </p>
              <p className="text-2xl font-semibold mt-1">
                {stats.errorRate.value}%
              </p>
              <div
                className={`flex items-center text-xs mt-1 ${
                  stats.errorRate.change <= 0 ? "text-success" : "text-error"
                }`}
              >
                {stats.errorRate.change <= 0 ? (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                )}
                <span>
                  {Math.abs(stats.errorRate.change)}%{" "}
                  {t("dashboard.fromPrevious")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("dashboard.avgLatency")}
              </p>
              <p className="text-2xl font-semibold mt-1">
                {stats.avgLatency.value} ms
              </p>
              <div
                className={`flex items-center text-xs mt-1 ${
                  stats.avgLatency.change <= 0 ? "text-success" : "text-error"
                }`}
              >
                {stats.avgLatency.change <= 0 ? (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                )}
                <span>
                  {Math.abs(stats.avgLatency.change)}%{" "}
                  {t("dashboard.fromPrevious")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("dashboard.uptime")}
              </p>
              <p className="text-2xl font-semibold mt-1">
                {stats.uptime.value}%
              </p>
              <div className="flex items-center text-xs mt-1 text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                <span>{t("dashboard.last30Days")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Rate Chart */}
        <Card>
          <CardHeader>{t("dashboard.requestRate")}</CardHeader>
          <CardContent className="h-64">
            <MetricsChart
              data={metrics.requestRate}
              dataKey="value"
              stroke="#3B82F6"
              label={t("dashboard.reqPerSec")}
            />
          </CardContent>
        </Card>

        {/* Error Rate Chart */}
        <Card>
          <CardHeader>{t("dashboard.errorRate")}</CardHeader>
          <CardContent className="h-64">
            <MetricsChart
              data={metrics.errorRate}
              dataKey="value"
              stroke="#EF4444"
              label="%"
            />
          </CardContent>
        </Card>
      </div>

      {/* Latest Traces */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <span>{t("dashboard.recentTraces")}</span>
          <a href="/traces" className="text-sm text-primary hover:underline">
            {t("dashboard.viewAll")}
          </a>
        </CardHeader>
        <SpanList spans={traces} />
      </Card>

      {/* Recent Logs */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <span>{t("dashboard.recentLogs")}</span>
          <a href="/logs" className="text-sm text-primary hover:underline">
            {t("dashboard.viewAll")}
          </a>
        </CardHeader>
        <LogTable logs={logs} />
      </Card>
    </div>
  );
};

export default Dashboard;
