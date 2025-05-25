import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Download, Filter } from "lucide-react"
import { BuildSuccessRateChart } from "@/components/metrics/build-success-rate-chart"
import { BuildDurationChart } from "@/components/metrics/build-duration-chart"
import { ProjectHealthTable } from "@/components/metrics/project-health-table"
import { TeamPerformanceChart } from "@/components/metrics/team-performance-chart"
import { ResourceUsageChart } from "@/components/metrics/resource-usage-chart"
import { MetricCard } from "@/components/metric-card"
import { QualityTrendsChart } from "@/components/metrics/quality-trends-chart"
import { DateRangePicker } from "@/components/metrics/date-range-picker"

export default function MetricsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
        <h1 className="text-xl font-semibold">度量与分析</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            导出报告
          </Button>
        </div>
      </header> */}

      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <p className="text-muted-foreground">全面的 CI/CD 系统性能指标和项目健康度分析</p>
        </div>

        {/* 过滤器和日期选择器 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <Tabs defaultValue="all" className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="app-ci">App CI</TabsTrigger>
              <TabsTrigger value="system-ci">系统 CI</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Select defaultValue="7d">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="时间范围" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24小时</SelectItem>
                <SelectItem value="7d">7天</SelectItem>
                <SelectItem value="30d">30天</SelectItem>
                <SelectItem value="90d">90天</SelectItem>
                <SelectItem value="custom">自定义</SelectItem>
              </SelectContent>
            </Select>

            <DateRangePicker />

            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">筛选</span>
            </Button>
          </div>
        </div>

        {/* 关键指标卡片 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <MetricCard
            title="平均构建成功率"
            value="92.7%"
            trend="+1.2%"
            trendType="positive"
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          />
          <MetricCard
            title="平均构建时长"
            value="14:32"
            trend="-2:05"
            trendType="positive"
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          />
          <MetricCard
            title="代码质量评分"
            value="87/100"
            trend="+3"
            trendType="positive"
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          />
          <MetricCard
            title="平均合入时长"
            value="1.8天"
            trend="+0.2天"
            trendType="negative"
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        {/* 构建成功率和构建时长图表 */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>构建成功率趋势</CardTitle>
              <CardDescription>按天统计的构建成功率变化</CardDescription>
            </CardHeader>
            <CardContent>
              <BuildSuccessRateChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>构建时长趋势</CardTitle>
              <CardDescription>按天统计的平均构建时长变化</CardDescription>
            </CardHeader>
            <CardContent>
              <BuildDurationChart />
            </CardContent>
          </Card>
        </div>

        {/* 项目健康度表格 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>项目健康度</CardTitle>
            <CardDescription>各项目的构建状态和健康指标</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectHealthTable />
          </CardContent>
        </Card>

        {/* 团队效能和资源使用图表 */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>团队效能</CardTitle>
              <CardDescription>团队提交、构建和合入活动统计</CardDescription>
            </CardHeader>
            <CardContent>
              <TeamPerformanceChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>资源使用趋势</CardTitle>
              <CardDescription>CI系统资源使用情况</CardDescription>
            </CardHeader>
            <CardContent>
              <ResourceUsageChart />
            </CardContent>
          </Card>
        </div>

        {/* 代码质量趋势 */}
        <Card>
          <CardHeader>
            <CardTitle>代码质量趋势</CardTitle>
            <CardDescription>代码质量指标随时间的变化</CardDescription>
          </CardHeader>
          <CardContent>
            <QualityTrendsChart />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
