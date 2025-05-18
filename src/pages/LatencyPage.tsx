import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { fetchMetrics } from "../services/api"
import { SERVICES } from "../config/constants"
import Card, { CardContent, CardHeader } from "../components/ui/Card"
import MetricsChart from "../components/metrics/MetricsChart"
import TimeRangeSelector from "../components/ui/TimeRangeSelector"


const LatencyPage = () => {
    const[timeRange,setTimeRange]=useState('1h')
    const[service, setService]=useState('all')
    const {t}=useTranslation()
    const{data:latencyData =[],isLoading}=useQuery({
        queryKey:['metrics','latency', timeRange, service],
        queryFn:()=>fetchMetrics('latency',timeRange,{service})
    })
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{t("latency.title")}</h1>
        <div className="flex gap-4">
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          >
            {SERVICES.map((option)=>(
                <option key={option.value} value={option.value}>
                    {t(option.value ==='all'?
                        'logs.allServices':option.label
                    )}
                </option>
            ))}
          </select>
          <TimeRangeSelector value={timeRange} onChange={setTimeRange}/>
        </div>
      </div>
      <Card>
        <CardHeader>
            {t('latency.responseTime')}
        </CardHeader>
        <CardContent className="h-96">
{isLoading ?(
                <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
):(
    <MetricsChart
    data={latencyData}
    label={t('metrics.latency')}
    dataKey="value"
    stroke="#10b981"
    />
)}
        </CardContent>
      </Card>
    </div>
  );
}

export default LatencyPage
