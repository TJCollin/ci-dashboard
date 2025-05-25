import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import type { StageIssue } from "@/types/job"

interface StageIssuesCardProps {
  issues: StageIssue[]
}

export function StageIssuesCard({ issues }: StageIssuesCardProps) {
  if (!issues || issues.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
          问题详情
        </CardTitle>
        <CardDescription>阶段执行过程中发现的问题</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {issues.map((issue, index) => (
            <div key={index} className="rounded-md border p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-red-500 flex-shrink-0" />
                <div className="space-y-2">
                  <div className="font-medium">{issue.description}</div>
                  <div className="text-sm text-muted-foreground">类型: {issue.type}</div>
                  <div className="mt-2 rounded-md bg-blue-500/5 border-blue-500/20 border p-3">
                    <div className="text-sm font-medium mb-1">AI 分析建议</div>
                    <div className="text-sm">{issue.ai_answer}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
