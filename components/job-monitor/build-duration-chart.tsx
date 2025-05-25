"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface BuildDurationChartProps {
  jobName: string
}

export function BuildDurationChart({ jobName }: BuildDurationChartProps) {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // 在实际应用中，这里应该调用API获取数据
        // const response = await fetch(`/api/jobs/${encodeURIComponent(jobName)}/metrics/duration`);
        // const result = await response.json();
        // setData(result.data);

        // 模拟数据
        const mockData = generateMockData(jobName)
        setData(mockData)
      } catch (error) {
        console.error("Error fetching duration data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [jobName])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  return (
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
        <XAxis
          dataKey="buildNum"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          label={{ value: "构建号", position: "insideBottomRight", offset: -5 }}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}分钟`}
          label={{ value: "耗时", angle: -90, position: "insideLeft" }}
        />
        <Tooltip formatter={(value) => [`${value}分钟`, "耗时"]} labelFormatter={(label) => `构建 #${label}`} />
        <Bar dataKey="duration" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// 生成模拟数据
function generateMockData(jobName: string) {
  const data = []
  const buildCount = 30

  // 使用jobName作为随机种子，确保相同jobName生成相同的图表
  const seed = jobName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

  for (let i = 0; i < buildCount; i++) {
    // 使用伪随机数生成器，基于种子和索引
    const pseudoRandom = Math.sin(seed + i) * 10000 - Math.floor(Math.sin(seed + i) * 10000)

    // 生成10-30分钟之间的随机耗时，但有一定概率出现较高值
    let duration
    if (pseudoRandom < 0.1) {
      // 10%的概率出现30-60分钟之间的值
      duration = 30 + pseudoRandom * 300
    } else {
      // 90%的概率出现10-30分钟之间的值
      duration = 10 + pseudoRandom * 20
    }

    data.push({
      buildNum: buildCount - i,
      duration: Number.parseFloat(duration.toFixed(1)),
    })
  }

  // 反转数组，使构建号从小到大排列
  return data.reverse()
}
