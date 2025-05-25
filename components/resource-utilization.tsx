import { Progress } from "@/components/ui/progress"

export function ResourceUtilization() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>CPU 使用率</span>
          <span className="font-medium">78%</span>
        </div>
        <Progress value={78} className="h-2" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>内存使用率</span>
          <span className="font-medium">64%</span>
        </div>
        <Progress value={64} className="h-2" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>磁盘使用率</span>
          <span className="font-medium">42%</span>
        </div>
        <Progress value={42} className="h-2" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>节点在线率</span>
          <span className="font-medium">92%</span>
        </div>
        <Progress value={92} className="h-2" />
      </div>
    </div>
  )
}
