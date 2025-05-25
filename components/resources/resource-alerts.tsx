import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Cpu, HardDrive, Server } from "lucide-react"

export function ResourceAlerts() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center">
            <HardDrive className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="font-medium">存储空间即将耗尽</div>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                <AlertTriangle className="mr-1 h-3 w-3" />
                警告
              </Badge>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              节点组 build-artifacts 的存储空间使用率已达到 85%，预计将在 3 天内耗尽。
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Button variant="outline" size="sm">
                查看详情
              </Button>
              <Button variant="default" size="sm">
                扩容存储
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
            <Server className="h-4 w-4 text-red-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="font-medium">节点离线</div>
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                <AlertTriangle className="mr-1 h-3 w-3" />
                严重
              </Badge>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              节点 worker-12 已离线 30 分钟，可能影响构建队列处理速度。
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Button variant="outline" size="sm">
                查看详情
              </Button>
              <Button variant="default" size="sm">
                重启节点
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center">
            <Cpu className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="font-medium">CPU 使用率过高</div>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                <AlertTriangle className="mr-1 h-3 w-3" />
                警告
              </Badge>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              节点组 system-ci 的 CPU 使用率持续超过 90%，可能导致构建性能下降。
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Button variant="outline" size="sm">
                查看详情
              </Button>
              <Button variant="default" size="sm">
                扩容节点
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
