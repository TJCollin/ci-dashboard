"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, PlayCircle, XCircle } from "lucide-react"
import Link from "next/link"

interface Step {
  name: string
  status: "success" | "failed" | "running" | "pending"
  duration?: string
  startTime?: string | null
  endTime?: string | null
  progress?: number
  jobId?: string
}

interface ProjectStepsProps {
  project: {
    id: string
    name: string
    steps: Step[]
  }
  changeId: string
}

export function ProjectSteps({ project, changeId }: ProjectStepsProps) {
  // 步骤状态图标映射
  const statusIcons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    failed: <XCircle className="h-5 w-5 text-red-500" />,
    running: <PlayCircle className="h-5 w-5 text-amber-500" />,
    pending: <Clock className="h-5 w-5 text-blue-500" />,
  }

  // 步骤状态文本映射
  const statusText = {
    success: "成功",
    failed: "失败",
    running: "运行中",
    pending: "等待中",
  }

  // 步骤状态颜色映射
  const statusColors = {
    success: "bg-green-500/10 text-green-500 border-green-500/20",
    failed: "bg-red-500/10 text-red-500 border-red-500/20",
    running: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    pending: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {project.steps.map((step) => (
        <div
          key={step.name}
          className="flex flex-col border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
            <div className="font-medium text-sm truncate" title={step.name}>
              {step.name}
            </div>
            <Badge variant="outline" className={statusColors[step.status]}>
              {statusIcons[step.status]}
         
            </Badge>
          </div>
          <div className="p-3 flex-1 flex flex-col">
            {step.status === "running" && step.progress !== undefined && (
              <div className="mb-3">
                <Progress value={step.progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1 text-right">{step.progress}%</p>
              </div>
            )}
            <div className="text-xs text-muted-foreground space-y-1 mb-3 flex-1">
              {step.startTime && (
                <div className="flex justify-between">
                  <span>开始时间:</span>
                  <span>{new Date(step.startTime).toLocaleString()}</span>
                </div>
              )}
              {step.endTime && (
                <div className="flex justify-between">
                  <span>结束时间:</span>
                  <span>{new Date(step.endTime).toLocaleString()}</span>
                </div>
              )}
              {step.duration && (
                <div className="flex justify-between">
                  <span>耗时:</span>
                  <span>{step.duration}</span>
                </div>
              )}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-auto" asChild disabled={!step.jobId}>
              <Link href={`/pipeline-monitor/${changeId}/${project.id}/${encodeURIComponent(step.name)}`}>
                查看详情
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
