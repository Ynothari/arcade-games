
import React from 'react';
import { ChartContainer } from '../ui/chart';
import { Pie, PieChart as RechartsPieChart, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PieChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  };
  height?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, height = 300 }) => {
  // Transform the data into the format Recharts expects
  const transformedData = data.labels.map((label, index) => {
    return {
      name: label,
      value: data.datasets[0].data[index],
      color: data.datasets[0].backgroundColor[index]
    };
  });

  // Generate config based on the datasets
  const config = data.labels.reduce((acc, label, index) => {
    return {
      ...acc,
      [label]: {
        label: label,
        color: data.datasets[0].backgroundColor[index],
      }
    };
  }, {});

  return (
    <ChartContainer config={config} style={{ height: height }}>
      <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <Pie
          data={transformedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {transformedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ChartContainer>
  );
};
