
import React from 'react';
import { ChartContainer } from '../ui/chart';
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ data, height = 300 }) => {
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
        color: dataset.backgroundColor,
      }
    };
  }, {});

  return (
    <ChartContainer config={config} style={{ height: height }}>
      <RechartsBarChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.datasets.map((dataset, index) => (
          <Bar 
            key={index}
            dataKey={dataset.label}
            fill={dataset.backgroundColor}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
};
