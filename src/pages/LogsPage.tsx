import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TimeRangeSelector from "../components/ui/TimeRangeSelector";
import Card, { CardContent } from "../components/ui/Card";
import { fetchLogs } from "../services/api";
import { SERVICES, LOG_LEVELS } from "../config/constants";
import LogTable from "../components/logs/LogTable";
import { RefreshCw, Search } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { useTranslation } from "react-i18next";

const LogsPage = () => {
  const [timeRange, setTimeRange] = useState("1h");
  const [service, setService] = useState("all");
  const [level, setLevel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
    const { t } = useTranslation();

  // Debounce search query to avoid too many API calls
  const debouncedSearch = useDebounce(searchQuery, 300);

  const {
    data: logs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["logs", timeRange, service, level, debouncedSearch],
    queryFn: () =>
      fetchLogs(timeRange, {
        service,
        level,
        search: debouncedSearch,
      }),
  });

  // Filter logs based on search query locally for immediate feedback
  const filteredLogs = logs.filter((log) => {
    const matchesService = service === "all" || log.service === service;
    const matchesLevel = level === "all" || log.level === level;
    const matchesSearch =
      !searchQuery ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.service.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesService && matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">{t("logs.title")}</h1>
        <div className="flex flex-wrap gap-4">
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          >
            {SERVICES.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.value === "all" ? "AllServices" : option.label)}
              </option>
            ))}
          </select>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          >
            {LOG_LEVELS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.value === "all" ? "AllLevels" : option.label)}
              </option>
            ))}
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 rounded-xl" />
            <input
              type="text"
              placeholder={"SearchLogs"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            />
          </div>
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
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
          <LogTable logs={filteredLogs} />
        )}
      </Card>
    </div>
  );
};

export default LogsPage;
