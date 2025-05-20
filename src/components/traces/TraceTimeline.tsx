import { useEffect, useRef, useState } from "react";

export interface SpanProps {
  id: string;
  status: "success" | "error" | "warning";
  name: string;
  service: string;
  startTime: number;
  parentId: string | null;
  duration: number;
}

export interface TraceTimeLineProps {
  spans: SpanProps[];
  selectedSpanId: string | null;
  onSelectSpan: (spanId: string) => void;
}

const TraceTimeline = ({
  spans,
  onSelectSpan,
  selectedSpanId,
}: TraceTimeLineProps) => {
  const [timelineWidth, setTimelineWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sort spans by startTime
  const sortedSpans = [...spans].sort((a, b) => a.startTime - b.startTime);

  // Calculate min start time and max end time
  const minStartTime = Math.min(...spans.map((span) => span.startTime));
  const maxEndTime = Math.max(
    ...spans.map((span) => span.startTime + span.duration)
  );
  const totalDuration = maxEndTime - minStartTime;

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const nameColumnWidth = 200;
        const containerWidth = containerRef.current.offsetWidth;
        setTimelineWidth(Math.max(containerWidth - nameColumnWidth, 400));
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Calculate position and width of span bar
  const getSpanStyle = (span: SpanProps) => {
    const startPercent =
      ((span.startTime - minStartTime) / totalDuration) * 100;
    const widthPercent = (span.duration / totalDuration) * 100;

    return {
      left: `${startPercent}%`,
      width: `${Math.max(widthPercent, 0.5)}%`,
    };
  };

  // Get color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500 hover:bg-green-600";
      case "error":
        return "bg-red-500 hover:bg-red-600";
      case "warning":
        return "bg-orange-500 hover:bg-orange-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  const formatDuration = (duration: number) => {
    if (duration < 1) {
      return `${(duration * 1000).toFixed(1)}μs`;
    }
    if (duration < 1000) {
      return `${duration.toFixed(1)}ms`;
    }
    return `${(duration / 1000).toFixed(1)}s`;
  };

  // Create time scale markers
  const timeMarkers = [0, 25, 50, 75, 100].map((percent) => {
    const time = minStartTime + (totalDuration * percent) / 100;
    return {
      percent,
      time: formatDuration(time),
    };
  });

  // Create a complete rewrite of the component with proper timelineWidth usage
  return (
    <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium">Span Timeline</h2>
      </div>

      <div className="overflow-x-auto" ref={containerRef}>
        <div className="min-w-[800px]">
          {/* Time scale */}
          <div className="flex h-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-none w-48"></div>
            <div
              className="flex-1 relative"
              style={{ width: `${timelineWidth}px` }}
            >
              {timeMarkers.map((marker) => (
                <div
                  key={`time-${marker.percent}`}
                  className="absolute top-0 text-xs text-gray-500 dark:text-gray-400"
                  style={{
                    left: `${marker.percent}%`,
                    transform: "translateX(-50%)",
                  }}
                >
                  {marker.time}
                </div>
              ))}
            </div>
          </div>

          {/* Spans */}
          {sortedSpans.map((span) => (
            <button
              key={span.id}
              className={`flex items-center h-14 w-full hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 ${
                selectedSpanId === span.id
                  ? "bg-gray-100 dark:bg-gray-800/80"
                  : ""
              }`}
              onClick={() => onSelectSpan(span.id)}
            >
              <div className="flex-none w-48 px-4 text-left">
                <div className="font-medium text-sm truncate">{span.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {span.service}
                </div>
              </div>
              <div
                className="flex-1 relative h-8"
                style={{ width: `${timelineWidth}px` }}
              >
                <div
                  className={`absolute top-1/2 -translate-y-1/2 h-5 rounded ${getStatusColor(
                    span.status
                  )}`}
                  style={getSpanStyle(span)}
                >
                  <span className="absolute text-xs whitespace-nowrap top-6 left-0">
                    {formatDuration(span.duration)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TraceTimeline;