import { CheckCircle2, Clock, PlayCircle, XCircle } from "lucide-react"

interface Stage {
  name: string
  status: "success" | "failed" | "running" | "pending"
  startTime: string | null
  endTime: string | null
  duration: string
}

interface TicketTimelineProps {
  stages: Stage[]
}

export function TicketTimeline({ stages }: TicketTimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-7 top-0 bottom-0 border-l border-dashed border-muted-foreground/20"></div>
      <div className="space-y-8">
        {stages.map((stage, index) => (
          <div key={stage.name} className="relative flex items-start">
            <div className="absolute left-7 top-7 bottom-0 border-l border-dashed border-muted-foreground/20"></div>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border bg-background">
              {stage.status === "success" && <CheckCircle2 className="h-6 w-6 text-green-500" />}
              {stage.status === "failed" && <XCircle className="h-6 w-6 text-red-500" />}
              {stage.status === "running" && <PlayCircle className="h-6 w-6 text-amber-500" />}
              {stage.status === "pending" && <Clock className="h-6 w-6 text-muted-foreground" />}
            </div>
            <div className="ml-4 flex-1">
              <div className="font-medium">{stage.name}</div>
              <div className="text-sm text-muted-foreground">
                {stage.status === "success" && (
                  <>
                    <span className="text-green-500">成功</span> ·
                    {stage.startTime && <span> 开始: {stage.startTime}</span>} ·
                    {stage.endTime && <span> 结束: {stage.endTime}</span>} ·<span> 耗时: {stage.duration}</span>
                  </>
                )}
                {stage.status === "failed" && (
                  <>
                    <span className="text-red-500">失败</span> ·
                    {stage.startTime && <span> 开始: {stage.startTime}</span>} ·
                    {stage.endTime && <span> 结束: {stage.endTime}</span>} ·<span> 耗时: {stage.duration}</span>
                  </>
                )}
                {stage.status === "running" && (
                  <>
                    <span className="text-amber-500">进行中</span> ·
                    {stage.startTime && <span> 开始: {stage.startTime}</span>} ·<span> 耗时: {stage.duration}</span>
                  </>
                )}
                {stage.status === "pending" && <span className="text-muted-foreground">等待中</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
