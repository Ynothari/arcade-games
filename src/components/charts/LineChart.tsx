
import React from 'react';
import { ChartContainer } from '../ui/chart';
import { Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      borderColor: string;
      tension: number;
    }[];
  };
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({ data, height = 300 }) => {
  // Transform the data into the format Recharts expects
  const transformedData = data.labels.map((label, index) => {
    const dataPoint: Record<string, any> = { name: label };
    
    data.datasets.forEach(dataset => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    
    return dataPoint;
  });

  // Generate config based on the datasets
  const config = data.datasets.reduce((acc, dataset) => {
    return {
      ...acc,
      [dataset.label]: {
        label: dataset.label,
        color: dataset.borderColor,
      }
    };
  }, {});

  return (
    <ChartContainer config={config} style={{ height: height }}>
      <RechartsLineChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.datasets.map((dataset, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={dataset.label}
            stroke={dataset.borderColor}
            activeDot={{ r: 8 }}
            strokeWidth={2}
            dot={{ stroke: dataset.borderColor, strokeWidth: 2, fill: 'white', r: 4 }}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  );
};
