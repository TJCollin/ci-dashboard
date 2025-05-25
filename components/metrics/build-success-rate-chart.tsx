"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// 模拟数据
const generateData = () => {
  const data = []
  const now = new Date()

  for (let i = 13; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // 生成90%到95%之间的随机成功率
    const appCiRate = 90 + Math.random() * 5
    const systemCiRate = 88 + Math.random() * 7

    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      "App CI": appCiRate.toFixed(1),
      "系统 CI": systemCiRate.toFixed(1),
    })
  }

  return data
}

export function BuildSuccessRateChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    setData(generateData())
  }, [])

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
            domain={[80, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip formatter={(value) => [`${value}%`, ""]} labelFormatter={(label) => `日期: ${label}`} />
          <Line
            type="monotone"
            dataKey="App CI"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="系统 CI"
            stroke="#06b6d4"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
