"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle2, Clock, ExternalLink, PlayCircle, RefreshCw, XCircle } from "lucide-react"
import Link from "next/link"
import { StageIssuesCard } from "@/components/job-monitor/stage-issues-card"
import type { Stage } from "@/types/job"

export default function StageDetailPage({
  params,
}: {
  params: {
    jobName: string
    buildNum: string
    stageName: string
  }
}) {
  const { jobName, buildNum, stageName } = params
  const decodedJobName = decodeURIComponent(jobName)
  const decodedStageName = decodeURIComponent(stageName)

  const [stage, setStage] = useState<Stage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch stage data
  useEffect(() => {
    const fetchStage = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `/api/jobs/by-name/${encodeURIComponent(decodedJobName)}/builds/${buildNum}/stages/${encodeURIComponent(decodedStageName)}`,
        )

        if (!response.ok) {
          throw new Error(`Error fetching stage: ${response.statusText}`)
        }

        const data = await response.json()
        setStage(data)
      } catch (error) {
        console.error("Error fetching stage:", error)
        setError(error instanceof Error ? error.message : "Unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStage()
  }, [decodedJobName, buildNum, decodedStageName])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/job-monitor/${encodeURIComponent(jobName)}/${buildNum}`}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">返回</span>
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">阶段详情: {decodedStageName}</h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">加载中...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !stage) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/job-monitor/${encodeURIComponent(jobName)}/${buildNum}`}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">返回</span>
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">阶段详情</h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">出错了</h3>
              <p className="text-muted-foreground mb-4">{error || "无法加载阶段详情"}</p>
              <Button asChild>
                <Link href={`/job-monitor/${encodeURIComponent(jobName)}/${buildNum}`}>返回构建详情</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // 格式化日期
  const formatDate = (date: Date) => {
    try {
      return new Date(date).toLocaleString()
    } catch (error) {
      return "未知时间"
    }
  }

  // 格式化持续时间
  const calculateDuration = (start: Date, end: Date): string => {
    try {
      const startDate = new Date(start)
      const endDate = new Date(end)
      const durationMs = endDate.getTime() - startDate.getTime()

      const seconds = Math.floor(durationMs / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)

      if (hours > 0) {
        return `${hours}小时 ${minutes % 60}分钟`
      } else if (minutes > 0) {
        return `${minutes}分钟 ${seconds % 60}秒`
      } else {
        return `${seconds}秒`
      }
    } catch (error) {
      console.error("Error calculating duration:", error)
      return "未知"
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/job-monitor/${encodeURIComponent(jobName)}/${buildNum}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">返回</span>
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">阶段详情: {decodedStageName}</h1>
        </div>
        <div className="flex items-center gap-2">
          {stage.logs_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={stage.logs_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                查看日志
              </a>
            </Button>
          )}
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        {/* 阶段信息卡片 */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>{stage.name}</CardTitle>
                  {stage.status === "SUCCESS" && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      成功
                    </Badge>
                  )}
                  {stage.status === "FAILURE" && (
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                      <XCircle className="mr-1 h-3 w-3" />
                      失败
                    </Badge>
                  )}
                  {stage.status === "RUNNING" && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      <PlayCircle className="mr-1 h-3 w-3" />
                      运行中
                    </Badge>
                  )}
                  {stage.status === "PENDING" && (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                      <Clock className="mr-1 h-3 w-3" />
                      等待中
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-1">
                  任务: {decodedJobName} · 构建号: #{buildNum}
                </CardDescription>
              </div>
              {stage.issues_found && stage.issues_found > 0 && (
                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                  发现 {stage.issues_found} 个问题
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="text-sm font-medium">开始时间</div>
                  <div className="text-sm text-muted-foreground">{formatDate(stage.start_time)}</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-sm font-medium">结束时间</div>
                  <div className="text-sm text-muted-foreground">
                    {stage.end_time ? formatDate(stage.end_time) : "未结束"}
                  </div>
                </div>
                {stage.start_time && stage.end_time && (
                  <div className="flex items-start gap-2">
                    <div className="text-sm font-medium">持续时间</div>
                    <div className="text-sm text-muted-foreground">
                      {calculateDuration(stage.start_time, stage.end_time)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 阶段日志 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>阶段日志</CardTitle>
            <CardDescription>阶段执行过程中的详细日志</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-white p-4 rounded-md font-mono text-sm overflow-auto max-h-[400px]">
              {generateMockLogs(stage.name, stage.status).map((log, index) => (
                <div key={index} className="whitespace-pre-wrap mb-1">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 问题详情 */}
        {stage.issues && stage.issues.length > 0 && <StageIssuesCard issues={stage.issues} />}
      </main>
    </div>
  )
}

// 生成模拟日志
function generateMockLogs(stageName: string, status: string): string[] {
  const commonLogs = [
    `[10:15:32] 开始执行 ${stageName} 阶段...`,
    "[10:15:33] 正在初始化环境...",
    "[10:15:40] 正在准备依赖...",
    "[10:16:15] 依赖准备完成",
  ]

  if (status === "SUCCESS") {
    return [
      ...commonLogs,
      `[10:16:20] 开始执行 ${stageName} 任务...`,
      "[10:18:45] 任务执行完成",
      "[10:18:50] 生成执行报告...",
      "[10:19:10] 验证执行结果...",
      "[10:19:30] 阶段执行成功",
    ]
  } else if (status === "FAILURE") {
    return [
      ...commonLogs,
      `[10:16:20] 开始执行 ${stageName} 任务...`,
      "[10:17:15] 警告: 发现潜在问题",
      "[10:18:30] 错误: 执行失败",
      "[10:18:35] 错误详情: 无法完成任务执行",
      "[10:18:40] 正在收集错误信息...",
      "[10:18:45] 阶段执行失败",
    ]
  } else {
    return [
      ...commonLogs,
      `[10:16:20] 开始执行 ${stageName} 任务...`,
      "[10:16:50] 任务正在执行中...",
      "[10:17:20] 任务继续执行中...",
      "[10:17:50] 等待任务完成...",
    ]
  }
}
