"use client"

import { useEffect, useState } from "react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

// 模拟数据
const generateProjectData = () => [
  { name: "android-app-main", value: 35 },
  { name: "system-core-module", value: 25 },
  { name: "ui-components", value: 15 },
  { name: "network-service", value: 10 },
  { name: "media-player", value: 8 },
  { name: "其他项目", value: 7 },
]

const generateTeamData = () => [
  { name: "团队A", value: 30 },
  { name: "团队B", value: 25 },
  { name: "团队C", value: 20 },
  { name: "团队D", value: 15 },
  { name: "团队E", value: 10 },
]

const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

interface ResourceAllocationChartProps {
  type: "project" | "team"
}

export function ResourceAllocationChart({ type }: ResourceAllocationChartProps) {
  const [data, setData] = useState([])

  useEffect(() => {
    setData(type === "project" ? generateProjectData() : generateTeamData())
  }, [type])

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
