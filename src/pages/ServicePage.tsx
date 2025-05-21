import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ServiceList from "../components/services/ServiceList";
import ServiceMetrics from "../components/services/ServiceMetrics";
import ServiceDependencies from "../components/services/ServiceDependencies";
import ServiceTraces from "../components/services/ServiceTraces";
import { useQuery } from "@tanstack/react-query";
import {
  fetchServiceMetrics,
  fetchServiceDependencies,
  fetchServiceTraces,
} from "../services/api";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import type { Service, Dependency, Trace, TraceStatus} from "../types";

const ServicesPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState("1h");

  const services: Service[] = [
    {
      id: "api-gateway",
      name: "API Gateway",
      tags: ["gateway", "public"],
      health: "healthy",
      errorRate: 0.5,
      latency: 45,
    },
    {
      id: "user-service",
      name: "User Service",
      tags: ["core", "auth"],
      health: "healthy",
      errorRate: 0.2,
      latency: 120,
    },
    {
      id: "product-service",
      name: "Product Service",
      tags: ["core", "catalog"],
      health: "warning",
      errorRate: 2.5,
      latency: 180,
    },
    {
      id: "payment-service",
      name: "Payment Service",
      tags: ["core", "financial"],
      health: "error",
      errorRate: 5.0,
      latency: 250,
    },
  ];

  const dependencies: Dependency[] = [
    {
      source: "api-gateway",
      target: "user-service",
      type: "http",
      latency: 45,
      errorRate: 0.5,
    },
    {
      source: "api-gateway",
      target: "product-service",
      type: "http",
      latency: 65,
      errorRate: 1.2,
    },
    {
      source: "product-service",
      target: "payment-service",
      type: "grpc",
      latency: 120,
      errorRate: 2.5,
    },
    {
      source: "payment-service",
      target: "notification-service",
      type: "kafka",
      latency: 250,
      errorRate: 0.8,
    },
  ];

  // Fetch service-specific data
  const { data: metrics } = useQuery({
    queryKey: ["service-metrics", serviceId, timeRange],
    queryFn: () => fetchServiceMetrics(serviceId as string, timeRange),
    enabled: !!serviceId,
  });

  const { data: serviceDependencies } = useQuery({
    queryKey: ["service-dependencies", serviceId],
    queryFn: () => fetchServiceDependencies(serviceId as string),
    enabled: !!serviceId,
  });

  const { data: tracesData } = useQuery({
    queryKey: ["service-traces", serviceId],
    queryFn: () => fetchServiceTraces(serviceId as string),
    enabled: !!serviceId,
  });
  
   const traces: Trace[] | undefined = tracesData?.map((trace: any) => ({
     ...trace,
     status: validateTraceStatus(trace.status),
   }));

     function validateTraceStatus(status: string): TraceStatus {
       if (status === "success" || status === "error" || status === "warning") {
         return status as TraceStatus;
       }
       return "warning";
     }


  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-80 border-r border-gray-200 dark:border-gray-700">
        <ServiceList services={services} selectedServiceId={serviceId} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        {serviceId ? (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <Tabs defaultValue="metrics" className="w-full">
                <TabsList className="w-full justify-start mb-4">
                  <TabsTrigger value="metrics">
                    {t("services.metrics")}
                  </TabsTrigger>
                  <TabsTrigger value="dependencies">
                    {t("services.dependencies")}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="metrics">
                  {metrics && (
                    <ServiceMetrics
                      serviceId={serviceId}
                      metrics={metrics}
                      timeRange={timeRange}
                      onTimeRangeChange={setTimeRange}
                    />
                  )}
                </TabsContent>
                <TabsContent value="dependencies">
                  {serviceDependencies && (
                    <div>
                      <h2 className="text-lg font-semibold mb-4">
                        {t("services.serviceDependencies")}
                      </h2>
                      <ServiceDependencies
                        services={services}
                        dependencies={dependencies}
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            <div className="h-1/2 border-t border-gray-200 dark:border-gray-700 overflow-y-auto">
              {traces && <ServiceTraces traces={traces} />}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            {t("services.selectService")}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
