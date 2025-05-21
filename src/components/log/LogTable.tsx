import { AlertCircle, Info } from "lucide-react";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { format } from "date-fns";

interface Log {
  id: string;
  timestamp: string;
  level: string;
  service: string;
  message: string;
  metadata?: Record<string, any>;
}

interface LogTableProps {
  logs: Log[];
}

const LogTable: React.FC<LogTableProps> = ({ logs }) => {
  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-error" />;
      case "warn":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case "info":
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  }
 
  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-error";
      case "warn":
        return "text-warning";
      case "info":
        default :
        return "text-primary";
    }
  }


   if (!logs.length) {
     return (
       <div className="text-center py-8 text-gray-500 dark:text-gray-400">
         No logs found for the selected filters.
       </div>
     );
   }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Service</TableHead>
          <TableHead className="w-full">Message</TableHead>
          <TableHead>Metadata</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>{format(new Date(log.timestamp), "HH:mm:ss")}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {getLevelIcon(log.level)}
                <span className={`font-medium ${getLevelColor(log.level)}`}>
                  {log.level.toUpperCase()}
                </span>
              </div>
            </TableCell>
            <TableCell className="whitespace-nowrap">{log.service}</TableCell>
            <TableCell className="font-mono text-sm">{log.message}</TableCell>
            <TableCell>
              {log.metadata && (
                <pre className="text-xs text-gray-500 dark:text-gray-400">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LogTable;
