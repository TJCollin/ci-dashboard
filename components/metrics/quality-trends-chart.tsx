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

    // 生成随机代码质量指标
    const codeQuality = 80 + Math.random() * 15
    const testCoverage = 75 + Math.random() * 20
    const bugDensity = 2 + Math.random() * 3

    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      代码质量: codeQuality.toFixed(1),
      测试覆盖率: testCoverage.toFixed(1),
      缺陷密度: bugDensity.toFixed(2),
    })
  }

  return data
}

export function QualityTrendsChart() {
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
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} yAxisId="left" />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} yAxisId="right" orientation="right" />
          <Tooltip />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="代码质量"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="测试覆盖率"
            stroke="#06b6d4"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="缺陷密度"
            stroke="#f43f5e"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
