import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, PlayCircle, XCircle } from "lucide-react"
import type { Stage } from "@/types/job"

interface JobStagesTimelineProps {
  stages: Stage[]
}

export function JobStagesTimeline({ stages }: JobStagesTimelineProps) {
  // 辅助函数：确保日期是Date对象
  const ensureDate = (dateInput: any): Date => {
    if (dateInput instanceof Date) {
      return dateInput
    }
    if (typeof dateInput === "string") {
      return new Date(dateInput)
    }
    return new Date() // 默认返回当前时间
  }

  // 辅助函数：格式化时间
  const formatTime = (dateInput: any): string => {
    try {
      const date = ensureDate(dateInput)
      return date.toLocaleTimeString()
    } catch (error) {
      console.error("Error formatting time:", error)
      return "时间未知"
    }
  }

  // 辅助函数：计算持续时间（分钟）
  const calculateDuration = (start: any, end: any): string => {
    try {
      const startDate = ensureDate(start)
      const endDate = ensureDate(end)
      const durationMs = endDate.getTime() - startDate.getTime()
      return (durationMs / 1000 / 60).toFixed(1)
    } catch (error) {
      console.error("Error calculating duration:", error)
      return "0"
    }
  }

  return (
    <div className="relative">
      <div className="absolute left-7 top-0 bottom-0 border-l border-dashed border-muted-foreground/20"></div>
      <div className="space-y-8">
        {stages.map((stage, index) => (
          <div key={stage.name + index} className="relative flex items-start">
            <div className="absolute left-7 top-7 bottom-0 border-l border-dashed border-muted-foreground/20"></div>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border bg-background">
              {stage.status === "SUCCESS" && <CheckCircle2 className="h-6 w-6 text-green-500" />}
              {stage.status === "FAILURE" && <XCircle className="h-6 w-6 text-red-500" />}
              {stage.status === "RUNNING" && <PlayCircle className="h-6 w-6 text-amber-500" />}
              {stage.status === "PENDING" && <Clock className="h-6 w-6 text-muted-foreground" />}
            </div>
            <div className="ml-4 flex-1">
              <div className="font-medium">{stage.name}</div>
              <div className="text-sm text-muted-foreground">
                {stage.status === "SUCCESS" && (
                  <>
                    <span className="text-green-500">成功</span> ·<span> 开始: {formatTime(stage.start_time)}</span> ·
                    <span> 结束: {formatTime(stage.end_time)}</span> ·
                    <span> 耗时: {calculateDuration(stage.start_time, stage.end_time)}分钟</span>
                  </>
                )}
                {stage.status === "FAILURE" && (
                  <>
                    <span className="text-red-500">失败</span> ·<span> 开始: {formatTime(stage.start_time)}</span> ·
                    <span> 结束: {formatTime(stage.end_time)}</span> ·
                    <span> 耗时: {calculateDuration(stage.start_time, stage.end_time)}分钟</span>
                  </>
                )}
                {stage.status === "RUNNING" && (
                  <>
                    <span className="text-amber-500">进行中</span> ·<span> 开始: {formatTime(stage.start_time)}</span>
                  </>
                )}
                {stage.status === "PENDING" && <span className="text-muted-foreground">等待中</span>}
              </div>

              {stage.issues_found && stage.issues_found > 0 && (
                <div className="mt-2">
                  <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                    发现 {stage.issues_found} 个问题
                  </Badge>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
