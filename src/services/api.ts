import { Metrics } from "../types";
import { mockDashboardData, mockTraceDetails } from "./mockdata";


const handleError=(error:any)=>{
    console.error('API Error', error)
    if(error .response){
        console.error('Response data',error.response.data)
           console.error("Status:", error.response.status);
    }else if(error.request){
        console.error('No response recieved')
    }else{
        console.error("Request error:", error.message);
    }
    throw error
}

export const fetchDahboardData = async (timeRange:string)=>{
    try {
        return mockDashboardData
    } catch (error) {
       return handleError(error) 
    }
}


export const fetchLogs = async (
  timeRange: string,
  filters: Record<string, string>
) => {
  try {
    // Building query params
    const params = new URLSearchParams();
    params.append("timeRange", timeRange);

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.append(key, value);
      }
    });
    return mockDashboardData(timeRange).logs;
  } catch (error) {
    return handleError(error);
  }
};

//Fetch Metrics
export const fetchMetrics=async(metricName:string,timeRange:string, filters:Record<string,string>)=>{
  try {
    // Building query params
    const params = new URLSearchParams();
    params.append("timeRange", timeRange);

     Object.entries(filters).forEach(([key, value]) => {
       if (value && value !== "all") {
         params.append(key, value);
       }
     });
    const dashboardData=mockDashboardData(timeRange)
    const metrics= dashboardData.metrics as Metrics
    return metrics[metricName] || []
  } catch (error) {
    return handleError(error)
  }
}

//fetch trace 
export const fetchTraces =async(timeRange:string, filters:Record<string, string> )=>{
  try {
    // Building query params
    const params = new URLSearchParams();
    params.append("timeRange", timeRange);

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.append(key, value);
      }
    });

    return mockDashboardData(timeRange).traces
  } catch (error) {
    return handleError(error)
  }
}

//fetch trace details
export const fetchTraceDetails =async (traceId:string)=>{
try {
  return mockTraceDetails(traceId)
} catch (error) {
  return handleError(error)
}
}