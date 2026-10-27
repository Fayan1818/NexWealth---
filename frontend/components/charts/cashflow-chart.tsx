"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useTheme } from "@/components/theme/theme-provider";

interface CashflowChartProps {
  data?: Array<{ month: string; income: number; expense?: number; expenses?: number }>;
}

const defaultData = [
  { month: "May", income: 210000, expense: 78000 },
  { month: "Jun", income: 225000, expense: 84000 },
  { month: "Jul", income: 215000, expense: 91000 },
  { month: "Aug", income: 240000, expense: 88000 },
  { month: "Sep", income: 260000, expense: 95000 },
  { month: "Oct", income: 280500, expense: 72800 },
];

export const CashflowChart: React.FC<CashflowChartProps> = ({ data = defaultData }) => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const chartData = (data && data.length > 0 ? data : defaultData).map((d) => ({
    month: d.month,
    income: Number(d.income) || 0,
    expense: Number(d.expense !== undefined ? d.expense : d.expenses) || 0,
  }));

  const gridStroke = isLight ? "#cbd5e1" : "rgba(255,255,255,0.08)";
  const axisStroke = isLight ? "#475569" : "#94a3b8";
  const incomeStroke = isLight ? "#0284c7" : "#00f2fe";
  const expenseStroke = isLight ? "#059669" : "#00f5a0";

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={incomeStroke} stopOpacity={isLight ? 0.45 : 0.35} />
              <stop offset="95%" stopColor={incomeStroke} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={expenseStroke} stopOpacity={isLight ? 0.35 : 0.25} />
              <stop offset="95%" stopColor={expenseStroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
          <XAxis dataKey="month" stroke={axisStroke} fontSize={11} tickLine={false} />
          <YAxis
            stroke={axisStroke}
            fontSize={11}
            tickLine={false}
            tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
          />
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
          <Area
            type="monotone"
            dataKey="income"
            name="Income"
            stroke={incomeStroke}
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#incomeGlow)"
          />
          <Area
            type="monotone"
            dataKey="expense"
            name="Expense"
            stroke={expenseStroke}
            strokeWidth={2.2}
            fillOpacity={1}
            fill="url(#expenseGlow)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
