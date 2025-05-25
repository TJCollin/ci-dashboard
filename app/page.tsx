import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Activity,
  AlertCircle,
  BarChart3,
  Clock,
  FileCheck,
  GitPullRequest,
  History,
  List,
  Package,
  Server,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MetricCard } from "@/components/metric-card"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { ResourceUtilization } from "@/components/resource-utilization"
import { TopFailedProjects } from "@/components/dashboard/top-failed-projects"
import { AiAssistant } from "@/components/dashboard/ai-assistant"
import { MainHeader } from "@/components/main-header"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">概览</h2>
          <Tabs defaultValue="app-ci" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="app-ci">App CI</TabsTrigger>
              <TabsTrigger value="system-ci">系统 CI</TabsTrigger>
            </TabsList>
            <TabsContent value="app-ci" className="mt-0">
              <div className="text-xs text-muted-foreground">显示 App CI 相关指标</div>
            </TabsContent>
            <TabsContent value="system-ci" className="mt-0">
              <div className="text-xs text-muted-foreground">显示系统 CI 相关指标</div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="今日构建总数"
            value="124"
            trend="+12%"
            trendType="positive"
            icon={<Package className="h-4 w-4 text-muted-foreground" />}
          />
          <MetricCard
            title="今日构建成功率"
            value="94.2%"
            trend="+2.1%"
            trendType="positive"
            icon={<FileCheck className="h-4 w-4 text-muted-foreground" />}
          />
          <MetricCard
            title="当前运行中构建数"
            value="18"
            trend="-3"
            trendType="neutral"
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          />
          <MetricCard
            title="待处理单据数"
            value="7"
            trend="+2"
            trendType="negative"
            icon={<GitPullRequest className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>构建失败次数最多的项目</CardTitle>
                <CardDescription>近 24 小时内失败次数 Top 5</CardDescription>
              </div>
              <Tabs defaultValue="24h" className="w-[160px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="24h">24小时</TabsTrigger>
                  <TabsTrigger value="7d">7天</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <TopFailedProjects />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>平均构建时长</CardTitle>
              <CardDescription>近 24 小时</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">App CI</span>
                </div>
                <div className="text-2xl font-bold">12:24</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">系统 CI</span>
                </div>
                <div className="text-2xl font-bold">28:45</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">平均单据处理时长</span>
                </div>
                <div className="text-2xl font-bold">1:42:18</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 mt-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>近期活动</CardTitle>
              <CardDescription>最新的 CI/CD 事件</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityFeed />
            </CardContent>
          </Card>
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>资源利用率</CardTitle>
                <CardDescription>构建集群负载</CardDescription>
              </CardHeader>
              <CardContent>
                <ResourceUtilization />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>系统公告</CardTitle>
                <Badge variant="outline">2 条新公告</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <span className="text-sm font-medium">计划维护通知</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      系统将于 4 月 5 日 22:00-24:00 进行维护升级，期间构建服务可能不稳定。
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">新功能发布</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">CI 系统新增 AI 代码评审功能，欢迎试用并反馈。</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 mt-6 md:grid-cols-4">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>快速入口</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                <Button variant="outline" className="h-24 flex-col gap-2 rounded-xl">
                  <GitPullRequest className="h-6 w-6" />
                  <span>我的单据</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2 rounded-xl">
                  <History className="h-6 w-6" />
                  <span>构建历史</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2 rounded-xl">
                  <BarChart3 className="h-6 w-6" />
                  <span>性能报告</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2 rounded-xl">
                  <UserPlus className="h-6 w-6" />
                  <span>新业务申请</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2 rounded-xl">
                  <List className="h-6 w-6" />
                  <span>测试报告</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2 rounded-xl">
                  <Server className="h-6 w-6" />
                  <span>资源监控</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <AiAssistant />
    </div>
  )
}
