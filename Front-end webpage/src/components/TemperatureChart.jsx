import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TemperatureChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-700 transition-all">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-200">
        Temperature (°C)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {/* Grid lines - lighter in light mode, darker in dark mode */}
          <CartesianGrid stroke="var(--grid-color)" strokeDasharray="3 3" />
          
          {/* X and Y Axis styling */}
          <XAxis
            dataKey="time"
            stroke="var(--axis-color)"
            tick={{ fill: "var(--label-color)" }}
          />
          <YAxis
            stroke="var(--axis-color)"
            tick={{ fill: "var(--label-color)" }}
          />
          
          {/* Custom Tooltip with Dark Mode Styling */}
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--tooltip-bg)",
              borderColor: "var(--tooltip-border)",
              color: "var(--label-color)",
            }}
          />
          
          {/* Legend styling */}
          <Legend wrapperStyle={{ color: "var(--label-color)" }} />
          
          {/* Temperature Line */}
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#ffc658" // Warm orange for visibility
            strokeWidth={1}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;