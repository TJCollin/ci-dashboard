import { Progress } from "@/components/ui/progress"

// Sample data for failed projects
const failedProjects = [
  { name: "android-app-main", failures: 12, percentage: 24 },
  { name: "system-core-module", failures: 8, percentage: 16 },
  { name: "ui-components", failures: 6, percentage: 12 },
  { name: "network-service", failures: 5, percentage: 10 },
  { name: "media-player", failures: 4, percentage: 8 },
]

export function TopFailedProjects() {
  return (
    <div className="space-y-6">
      {failedProjects.map((project) => (
        <div key={project.name} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{project.name}</span>
            <span>{project.failures} 次失败</span>
          </div>
          <div className="flex items-center gap-4">
            <Progress value={project.percentage} className="h-2 flex-1" />
            <span className="text-xs text-muted-foreground w-10 text-right">{project.percentage}%</span>
          </div>
        </div>
      ))}
    </div>
  )
}
