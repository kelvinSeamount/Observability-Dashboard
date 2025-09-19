import { Route, Routes } from "react-router-dom"
import Layout from "./components/layout/Layout"
import LogsPage from "./pages/LogsPage";
import MetricsPage from "./pages/MetricsPage";
import Erropage from "./pages/Erropage";
import LatencyPage from "./pages/LatencyPage";
import TracePage from "./pages/TracePage";
import NotFound from "./pages/NotFound";
import TraceDetail from "./pages/TraceDetail";
import ServicesPage from "./pages/ServicePage";
import Dashboard from "./pages/Dashboard";


const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Routes>
        <Route path="/Observability-Dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="logs" element={<LogsPage />} />
          <Route path="metrics" element={<MetricsPage />} />
          <Route path="errors" element={<Erropage />} />
          <Route path="latency" element={<LatencyPage />} />
          <Route path="traces" element={<TracePage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="traces/:traceId" element={<TraceDetail />} />
          <Route path="services/:serviceId" element={<ServicesPage />} />
          <Route path="services" element={<ServicesPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App
