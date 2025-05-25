"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// 模拟数据
const generateData = () => {
  const data = []
  const now = new Date()

  for (let i = 13; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // 生成10-20分钟之间的随机构建时长
    const appCiDuration = 10 + Math.random() * 10
    const systemCiDuration = 20 + Math.random() * 15

    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      "App CI": appCiDuration.toFixed(1),
      "系统 CI": systemCiDuration.toFixed(1),
    })
  }

  return data
}

export function BuildDurationChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    setData(generateData())
  }, [])

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
            tickFormatter={(value) => `${value}分钟`}
          />
          <Tooltip formatter={(value) => [`${value}分钟`, ""]} labelFormatter={(label) => `日期: ${label}`} />
          <Bar dataKey="App CI" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={6} />
          <Bar dataKey="系统 CI" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={6} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
