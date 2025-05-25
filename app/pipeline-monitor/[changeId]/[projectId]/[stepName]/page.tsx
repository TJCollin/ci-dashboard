"use client"

import { use, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CheckCircle2, Clock, Download, ExternalLink, PlayCircle, RefreshCw, XCircle } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { JobStagesTimeline } from "@/components/pipeline-monitor/job-stages-timeline"
import { useSearchParams } from "next/navigation"
import Job from "@/types/job"



export default function StepDetailPage({
  params,
}: {
  params: Promise<{ changeId: string; projectId: string; stepName: string }>
}) {
  const { changeId, projectId, stepName } = use(params)
  const searchParams = useSearchParams()
  const jobId = searchParams.get("jobId")

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchJobDetail() {
      try {
        setLoading(true)

        // 如果没有提供jobId，则生成一个模拟的作业ID
        const effectiveJobId = jobId || `mock-job-${Date.now()}`

        // 尝试从API获取作业详情
        try {
          const response = await fetch(`/api/jobs/by-id/${effectiveJobId}`)

          if (response.ok) {
            const data = await response.json()
            setJob(data)
            return
          }

          // 如果API请求失败，不要抛出错误，而是继续使用模拟数据
          console.warn(`API request failed: ${response.statusText}. Using mock data instead.`)
        } catch (apiError) {
          console.warn(`API request error: ${apiError}. Using mock data instead.`)
        }

        // 生成模拟数据
        // const mockJob = generateMockJob(effectiveJobId, projectId, stepName, changeId)
        // setJob(mockJob)
      } catch (err) {
        console.error("Failed to fetch job detail:", err)
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchJobDetail()
  }, [jobId, projectId, stepName, changeId])

  if (loading) {
    return <StepDetailSkeleton />
  }

  if (error || !job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">出错了</h1>
          <p className="text-muted-foreground mb-6">{error || "无法加载步骤详情"}</p>
          <Button asChild>
            <Link href={`/pipeline-monitor/${changeId}`}>返回变更单据</Link>
          </Button>
        </div>
      </div>
    )
  }

  // 获取状态对应的徽章
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "running":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            <PlayCircle className="mr-1 h-3 w-3" />
            运行中
          </Badge>
        )
      case "success":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            成功
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            <XCircle className="mr-1 h-3 w-3" />
            失败
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" />
            等待中
          </Badge>
        )
    }
  }

  return (
    <div className="flex min-h-screen flex-col w-full">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/pipeline-monitor/${changeId}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">返回</span>
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">步骤详情</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-full">
        {/* 头部信息卡片 */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>{decodeURIComponent(stepName)}</CardTitle>
                  {getStatusBadge(job.status)}
                </div>
                <CardDescription className="mt-1">
                  项目：{job.project_name} ({projectId})
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">变更单号: {changeId}</Badge>
                <Badge variant="outline">持续时间: {job.duration_ms}分钟</Badge>
              </div>
            </div>
          </CardHeader>
          {/* <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="text-sm font-medium">开始时间</div>
                  <div className="text-sm text-muted-foreground">
                    {job.start_time ? job.start_time.toLocaleString() : "未开始"}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-sm font-medium">结束时间</div>
                  <div className="text-sm text-muted-foreground">
                    {job.end_time ? job.end_time.toLocaleString() : "未结束"}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-sm font-medium">类型</div>
                  <div className="text-sm text-muted-foreground">{job.job_type}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="text-sm font-medium">提交ID</div>
                  <div className="text-sm text-muted-foreground">{job.commitId}</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-sm font-medium">创建者</div>
                  <div className="text-sm text-muted-foreground">{job.createdBy.name}</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-sm font-medium">优先级</div>
                  <div className="text-sm text-muted-foreground">{job.priority}</div>
                </div>
              </div>
            </div>
          </CardContent> */}
        </Card>

        {/* 阶段详情 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>阶段详情</CardTitle>
            <CardDescription>任务执行的各个阶段</CardDescription>
          </CardHeader>
          <CardContent>
            <JobStagesTimeline stages={job.stages} />
          </CardContent>
        </Card>

        {/* 详细信息标签页 */}
        <Tabs defaultValue="logs">
          <TabsList className="mb-4">
            <TabsTrigger value="logs">日志</TabsTrigger>
            <TabsTrigger value="artifacts">构建产物</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>执行日志</CardTitle>
                <CardDescription>步骤执行过程中的详细日志</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-black text-white p-4 rounded-md font-mono text-sm overflow-auto max-h-[500px]">
                  {generateMockLogs().map((log, index) => (
                    <div key={index} className="whitespace-pre-wrap mb-1">
                      {log}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="artifacts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>构建制品</CardTitle>
                <CardDescription>步骤执行产生的文件和报告</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {generateMockArtifacts().map((artifact, index) => (
                    <div key={index} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{artifact.name}</div>
                        <div className="text-sm text-muted-foreground">{artifact.size}</div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={artifact.url} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          下载
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 操作按钮 */}
        <div className="mt-6 flex flex-wrap gap-4">
          <Button variant="outline" asChild>
            <Link href={`/pipeline-monitor/${changeId}`}>返回变更单据</Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />在 Jenkins 中查看
            </a>
          </Button>
          {job.status.toLowerCase() === "failed" && (
            <Button>
              <RefreshCw className="mr-2 h-4 w-4" />
              重试任务
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}

// 生成模拟作业数据
// function generateMockJob(jobId: string, projectId: string, stepName: string, changeId: string): Job {
//   const now = new Date()
//   const startedAt = new Date(now.getTime() - 60 * 60 * 1000) // 1小时前
//   const completedAt = Math.random() > 0.3 ? new Date(now.getTime() - 10 * 60 * 1000) : undefined // 10分钟前
//   const status = completedAt ? (Math.random() > 0.2 ? "success" : "failed") : "running"
//   const duration = completedAt ? Math.floor((completedAt.getTime() - startedAt.getTime()) / (1000 * 60)) : 0

//   // 生成阶段
//   const stageCount = Math.floor(Math.random() * 3) + 3 // 3-5个阶段
//   const stages = []

//   for (let i = 0; i < stageCount; i++) {
//     const stageStartTime = new Date(startedAt.getTime() + i * 15 * 60 * 1000) // 每个阶段间隔15分钟
//     const stageDuration = Math.floor(Math.random() * 10) + 5 // 5-15分钟
//     const stageEndTime =
//       i < stageCount - 1 || completedAt ? new Date(stageStartTime.getTime() + stageDuration * 60 * 1000) : undefined
//     const stageStatus = !stageEndTime ? "running" : Math.random() > 0.2 ? "success" : "failed"

//     stages.push({
//       id: `stage-${i}`,
//       name: ["准备环境", "代码检查", "编译构建", "单元测试", "集成测试", "部署"][i % 6],
//       status: stageStatus,
//       start_time: stageStartTime!,
//       end_time: stageEndTime!,
//       duration: stageDuration,
//       logs_url: ""
//     })
//   }

//   return {
//     _id: jobId,
//     name: `${decodeURIComponent(stepName)} 任务`,
//     description: `项目 ${projectId} 的${decodeURIComponent(stepName)}任务`,
//     status,
//     priority: Math.floor(Math.random() * 3) + 1,
//     start_time: new Date(startedAt.getTime() - 5 * 60 * 1000), // 开始前5分钟创建
//     startedAt,
//     end_time: completedAt!,
//     duration,
//     createdBy: {
//       id: `user-${Math.floor(Math.random() * 100)}`,
//       name: ["张三", "李四", "王五", "赵六", "孙七"][Math.floor(Math.random() * 5)],
//     },
//     repository: ["主应用", "核心模块", "UI框架", "网络服务", "媒体播放器"][Math.floor(Math.random() * 5)],
//     branch: ["master", "develop", "feature/new-ui", "bugfix/memory-leak", "release/v2.0"][
//       Math.floor(Math.random() * 5)
//     ],
//     commitId: `commit-${Math.random().toString(36).substring(2, 10)}`,
//     stages,
//   }
// }

// 生成模拟日志
function generateMockLogs(): string[] {
  return [
    "[10:15:32] 开始执行步骤...",
    "[10:15:33] 正在初始化环境...",
    "[10:15:40] 正在下载依赖...",
    "[10:16:15] 依赖下载完成",
    "[10:16:20] 开始编译...",
    "[10:18:45] 编译完成",
    "[10:18:50] 开始运行测试...",
    "[10:20:30] 测试完成，共执行120个测试用例",
    "[10:20:35] 生成测试报告...",
    "[10:20:40] 步骤执行完成",
  ]
}

// 生成模拟构建产物
function generateMockArtifacts(): Array<{ name: string; size: string; url: string }> {
  return [
    { name: "build.zip", size: "45.2 MB", url: "#" },
    { name: "test-report.html", size: "1.8 MB", url: "#" },
    { name: "coverage.xml", size: "256 KB", url: "#" },
  ]
}

function StepDetailSkeleton() {
  return (
    <div className="flex min-h-screen flex-col w-full">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-9 w-24" />
      </header>

      <main className="flex-1 p-6 max-w-full">
        {/* 头部信息卡片骨架 */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-4 w-64 mt-1" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 阶段详情骨架 */}
        <Card className="mb-6">
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-1" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <div className="ml-4 flex-1">
                    <Skeleton className="h-5 w-40 mb-1" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 标签页骨架 */}
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        </div>

        {/* 操作按钮骨架 */}
        <div className="mt-6 flex flex-wrap gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
      </main>
    </div>
  )
}
