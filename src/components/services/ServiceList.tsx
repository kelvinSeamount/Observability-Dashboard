import { Search } from 'lucide-react'
import  { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Service{
    id:string
    name:string
    tags:string[]
    health: 'healthy' | 'warning' | 'error'
    errorRate:number
    latency:number
}

interface ServiceListProps{
    services:Service[]
    selectedServiceId?: string
}
const ServiceList = ({services,selectedServiceId}:ServiceListProps) => {
    const[ searchQuery, setSearchQuery]=useState('')
    const navigate =useNavigate()

    const filteredServices= services.filter(service => 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )

     const getHealthColor = (health: Service["health"]) => {
       switch (health) {
         case "healthy":
           return "bg-success";
         case "warning":
           return "bg-warning";
         case "error":
           return "bg-error";
         default:
           return "bg-gray-400";
       }
     };
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredServices.map((service) => (
          <button
            key={service.id}
            onClick={() => navigate(`/services/${service.id}`)}
            className={`w-full p-4 text-left border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
              selectedServiceId === service.id
                ? "bg-gray-100 dark:bg-gray-800"
                : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${getHealthColor(
                    service.health
                  )}`}
                />
                <h3 className="font-medium">{service.name}</h3>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {service.errorRate.toFixed(2)}% errors
              </div>
            </div>

            <div className="mt-2 flex items-center space-x-2">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Avg. Latency: {service.latency}ms
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ServiceList
