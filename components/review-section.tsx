import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, MessageSquare, XCircle } from "lucide-react"

interface Reviewer {
  name: string
  status: "approved" | "rejected" | "pending"
  comment: string
  score: string
}

interface ReviewSectionProps {
  reviewers: Reviewer[]
}

export function ReviewSection({ reviewers }: ReviewSectionProps) {
  // 如果没有评审人
  if (!reviewers || reviewers.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">暂无代码评审信息</div>
  }

  return (
    <div className="space-y-4">
      {/* AI 代码评审建议 */}
      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <div className="font-medium mb-1 flex items-center">
                AI 代码评审建议
                <Badge variant="outline" className="ml-2 bg-blue-500/10 text-blue-500 border-blue-500/20">
                  自动生成
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>代码质量良好，但有以下几点建议：</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>考虑使用图片缓存库来优化内存使用</li>
                  <li>添加更多的异常处理逻辑</li>
                  <li>可以考虑使用懒加载策略进一步提升性能</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 人工评审 */}
      <div className="space-y-4">
        {reviewers.map((reviewer) => (
          <Card key={reviewer.name} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-start p-4">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={reviewer.name} />
                  <AvatarFallback>{reviewer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{reviewer.name}</div>
                    <div className="flex items-center gap-2">
                      {reviewer.status === "approved" && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          已批准
                        </Badge>
                      )}
                      {reviewer.status === "rejected" && (
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                          <XCircle className="mr-1 h-3 w-3" />
                          已拒绝
                        </Badge>
                      )}
                      {reviewer.status === "pending" && <Badge variant="outline">待评审</Badge>}
                      <Badge>{reviewer.score}</Badge>
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{reviewer.comment}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
