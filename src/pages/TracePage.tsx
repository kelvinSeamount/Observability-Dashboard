import {  useState } from "react"
import { useTranslation } from "react-i18next"
import { useDebounce } from "../hooks/useDebounce"
import { useQuery } from "@tanstack/react-query"
import { fetchTraces } from "../services/api"
import { SERVICES } from "../config/constants"
import { Search } from "lucide-react"
import TimeRangeSelector from "../components/ui/TimeRangeSelector"
import Card, { CardContent } from "../components/ui/Card"
import SpanList, {SpanProps } from "../components/traces/SpanList"


const TracePage = () => {
    const[timeRange, setTimeRange]=useState('1h')
    const[service, setService]=useState('all')
    const [searchQuery, setSearchQuery]=useState('')
     const [status, setStatus] = useState("all");
     const { t } = useTranslation();

     const debouncedSearch = useDebounce(searchQuery, 300);
      const {data:traces =[] , isLoading}=useQuery({
        queryKey:['traces', timeRange, service, status,debouncedSearch],
        queryFn:()=> fetchTraces(timeRange,{
            status,service,search:debouncedSearch
        })
      })

      const filteredTraces= traces.filter(trace =>{
        const matchesService =service === 'all' || trace.service === service
        const matchesStatus = status === 'all' || trace.status === status
        const matchesSearch = !searchQuery || trace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trace.service.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch && matchesService && matchesStatus
      })


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">{t("traces.title")}</h1>
        <div className="flex flex-wrap gap-4">
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          >
            {SERVICES.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.value === "all" ? "allServices" : option.label)}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          >
            <option value="all">{t("traces.allStatus")}</option>
            <option value="success">{t("traces.success")}</option>
            <option value="warning">{t("traces.warning")}</option>
            <option value="error">{t("traces.error")}</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t("traces.searchTraces")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            />
          </div>
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        </div>
      </div>
      <Card>
        {isLoading ? (
          <CardContent>
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        ) : (
          <SpanList spans={filteredTraces as SpanProps[]} />
        )}
      </Card>
    </div>
  );
}

export default TracePage
