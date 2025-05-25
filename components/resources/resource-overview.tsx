import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Cpu, HardDrive, Server, Zap } from "lucide-react"

export function ResourceOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">CPU 使用率</span>
            </div>
            <span className="text-2xl font-bold">68%</span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>总核心数: 256</span>
              <span>已分配: 174</span>
            </div>
            <Progress value={68} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">内存使用率</span>
            </div>
            <span className="text-2xl font-bold">72%</span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>总内存: 1024 GB</span>
              <span>已使用: 737 GB</span>
            </div>
            <Progress value={72} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">存储使用率</span>
            </div>
            <span className="text-2xl font-bold">54%</span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>总容量: 24 TB</span>
              <span>已使用: 12.96 TB</span>
            </div>
            <Progress value={54} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">节点状态</span>
            </div>
            <span className="text-2xl font-bold">42/45</span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>在线节点: 42</span>
              <span>总节点数: 45</span>
            </div>
            <Progress value={93.3} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
