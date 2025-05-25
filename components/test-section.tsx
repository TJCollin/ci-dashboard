import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, CheckCircle2, FileText, PlayCircle, XCircle } from "lucide-react"

interface Test {
  id: string
  name: string
  type: string
  status: "success" | "failed" | "running" | "pending"
  passRate?: number
  totalTests?: number
  passedTests?: number
  failedTests?: number
  startTime: string | null
  endTime: string | null
  duration: string
  reportUrl: string
}

interface TestSectionProps {
  tests: Test[]
}

export function TestSection({ tests }: TestSectionProps) {
  // 如果没有测试数据或测试还未开始
  if (!tests || tests.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">测试阶段尚未开始或暂无测试数据</div>
  }

  return (
    <div className="space-y-6">
      {tests.map((test) => (
        <Card key={test.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{test.name}</span>
                  <Badge variant="outline">{test.type}</Badge>
                  {test.status === "success" && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      通过
                    </Badge>
                  )}
                  {test.status === "failed" && (
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                      <XCircle className="mr-1 h-3 w-3" />
                      失败
                    </Badge>
                  )}
                  {test.status === "running" && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      <PlayCircle className="mr-1 h-3 w-3" />
                      运行中
                    </Badge>
                  )}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {test.startTime && <span>开始: {test.startTime}</span>}
                  {test.endTime && <span> · 结束: {test.endTime}</span>}
                  {test.duration && <span> · 耗时: {test.duration}</span>}
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={test.reportUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-4 w-4" />
                  测试报告
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>

            {(test.passRate !== undefined || test.totalTests !== undefined) && (
              <div className="mt-4 space-y-4">
                {test.passRate !== undefined && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>通过率</span>
                      <span>{test.passRate}%</span>
                    </div>
                    <Progress value={test.passRate} className="h-2" />
                  </div>
                )}

                {test.totalTests !== undefined && (
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">总测试数</div>
                        <div className="text-2xl font-bold mt-1">{test.totalTests}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">通过</div>
                        <div className="text-2xl font-bold mt-1 text-green-500">{test.passedTests}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">失败</div>
                        <div className="text-2xl font-bold mt-1 text-red-500">{test.failedTests}</div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {test.status === "failed" && (
              <div className="mt-4">
                <Tabs defaultValue="failed-tests">
                  <TabsList>
                    <TabsTrigger value="failed-tests">失败的测试</TabsTrigger>
                    <TabsTrigger value="ai-analysis">AI 分析</TabsTrigger>
                  </TabsList>
                  <TabsContent value="failed-tests" className="mt-4">
                    <div className="space-y-3">
                      <div className="rounded-md border p-3">
                        <div className="font-medium">com.example.ImageLoaderTest.testLoadLargeImage</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          断言失败: 期望内存使用小于 10MB，实际使用 15.2MB
                        </div>
                      </div>
                      <div className="rounded-md border p-3">
                        <div className="font-medium">com.example.ImageProcessorTest.testProcessHighResImage</div>
                        <div className="text-sm text-muted-foreground mt-1">超时: 测试执行时间超过 5000ms</div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="ai-analysis" className="mt-4">
                    <div className="rounded-md border p-4 bg-blue-500/5 border-blue-500/20">
                      <p className="text-sm">测试失败主要集中在大图片处理上，可能的原因：</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                        <li>图片加载时没有进行适当的缩放，导致内存使用过高</li>
                        <li>高分辨率图片处理算法效率低下，建议使用更高效的算法或进行多线程处理</li>
                        <li>考虑添加图片缓存机制，避免重复加载相同图片</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
