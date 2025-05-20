import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Clock, GitBranch } from "lucide-react";
import { format } from "date-fns";

export interface SpanProps {
  id: string;
  traceId: string;
  name: string;
  service: string;
  duration: number;
  timestamp: string;
  status: "success" | "error" | "warning";
}

 export interface SpanListProps{
    spans:SpanProps[]
}

const SpanList = ({spans}:SpanListProps) => {
    if(!spans || spans.length ===0 ){
        return(
            <h3 className="p-4 text-center text-gray-500 dark:text-gray-400">
            No traces found in the selected time range
            </h3>
        )
    }
    const formatDuration =(duration:number)=>{
        if(duration < 1 ){
            return `${(duration * 1000).toFixed(2)} μs`;
        }
        if(duration < 1000){
            return `${duration.toFixed(2)}ms`
        }
        return `${(duration / 1000).toFixed(2)}s`
    }


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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {spans.map((span) => (
          <TableRow key={span.id}>
            <TableCell>
              <Link
                to={`/traces/${span.traceId}`}
                className="flex items-center text-primary hover:underline font-medium"
              >
                <GitBranch className="h-4 w-4 mr-2" />
                {span.name}
              </Link>
            </TableCell>
            <TableCell className="text-gray-800 dark:text-gray-200">
              {span.service}
            </TableCell>
            <TableCell className="text-gray-800 dark:text-gray-200">
              {formatDuration(span.duration)}
            </TableCell>
            <TableCell className="text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {format(new Date(span.timestamp), "HH:mm:ss")}
              </div>
            </TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                  span.status
                )}`}
              >
                {span.status}
              </span>
            </TableCell>
            <TableCell>
              <Link
                to={`/logs?traceId=${span.traceId}`}
                className="text-primary hover:underline"
              >
                View Logs
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default SpanList
