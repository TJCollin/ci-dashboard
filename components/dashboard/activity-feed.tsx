import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, GitPullRequest, Package, PlayCircle, XCircle } from "lucide-react"

// Sample data for the activity feed
const activities = [
  {
    id: 1,
    type: "build_started",
    user: {
      name: "张三",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "张",
    },
    time: "2分钟前",
    details: {
      ticketId: "CR-12345",
      ciType: "App CI",
      buildType: "SC编译",
    },
  },
  {
    id: 2,
    type: "build_success",
    user: {
      name: "李四",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "李",
    },
    time: "15分钟前",
    details: {
      ticketId: "CR-12340",
      ciType: "系统 CI",
      buildType: "模块编译",
    },
  },
  {
    id: 3,
    type: "build_failed",
    user: {
      name: "王五",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "王",
    },
    time: "32分钟前",
    details: {
      ticketId: "CR-12338",
      ciType: "App CI",
      buildType: "AS编译",
    },
  },
  {
    id: 4,
    type: "ticket_submitted",
    user: {
      name: "赵六",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "赵",
    },
    time: "1小时前",
    details: {
      ticketId: "CR-12350",
      ciType: "系统 CI",
    },
  },
  {
    id: 5,
    type: "ticket_merged",
    user: {
      name: "孙七",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "孙",
    },
    time: "2小时前",
    details: {
      ticketId: "CR-12330",
      ciType: "系统 CI",
      branch: "master",
    },
  },
]

// Helper function to get activity icon
function getActivityIcon(type: string) {
  switch (type) {
    case "build_started":
      return <PlayCircle className="h-5 w-5 text-blue-500" />
    case "build_success":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    case "build_failed":
      return <XCircle className="h-5 w-5 text-red-500" />
    case "ticket_submitted":
      return <GitPullRequest className="h-5 w-5 text-purple-500" />
    case "ticket_merged":
      return <Package className="h-5 w-5 text-green-500" />
    default:
      return <Clock className="h-5 w-5 text-muted-foreground" />
  }
}

// Helper function to get activity title
function getActivityTitle(activity: any) {
  const { type, user, details } = activity

  switch (type) {
    case "build_started":
      return (
        <span>
          <span className="font-medium">{user.name}</span> 启动了构建
          <Badge variant="outline" className="ml-1">
            {details.ticketId}
          </Badge>
        </span>
      )
    case "build_success":
      return (
        <span>
          <span className="font-medium">{user.name}</span> 的构建成功完成
          <Badge variant="outline" className="ml-1">
            {details.ticketId}
          </Badge>
        </span>
      )
    case "build_failed":
      return (
        <span>
          <span className="font-medium">{user.name}</span> 的构建失败
          <Badge variant="outline" className="ml-1">
            {details.ticketId}
          </Badge>
        </span>
      )
    case "ticket_submitted":
      return (
        <span>
          <span className="font-medium">{user.name}</span> 提交了新单据
          <Badge variant="outline" className="ml-1">
            {details.ticketId}
          </Badge>
        </span>
      )
    case "ticket_merged":
      return (
        <span>
          <span className="font-medium">{user.name}</span> 的单据已合入
          <Badge variant="outline" className="ml-1">
            {details.ticketId}
          </Badge>
        </span>
      )
    default:
      return <span>未知活动</span>
  }
}

export function ActivityFeed() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4 rounded-lg border p-3">
          <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
          <div className="flex-1 space-y-1">
            <div className="text-sm">{getActivityTitle(activity)}</div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>{activity.time}</span>
              <span>•</span>
              <span>{activity.details.ciType}</span>
              {activity.details.buildType && (
                <>
                  <span>•</span>
                  <span>{activity.details.buildType}</span>
                </>
              )}
              {activity.details.branch && (
                <>
                  <span>•</span>
                  <span>分支: {activity.details.branch}</span>
                </>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            查看详情
          </Button>
        </div>
      ))}
    </div>
  )
}
