import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, Filter, Plus, RefreshCw, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ResourceOverview } from "@/components/resources/resource-overview"
import { ResourceAllocationChart } from "@/components/resources/resource-allocation-chart"
import { NodeStatusTable } from "@/components/resources/node-status-table"
import { ResourceUsageHistory } from "@/components/resources/resource-usage-history"
import { ResourceAlerts } from "@/components/resources/resource-alerts"
import { StorageUsageChart } from "@/components/resources/storage-usage-chart"

export default function ResourcesPage() {
  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
        <h1 className="text-xl font-semibold">资源管理</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            导出报告
          </Button>
          <Button variant="default" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            添加节点
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <p className="text-muted-foreground">管理和监控 CI/CD 系统的计算资源、存储资源和节点状态</p>
        </div>

        {/* 资源概览卡片 */}
        <div className="mb-6">
          <ResourceOverview />
        </div>

        {/* 资源预警 */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>资源预警</CardTitle>
              <Badge variant="outline">3 条警告</Badge>
            </div>
            <CardDescription>需要关注的资源异常或即将耗尽的警告</CardDescription>
          </CardHeader>
          <CardContent>
            <ResourceAlerts />
          </CardContent>
        </Card>

        {/* 节点管理和资源分配 */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>节点管理</CardTitle>
                  <CardDescription>CI/CD 系统节点状态和详情</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="搜索节点..." className="w-full rounded-md pl-8 md:w-[200px]" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="节点状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="online">在线</SelectItem>
                      <SelectItem value="offline">离线</SelectItem>
                      <SelectItem value="maintenance">维护中</SelectItem>
                      <SelectItem value="warning">警告</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">筛选</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <NodeStatusTable />
            </CardContent>
          </Card>
        </div>

        {/* 资源分配和存储使用 */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>资源分配</CardTitle>
              <CardDescription>按项目或团队的资源分配情况</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="project">
                <TabsList className="mb-4">
                  <TabsTrigger value="project">按项目</TabsTrigger>
                  <TabsTrigger value="team">按团队</TabsTrigger>
                </TabsList>
                <TabsContent value="project">
                  <ResourceAllocationChart type="project" />
                </TabsContent>
                <TabsContent value="team">
                  <ResourceAllocationChart type="team" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>存储使用情况</CardTitle>
              <CardDescription>各存储资源使用详情</CardDescription>
            </CardHeader>
            <CardContent>
              <StorageUsageChart />
            </CardContent>
          </Card>
        </div>

        {/* 资源使用历史 */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>资源使用历史</CardTitle>
                <CardDescription>系统资源使用的历史趋势</CardDescription>
              </div>
              <Select defaultValue="30d">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="时间范围" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7天</SelectItem>
                  <SelectItem value="30d">30天</SelectItem>
                  <SelectItem value="90d">90天</SelectItem>
                  <SelectItem value="365d">1年</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResourceUsageHistory />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
