"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// 模拟数据
const generateData = () => {
  const teams = ["团队A", "团队B", "团队C", "团队D", "团队E"]

  return teams.map((team) => {
    // 生成随机数据
    const commits = Math.floor(50 + Math.random() * 150)
    const builds = Math.floor(30 + Math.random() * 100)
    const merges = Math.floor(20 + Math.random() * 80)

    return {
      name: team,
      提交数: commits,
      构建数: builds,
      合入数: merges,
    }
  })
}

export function TeamPerformanceChart() {
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
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="提交数" stackId="a" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          <Bar dataKey="构建数" stackId="a" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          <Bar dataKey="合入数" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
