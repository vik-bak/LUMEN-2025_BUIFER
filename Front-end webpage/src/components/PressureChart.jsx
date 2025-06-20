import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const PressureChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-700 transition-all">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-200">
        Smoke (ppm) - Multiple Sensors
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid stroke="var(--grid-color)" strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            stroke="var(--axis-color)"
            tick={{ fill: "var(--label-color)" }}
          />
          <YAxis
            stroke="var(--axis-color)"
            tick={{ fill: "var(--label-color)" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--tooltip-bg)",
              borderColor: "var(--tooltip-border)",
              color: "var(--label-color)",
            }}
          />
          <Legend wrapperStyle={{ color: "var(--label-color)" }} />

          <Line
            type="monotone"
            dataKey="CO"
            stroke="#8884d8"
            strokeWidth={2}
            name="CO"
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Smoke"
            stroke="#82ca9d"
            strokeWidth={2}
            name="Smoke"
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="LPG"
            stroke="#ff7300"
            strokeWidth={2}
            name="LPG"
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PressureChart;
