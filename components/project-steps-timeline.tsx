import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, PlayCircle, XCircle } from "lucide-react"
import Link from "next/link"

interface ProjectStep {
  name: string
  status: "success" | "failed" | "running" | "pending"
  duration: string
  progress?: number
  startTime: string | null
  endTime: string | null
  errorMessage?: string
  jobId?: string
}

interface ProjectStepsTimelineProps {
  steps: ProjectStep[]
  projectId: string
  changeId: string
}

export function ProjectStepsTimeline({ steps, projectId, changeId }: ProjectStepsTimelineProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-2">
      {steps.map((step, index) => (
        <div key={index} className="flex-1 min-w-0">
          <div className="relative">
            {/* 连接线 */}
            {index < steps.length - 1 && (
              <div className="absolute top-4 left-full w-full h-0.5 bg-muted-foreground/20 hidden sm:block" />
            )}

            {/* 步骤图标和名称 - 可点击 */}
            <Link
              href={`/pipeline-monitor/${changeId}/${projectId}/${encodeURIComponent(step.name)}${step.jobId ? `?jobId=${step.jobId}` : ""}`}
              className="flex items-center mb-2 group"
            >
              <div className="h-8 w-8 rounded-full flex items-center justify-center mr-2 border group-hover:border-primary group-hover:bg-primary/5 transition-colors">
                {step.status === "success" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                {step.status === "failed" && <XCircle className="h-4 w-4 text-red-500" />}
                {step.status === "running" && <PlayCircle className="h-4 w-4 text-amber-500" />}
                {step.status === "pending" && <Clock className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="truncate font-medium text-sm group-hover:text-primary group-hover:underline transition-colors">
                {step.name}
              </div>
            </Link>

            {/* 步骤状态 */}
            <div className="ml-10 text-xs">
              {step.status === "success" && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  成功 ({step.duration})
                </Badge>
              )}
              {step.status === "failed" && (
                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                  失败 ({step.duration})
                </Badge>
              )}
              {step.status === "running" && (
                <>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 mb-1">
                    运行中
                  </Badge>
                  {step.progress && (
                    <div className="mt-1">
                      <Progress value={step.progress} className="h-1 w-full" />
                    </div>
                  )}
                </>
              )}
              {step.status === "pending" && <Badge variant="outline">等待中</Badge>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
