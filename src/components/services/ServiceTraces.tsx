import { useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Clock, GitBranch } from "lucide-react";
import type { Trace } from "../../types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";



interface ServiceTracesProps {
  traces: Trace[];
}

const ServiceTraces = ({ traces }: ServiceTracesProps) => {
  const [filter, setFilter] = useState({
    status: "all",
    minDuration: "",
  });

  const filteredTraces = traces.filter((trace) => {
    if (filter.status !== "all" && trace.status !== filter.status) return false;
    if (filter.minDuration && trace.duration < parseInt(filter.minDuration))
      return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-success text-success-foreground";
      case "error":
        return "bg-error text-error-foreground";
      case "warning":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 p-4">
        <select
          value={filter.status}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, status: e.target.value }))
          }
          className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>

        <input
          type="number"
          placeholder="Min duration (ms)"
          value={filter.minDuration}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, minDuration: e.target.value }))
          }
          className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Trace</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTraces.map((trace) => (
            <TableRow key={trace.id}>
              <TableCell>
                <Link
                  to={`/traces/${trace.id}`}
                  className="flex items-center text-primary hover:underline"
                >
                  <GitBranch className="h-4 w-4 mr-2" />
                  {trace.name}
                </Link>
              </TableCell>
              <TableCell>{trace.serviceName}</TableCell>
              <TableCell>{trace.duration.toFixed(2)}ms</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                    trace.status
                  )}`}
                >
                  {trace.status}
                </span>
              </TableCell>
              <TableCell className="text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {format(new Date(trace.timestamp), "HH:mm:ss")}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServiceTraces;
