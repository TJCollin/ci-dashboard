"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// 模拟数据
const generateData = () => {
  const data = []
  const now = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // 生成随机资源使用率数据
    const cpuUsage = 40 + Math.random() * 40
    const memoryUsage = 35 + Math.random() * 45
    const diskUsage = 30 + Math.random() * 30
    const nodeCount = 40 + Math.floor(Math.random() * 6)

    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      CPU: cpuUsage.toFixed(1),
      内存: memoryUsage.toFixed(1),
      磁盘: diskUsage.toFixed(1),
      节点数: nodeCount,
    })
  }

  return data
}

export function ResourceUsageHistory() {
  const [data, setData] = useState([])

  useEffect(() => {
    setData(generateData())
  }, [])

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" label={{ value: "使用率 (%)", angle: -90, position: "insideLeft" }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: "节点数", angle: 90, position: "insideRight" }} />
          <Tooltip />
          <Legend />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="CPU"
            stroke="#f43f5e"
            fill="#f43f5e"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="内存"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="磁盘"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="节点数"
            stroke="#0ea5e9"
            fill="#0ea5e9"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
