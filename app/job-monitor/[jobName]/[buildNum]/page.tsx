"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  GitPullRequest,
  PlayCircle,
  RefreshCw,
  Server,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { BuildStagesTimeline } from "@/components/job-monitor/build-stages-timeline"
import { RelatedChangesCard } from "@/components/job-monitor/related-changes-card"
import { BuildArtifactsCard } from "@/components/job-monitor/build-artifacts-card"
import type Job from "@/types/job"

export default function BuildDetailPage({ params }: { params: { jobName: string; buildNum: string } }) {
  const { jobName, buildNum } = params
  const decodedJobName = decodeURIComponent(jobName)

  const [build, setBuild] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch build data
  useEffect(() => {
    const fetchBuild = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/jobs/by-name/${encodeURIComponent(decodedJobName)}/builds/${buildNum}`)

        if (!response.ok) {
          throw new Error(`Error fetching build: ${response.statusText}`)
        }

        const data = await response.json()
        setBuild(data)
      } catch (error) {
        console.error("Error fetching build:", error)
        setError(error instanceof Error ? error.message : "Unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBuild()
  }, [decodedJobName, buildNum])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/job-monitor/${encodeURIComponent(jobName)}`}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">返回</span>
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">
              构建详情: {decodedJobName} #{buildNum}
            </h1>
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

  if (error || !build) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/job-monitor/${encodeURIComponent(jobName)}`}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">返回</span>
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">构建详情</h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">出错了</h3>
              <p className="text-muted-foreground mb-4">{error || "无法加载构建详情"}</p>
              <Button asChild>
                <Link href={`/job-monitor/${encodeURIComponent(jobName)}`}>返回任务详情</Link>
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
            <Link href={`/job-monitor/${encodeURIComponent(jobName)}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">返回</span>
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">
            构建详情: {decodedJobName} #{buildNum}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {build.job_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={build.job_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />在 Jenkins 中查看
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
        {/* 构建信息卡片 */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>构建 #{build.build_num}</CardTitle>
                  {build.status === "SUCCESS" && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      成功
                    </Badge>
                  )}
                  {build.status === "FAILURE" && (
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                      <XCircle className="mr-1 h-3 w-3" />
                      失败
                    </Badge>
                  )}
                  {build.status === "RUNNING" && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      <PlayCircle className="mr-1 h-3 w-3" />
                      运行中
                    </Badge>
                  )}
                  {(build.status === "PENDING" || build.status === "WAITING") && (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                      <Clock className="mr-1 h-3 w-3" />
                      等待中
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-1">
                  项目: {build.project_name} · 构建类型: {build.build_type} · 触发类型: {build.trigger_type}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  <GitPullRequest className="mr-1 h-3 w-3" />
                  单据: {build.change_number}
                </Badge>
                <Badge variant="outline">
                  <Clock className="mr-1 h-3 w-3" />
                  耗时: {formatDuration(build.duration_ms)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="text-sm font-medium">开始时间</div>
                  <div className="text-sm text-muted-foreground">{formatDate(build.start_time)}</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-sm font-medium">结束时间</div>
                  <div className="text-sm text-muted-foreground">
                    {build.end_time ? formatDate(build.end_time) : "未结束"}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-sm font-medium">执行节点</div>
                  <div className="text-sm text-muted-foreground">{build.node}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="text-sm font-medium">工作目录</div>
                  <div className="text-sm text-muted-foreground">{build.work_dir}</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-sm font-medium">Commit ID</div>
                  <div className="text-sm font-mono text-muted-foreground">{build.commit_id.substring(0, 8)}</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-sm font-medium">补丁集</div>
                  <div className="text-sm text-muted-foreground">{build.patchset}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 构建阶段时间线 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              构建阶段
            </CardTitle>
            <CardDescription>构建过程中的各个阶段及其状态</CardDescription>
          </CardHeader>
          <CardContent>
            <BuildStagesTimeline stages={build.stages} jobName={decodedJobName} buildNum={build.build_num.toString()} />
          </CardContent>
        </Card>

        {/* 详细信息标签页 */}
        <Tabs defaultValue="related-changes">
          <TabsList className="mb-4">
            <TabsTrigger value="related-changes">关联单据</TabsTrigger>
            <TabsTrigger value="artifacts">构建产物</TabsTrigger>
          </TabsList>

          <TabsContent value="related-changes">
            <RelatedChangesCard changeNumber={build.change_number} />
          </TabsContent>

          <TabsContent value="artifacts">
            <BuildArtifactsCard artifacts={build.artifacts} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
