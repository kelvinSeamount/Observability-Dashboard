import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { fetchTraceDetails } from "../services/api"
import { ArrowLeft, Clock, GitBranch, Hourglass, Server } from "lucide-react"
import { format } from "date-fns"
import Card, { CardContent, CardHeader } from "../components/ui/Card"
import TraceTimeline, { SpanProps } from "../components/traces/TraceTimeline"
import SpanDetails, { Span } from "../components/traces/SpanDetails"


const TraceDetail = () => {
  const { traceId } = useParams<{ traceId: string }>();
  const [selectedSpanId, setSelectedSpanId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["trace", traceId],
    queryFn: () => fetchTraceDetails(traceId as string),
    enabled: !!traceId,
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-error/10 p-4 rounded-lg text-error">
          Failed to load trace details. The trace may not exist or may have
          expired.
        </div>
      </div>
    );
  }

  const { trace, spans } = data;

  // Select the first span if none is selected
  if (!selectedSpanId && spans.length > 0) {
    setSelectedSpanId(spans[0].id);
  }

  // Find the selected span
  const selectedSpan = spans.find((span) => span.id === selectedSpanId) || null;
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <Link
          to="/"
          className="flex items-center text-primary hover:underline w-fit"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to dashboard
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <GitBranch className="h-5 w-5 mr-2 text-primary" />
          Trace:{trace.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            {format(new Date(trace.timestamp), "MMM dd, yyyy HH:mm:ss")}
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Server className="h-4 w-4 mr-1" />
            Root service: {trace.rootService}
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Hourglass className="h-4 w-4 mr-1" />
            Total duration: {trace.duration.toFixed(2)}ms
          </div>
        </div>
      </div>
      <Card>
        <CardHeader>Span Timeline</CardHeader>
        <CardContent>
          <TraceTimeline
            spans={spans as SpanProps[]}
            selectedSpanId={selectedSpanId}
            onSelectSpan={setSelectedSpanId}
          />
        </CardContent>
      </Card>

      {selectedSpan && (
        <Card>
          <CardHeader>Span Details</CardHeader>
          <CardContent>
            <SpanDetails span={selectedSpan as unknown as Span} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default TraceDetail
