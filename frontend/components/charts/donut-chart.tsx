"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useTheme } from "@/components/theme/theme-provider";
import { PieChart as PieIcon } from "lucide-react";

interface DonutChartProps {
  data?: Array<{ name: string; value: number }>;
}

const defaultData = [
  { name: "Food", value: 13000 },
  { name: "Bills", value: 14500 },
  { name: "Shopping", value: 18900 },
  { name: "Transport", value: 3400 },
  { name: "Travel", value: 15400 },
  { name: "Education", value: 6500 },
];

const COLORS = [
  "#00f2fe", // Cyan
  "#00f5a0", // Mint
  "#38bdf8", // Sky
  "#fbbf24", // Amber
  "#a855f7", // Purple
  "#f87171", // Rose
  "#ec4899", // Pink
  "#6366f1", // Indigo
];

export const DonutChart: React.FC<DonutChartProps> = ({ data = defaultData }) => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const chartData = (data && data.length > 0 ? data : defaultData).filter((d) => d.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="w-full h-56 flex flex-col items-center justify-center text-slate-400 text-xs">
        <PieIcon className="w-8 h-8 text-slate-500 mb-2 opacity-50" />
        <span>No expense categories recorded yet.</span>
      </div>
    );
  }

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            stroke={isLight ? "#ffffff" : "#0c1824"}
            strokeWidth={2}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: isLight ? "#ffffff" : "#0c1824",
              borderColor: isLight ? "#0284c7" : "rgba(0,242,254,0.4)",
              borderRadius: "8px",
              color: isLight ? "#0f172a" : "#ffffff",
              fontSize: "12px",
              boxShadow: isLight
                ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                : "none",
            }}
            formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, ""]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
