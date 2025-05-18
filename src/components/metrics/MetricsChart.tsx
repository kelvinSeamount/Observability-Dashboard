import { format } from "date-fns";
import { CartesianGrid,Legend, Line, LineChart, ResponsiveContainer,Tooltip, XAxis, YAxis,} from "recharts";

interface MetricsChartProps {
    data: Array<{
        timestamp: string;
        value: number;
        [key: string]: any;
    }>;
    dataKey: string;
    stroke?: string;
    label: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
  }>;
  label?: string;
}

 const formatXAxis = (timeStamp: string) => {
   return format(new Date(timeStamp), "HH:mm");
 };
    
     const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
       if (active && payload?.length) {
         return (
           <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-md">
             <p className="text-xs text-gray-500 dark:text-gray-400">
               {label && format(new Date(label), "MMM dd, yyyy HH:mm:ss")}
             </p>
             <p className="text-sm font-medium">
               {`${payload[0]?.value.toFixed(2)} ${payload[0].name}`}
             </p>
           </div>
         );
       }
       return null;
     };

const MetricsChart = ({ data, dataKey, label, stroke }: MetricsChartProps) => {
   

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                <XAxis dataKey='timestamp' tickFormatter={formatXAxis} stroke='#9ca3af' fontSize={12} />
                <YAxis stroke='#9ca3af' fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                    type='monotone'
                    dataKey={dataKey}
                    stroke={stroke}
                    name={label}
                    strokeWidth={2}
                    activeDot={{r:6}}
                    dot={false}
                    animationDuration={300}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default MetricsChart
