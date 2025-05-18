import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { fetchMetrics } from "../services/api"
import { SERVICES } from "../config/constants"
import TimeRangeSelector from "../components/ui/TimeRangeSelector"
import Card, { CardContent, CardHeader } from "../components/ui/Card"
import MetricsChart from "../components/metrics/MetricsChart"


const Erropage = () => {
    const [timeRange,setTimeRange]=useState('1h')
    const[service,setService]=useState('all')
    const{t}=useTranslation()
    const {data:errorRateData =[],isLoading:errorRateLoading}=useQuery({
        queryKey:['metrics','errorRate', timeRange,service],
        queryFn:()=> fetchMetrics('errorRate',timeRange,{service})
    })
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">{t('error.title')}</h1>
        <div className="flex gap-4">
            <select className="rounded-md border border-b-gray-300 dark:border-b-gray-700 bg-white  dark:bg-gray-800 px-3 py-2 text-sm"
            value={service}
            onChange={(e)=>setService(e.target.value)}
            >
                {SERVICES.map((option)=>(
                    <option key={option.value} value={option.value}>{t(option.value ==='all'? 'logs.allServices':option.label)}</option>
                ))}
            </select>
            <TimeRangeSelector value={timeRange} onChange={setTimeRange}/>
        </div>
      </div>
      <Card>
        <CardHeader>{t('errors.errorRateTime')}</CardHeader>
        <CardContent className="h-96">
            {errorRateLoading ?(
                <div className="flex items-center justify-center h-full">
                    <div className="border-b-2 animate-spin rounded-full h-8 w-8 border-primary"></div>
                </div>
            ):(
                <MetricsChart
                data={errorRateData}
                dataKey='value'
                label={t('metrics.errorRate')}
                stroke="#ef4444"
                />
            )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Erropage
