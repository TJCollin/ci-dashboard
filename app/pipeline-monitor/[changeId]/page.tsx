"use client"

import { use, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Code,
  ExternalLink,
  FileText,
  GitBranch,
  GitCommit,
  GitPullRequest,
  MessageSquare,
  PlayCircle,
  Server,
  User,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { ProjectSteps } from "@/components/pipeline-monitor/project-steps"
import type ChangeDocument from "@/types/change-document"
import { Skeleton } from "@/components/ui/skeleton"
import type { Project } from "@/lib/mock-data/projects"

export default function ChangeDetailPage({ params }: { params: Promise<{ changeId: string }> }) {
  const { changeId } = use(params)
  const [changeDocument, setChangeDocument] = useState<ChangeDocument | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchChangeDocument() {
      try {
        setLoading(true)
        const response = await fetch(`/api/change-documents/${changeId}`)

        if (!response.ok) {
          throw new Error(`Error fetching change document: ${response.statusText}`)
        }

        const data = await response.json()
        setChangeDocument(data)
      } catch (err) {
        console.error("Failed to fetch change document:", err)
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    async function fetchProjects() {
      try {
        setProjectsLoading(true)
        const response = await fetch(`/api/change-documents/${changeId}/projects`)

        if (!response.ok) {
          throw new Error(`Error fetching projects: ${response.statusText}`)
        }

        const data = await response.json()
        setProjects(data)
      } catch (err) {
        console.error("Failed to fetch projects:", err)
      } finally {
        setProjectsLoading(false)
      }
    }

    fetchChangeDocument()
    fetchProjects()
  }, [changeId])

  if (loading) {
    return <ChangeDetailSkeleton />
  }

  if (error || !changeDocument) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">出错了</h1>
          <p className="text-muted-foreground mb-6">{error || "无法加载变更单据详情"}</p>
          <Button asChild>
            <Link href="/pipeline-monitor">返回列表</Link>
          </Button>
        </div>
      </div>
    )
  }

  // 将项目步骤转换为UI所需的格式
  const formattedProjects = projects.map((project) => {
    return {
      id: project.id,
      name: project.name,
      steps: project.steps.map((step) => {
        // 确保日期正确转换为字符串
        const startTimeStr = step.startTime
          ? typeof step.startTime === "object" && step.startTime instanceof Date
            ? step.startTime.toISOString()
            : String(step.startTime)
          : null

        const endTimeStr = step.endTime
          ? typeof step.endTime === "object" && step.endTime instanceof Date
            ? step.endTime.toISOString()
            : String(step.endTime)
          : null

        return {
          name: step.name,
          status: step.status as "success" | "failed" | "running" | "pending",
          duration: step.duration ? `${step.duration}分钟` : "未完成",
          startTime: startTimeStr,
          endTime: endTimeStr,
          progress: step.status === "running" ? Math.floor(Math.random() * 80) + 20 : undefined,
          jobId: step.jobId,
        }
      }),
    }
  })

  return (
    <div className="flex min-h-screen flex-col w-full">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/pipeline-monitor">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">返回</span>
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">单据详情</h1>
        </div>
        <div className="flex items-center gap-2">
          {changeDocument.rdc && changeDocument.rdc.url && (
            <Button variant="outline" size="sm" asChild>
              <a href={changeDocument.rdc.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />在 Gerrit 中查看
              </a>
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6 max-w-full">
        {/* 头部信息卡片 */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <GitPullRequest className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>{changeDocument.change_number}</CardTitle>
                  {changeDocument.current_state && changeDocument.current_state.ci_status === "RUNNING" && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      <PlayCircle className="mr-1 h-3 w-3" />
                      运行中
                    </Badge>
                  )}
                  {changeDocument.current_state && changeDocument.current_state.ci_status === "SUCCESS" && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      成功
                    </Badge>
                  )}
                  {changeDocument.current_state && changeDocument.current_state.ci_status === "FAILED" && (
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                      <XCircle className="mr-1 h-3 w-3" />
                      失败
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-1">{changeDocument.rdc && changeDocument.rdc.title}</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{changeDocument.ci_type}</Badge>
                {changeDocument.rdc && changeDocument.rdc.key && (
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                    {changeDocument.rdc.key}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">提交人</div>
                    <div className="text-sm text-muted-foreground">
                      {changeDocument.owner && changeDocument.owner.name}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">提交时间</div>
                    <div className="text-sm text-muted-foreground">
                      {changeDocument.created_at && new Date(changeDocument.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <GitCommit className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Commit ID</div>
                    <div className="text-sm font-mono text-muted-foreground">
                      {changeDocument.patchsets && changeDocument.patchsets[0]?.commit_id}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Server className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">仓库</div>
                    <div className="text-sm text-muted-foreground">{changeDocument.repository}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <GitBranch className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">分支</div>
                    <div className="text-sm text-muted-foreground">{changeDocument.branch}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">提交信息</div>
                    <div className="text-sm text-muted-foreground">
                      {changeDocument.rdc && changeDocument.rdc.title}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 项目构建状态 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="mr-2 h-5 w-5 text-primary" />
              项目构建状态
            </CardTitle>
            <CardDescription>关联项目的构建步骤和状态</CardDescription>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-40 mb-1" />
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5, 6].map((j) => (
                        <Skeleton key={j} className="h-16 w-full" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : formattedProjects.length > 0 ? (
              <div className="space-y-8">
                {formattedProjects.map((project) => (
                  <div key={project.id} className="bg-card rounded-lg border shadow-sm overflow-hidden">
                    <div className="bg-muted/50 px-4 py-3 border-b">
                      <h3 className="text-lg font-semibold flex items-center">
                        <GitBranch className="mr-2 h-5 w-5 text-primary" />
                        {project.name}
                      </h3>
                    </div>
                    <div className="p-4">
                      <ProjectSteps project={project} changeId={changeId} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-muted/20">
                <Server className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
                <h3 className="text-lg font-medium mb-1">暂无关联项目数据</h3>
                <p className="text-muted-foreground">该变更单据尚未关联任何项目构建任务</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 相关链接 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ExternalLink className="mr-2 h-5 w-5 text-primary" />
              相关链接
            </CardTitle>
            <CardDescription>快速访问相关系统</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {changeDocument.rdc && changeDocument.rdc.url && (
                <Button variant="outline" className="justify-start hover:bg-primary/5 transition-colors" asChild>
                  <a href={changeDocument.rdc.url} target="_blank" rel="noopener noreferrer">
                    <Code className="mr-2 h-4 w-4 text-primary" />
                    Gerrit 页面
                    <ArrowUpRight className="ml-auto h-4 w-4 opacity-70" />
                  </a>
                </Button>
              )}

              {changeDocument.total_ci && changeDocument.total_ci.length > 0 && changeDocument.total_ci[0]?.job_url && (
                <Button variant="outline" className="justify-start hover:bg-primary/5 transition-colors" asChild>
                  <a href={changeDocument.total_ci[0].job_url} target="_blank" rel="noopener noreferrer">
                    <Server className="mr-2 h-4 w-4 text-primary" />
                    Jenkins Job
                    <ArrowUpRight className="ml-auto h-4 w-4 opacity-70" />
                  </a>
                </Button>
              )}

              <Button variant="outline" className="justify-start hover:bg-primary/5 transition-colors" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-4 w-4 text-primary" />
                  测试报告
                  <ArrowUpRight className="ml-auto h-4 w-4 opacity-70" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function ChangeDetailSkeleton() {
  return (
    <div className="flex min-h-screen flex-col w-full">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/pipeline-monitor">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">返回</span>
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">单据详情</h1>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-32" />
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6 max-w-full">
        {/* 头部信息卡片骨架 */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-4 w-64 mt-1" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Skeleton className="h-4 w-4 mt-0.5" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Skeleton className="h-4 w-4 mt-0.5" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 项目构建状态骨架 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-4 w-48 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/30 p-4 border-b">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-6 w-40" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5, 6].map((j) => (
                        <Skeleton key={j} className="h-16 w-full" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 相关链接骨架 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-4 w-40 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
