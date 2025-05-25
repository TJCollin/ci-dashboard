"use client"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BarChart3, Calendar, Clock, Server } from "lucide-react"
import Link from "next/link"
import { BuildTable } from "@/components/job-monitor/build-table"
import { Pagination } from "@/components/pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricCard } from "@/components/metric-card"
import { BuildSuccessRateChart } from "@/components/job-monitor/build-success-rate-chart"
import { BuildDurationChart } from "@/components/job-monitor/build-duration-chart"
import type Job from "@/types/job"

export default function JobDetailPage({ params }: { params: Promise<{ jobName: string }> }) {
  const { jobName } = use(params)
  const decodedJobName = decodeURIComponent(jobName)

  const [builds, setBuilds] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const [metrics, setMetrics] = useState({
    totalBuilds: 0,
    successRate: 0,
    avgDuration: 0,
    lastBuildTime: "",
  })

  // Fetch builds data
  useEffect(() => {
    const fetchBuilds = async () => {
      setIsLoading(true)
      try {
        const queryParams = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
        })

        const response = await fetch(`/api/jobs/by-name/${encodeURIComponent(decodedJobName)}/builds?${queryParams.toString()}`)
        const data = await response.json()
        console.log("data", data)

        setBuilds(data.data)
        setPagination({
          ...pagination,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        })

        // Calculate metrics
        if (data.data.length > 0) {
          const successBuilds = data.data.filter((build: Job) => build.status === "SUCCESS").length
          const successRate = (successBuilds / data.pagination.total) * 100

          const durations = data.data.map((build: Job) => build.duration_ms)
          const avgDuration = durations.reduce((a: number, b: number) => a + b, 0) / durations.length

          const lastBuild = data.data[0]
          const lastBuildTime = new Date(lastBuild.end_time).toLocaleString()

          setMetrics({
            totalBuilds: data.pagination.total,
            successRate: Number.parseFloat(successRate.toFixed(1)),
            avgDuration: avgDuration,
            lastBuildTime: lastBuildTime,
          })
        }
      } catch (error) {
        console.error("Error fetching builds:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBuilds()
  }, [decodedJobName, pagination.page, pagination.limit])

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const handlePageSizeChange = (limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }))
  }

  // 格式化持续时间
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}小时 ${minutes % 60}分钟`
    } else if (minutes > 0) {
      return `${minutes}分钟 ${seconds % 60}秒`
    } else {
      return `${seconds}秒`
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/job-monitor">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">返回</span>
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">任务详情: {decodedJobName}</h1>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="builds">
          <TabsList className="mb-6">
            <TabsTrigger value="builds">构建历史</TabsTrigger>
            <TabsTrigger value="metrics">性能指标</TabsTrigger>
          </TabsList>

          <TabsContent value="builds">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <MetricCard
                title="总构建次数"
                value={metrics.totalBuilds.toString()}
                trend=""
                trendType="neutral"
                icon={<Server className="h-4 w-4 text-muted-foreground" />}
              />
              <MetricCard
                title="成功率"
                value={`${metrics.successRate}%`}
                trend=""
                trendType="neutral"
                icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
              />
              <MetricCard
                title="平均耗时"
                value={formatDuration(metrics.avgDuration)}
                trend=""
                trendType="neutral"
                icon={<Clock className="h-4 w-4 text-muted-foreground" />}
              />
              <MetricCard
                title="最近构建时间"
                value={metrics.lastBuildTime}
                trend=""
                trendType="neutral"
                icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="mr-2 h-5 w-5 text-primary" />
                  构建历史
                </CardTitle>
                <CardDescription>任务 {decodedJobName} 的所有构建记录</CardDescription>
              </CardHeader>
              <CardContent>
                <BuildTable builds={builds} jobName={decodedJobName} isLoading={isLoading} />

                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  pageSize={pagination.limit}
                  onPageSizeChange={handlePageSizeChange}
                  totalItems={pagination.total}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics">
            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>构建成功率趋势</CardTitle>
                  <CardDescription>最近30次构建的成功率变化</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <BuildSuccessRateChart jobName={decodedJobName} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>构建耗时趋势</CardTitle>
                  <CardDescription>最近30次构建的耗时变化</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <BuildDurationChart jobName={decodedJobName} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
