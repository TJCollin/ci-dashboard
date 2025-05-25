"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// 模拟数据
const generateData = () => [
  {
    name: "构建制品",
    total: 8000,
    used: 6800,
    usedPercentage: 85,
  },
  {
    name: "源代码",
    total: 5000,
    used: 3250,
    usedPercentage: 65,
  },
  {
    name: "测试数据",
    total: 4000,
    used: 1800,
    usedPercentage: 45,
  },
  {
    name: "备份",
    total: 6000,
    used: 1200,
    usedPercentage: 20,
  },
  {
    name: "日志",
    total: 1000,
    used: 700,
    usedPercentage: 70,
  },
]

export function StorageUsageChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    setData(generateData())
  }, [])

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis type="number" tickFormatter={(value) => `${value}%`} />
          <YAxis type="category" dataKey="name" width={80} />
          <Tooltip
            formatter={(value, name, props) => {
              if (name === "usedPercentage") {
                return [`${value}%`, "使用率"]
              }
              return [value, name]
            }}
            labelFormatter={(label) => `${label}`}
          />
          <Bar dataKey="usedPercentage" barSize={20} radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.usedPercentage > 80 ? "#ef4444" : entry.usedPercentage > 60 ? "#f59e0b" : "#10b981"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2 text-sm">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span>{item.name}</span>
            <span>
              {item.used} GB / {item.total} GB
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
