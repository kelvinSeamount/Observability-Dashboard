import { Download } from "lucide-react";
import TimeRangeSelector from "../ui/TimeRangeSelector";

import { Button } from "../ui/button";
import type { ServiceMetrics as ServiceMetricsType } from "../../types";
import Chart from "../metrics/chart";

interface ServiceMetricsProps {
  serviceId: string;
  metrics: ServiceMetricsType;
  timeRange: string;
  onTimeRangeChange: (timeRange: string) => void;
}

const ServiceMetrics = ({
  serviceId,
  metrics,
  timeRange,
  onTimeRangeChange,
}: ServiceMetricsProps) => {
  const handleExport = () => {
    const data = {
      serviceId,
      timeRange,
      metrics,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `service-metrics-${serviceId}-${timeRange}-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Service Metrics</h2>
        <div className="flex items-center gap-4">
          <TimeRangeSelector value={timeRange} onChange={onTimeRangeChange} />
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium mb-2">CPU Usage</h3>
          <div className="h-48">
            <Chart
              data={metrics.cpu}
              dataKey="value"
              stroke="#3B82F6"
              label="CPU %"
              height="100%"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium mb-2">Memory Usage</h3>
          <div className="h-48">
            <Chart
              data={metrics.memory}
              dataKey="value"
              stroke="#10B981"
              label="Memory %"
              height="100%"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium mb-2">Error Rate</h3>
          <div className="h-48">
            <Chart
              data={metrics.errorRate}
              dataKey="value"
              stroke="#EF4444"
              label="Errors/sec"
              height="100%"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium mb-2">Request Throughput</h3>
          <div className="h-48">
            <Chart
              data={metrics.throughput}
              dataKey="value"
              stroke="#8B5CF6"
              label="Requests/sec"
              height="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceMetrics;
