"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// 模拟数据
const generateData = () => {
  const data = []
  const now = new Date()

  for (let i = 13; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // 生成随机资源使用率数据
    const cpuUsage = 40 + Math.random() * 40
    const memoryUsage = 35 + Math.random() * 45
    const diskUsage = 30 + Math.random() * 30

    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      CPU: cpuUsage.toFixed(1),
      内存: memoryUsage.toFixed(1),
      磁盘: diskUsage.toFixed(1),
    })
  }

  return data
}

export function ResourceUsageChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    setData(generateData())
  }, [])

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip formatter={(value) => [`${value}%`, ""]} labelFormatter={(label) => `日期: ${label}`} />
          <Area type="monotone" dataKey="CPU" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} strokeWidth={2} />
          <Area type="monotone" dataKey="内存" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
          <Area type="monotone" dataKey="磁盘" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
