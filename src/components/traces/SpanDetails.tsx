import { AlertCircle, ChevronRight, Code, FileText, Info, List } from 'lucide-react'
import { useState } from 'react'



interface SpanMetaData{
    [key: string]:any
}
 interface Log{
    id:string
    timestamp:string
    level:string
    message:string
 }

 interface Event{
    id:string
    timestamp:string
    name:string
    attributes:Record<string, any>
 }

export interface Span{
    id:string
    parentId:string | null
    name:string
    service:string
    startTime:number
    duration:number
    status:'success' | 'error' | 'warning'
    metadata:SpanMetaData
    logs:Log[]
    events:Event[]
}

export interface SpanDetailProps{
span:Span
 }

const SpanDetails = ({span}:SpanDetailProps) => {
    const[activeTab, setActiveTab]=useState('metadata')

      const getLevelIcon = (level: string) => {
        switch (level) {
          case "error":
            return <AlertCircle className="h-4 w-4 text-error" />;
          case "warn":
            return <AlertCircle className="h-4 w-4 text-warning" />;
          case "info":
            return <Info className="h-4 w-4 text-secondary" />;
          default:
            return <Info className="h-4 w-4 text-gray-400" />;
        }
      };

  return (
    <div className="">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center ${
            activeTab === "metadata"
              ? "border-b-2 border-primary"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
          onClick={() => setActiveTab("metadata")}
        >
          <List className="h-4 w-4 mr-2" />
          Metadata
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center ${
            activeTab === "logs"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
          onClick={() => setActiveTab("logs")}
        >
          <FileText className="h-4 w-4 mr-2" />
          Logs
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center ${
            activeTab === "events"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
          onClick={() => setActiveTab("events")}
        >
          <Code className="h-4 w-4 mr-2" />
          Events
        </button>
      </div>
      <div className="mt-4">
        {activeTab === "metadata" && (
          <div className="space-y-2">
            {/* Basic span info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Span ID
                </p>
                <p className="text-sm font-mono mt-1">{span.id}</p>
              </div>
              {span.parentId && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Parent ID
                  </p>
                  <p className="text-sm font-mono mt-1">{span.parentId}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Service
                </p>
                <p className="text-sm font-medium mt-1">{span.service}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Duration
                </p>
                <p className="text-sm font-medium mt-1">
                  {span.duration.toFixed(2)}ms
                </p>
              </div>
            </div>

            {/* Metadata table */}
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-md">
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-sm font-medium">
                Span Attributes
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {Object.entries(span.metadata).map(([key, value]) => (
                  <div key={key} className="px-4 py-2 flex">
                    <div className="w-1/3 text-sm text-gray-500 dark:text-gray-400">
                      {key}
                    </div>
                    <div className="w-2/3 text-sm">
                      {typeof value === "object" ? (
                        <pre className="text-xs font-mono whitespace-pre-wrap">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      ) : (
                        String(value)
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div>
            {span.logs.length === 0 ? (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                No logs found for this span
              </div>
            ) : (
              <div className="space-y-2">
                {span.logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-md border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start">
                      <div className="mt-0.5 mr-2">
                        {getLevelIcon(log.level)}
                      </div>
                      <div>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                          <ChevronRight className="h-3 w-3 mx-1" />
                          <span className="font-medium uppercase">
                            {log.level}
                          </span>
                        </div>
                        <p className="text-sm font-mono">{log.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "events" && (
          <div>
            {span.events.length === 0 ? (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                No events found for this span
              </div>
            ) : (
              <div className="space-y-4">
                {span.events.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 rounded-md border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center mb-2">
                      <Code className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-medium">{event.name}</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                    {Object.keys(event.attributes).length > 0 && (
                      <div className="mt-2 text-sm font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(event.attributes, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SpanDetails
