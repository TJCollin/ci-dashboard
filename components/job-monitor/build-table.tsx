import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, ExternalLink, MoreHorizontal, PlayCircle, XCircle } from "lucide-react"
import Link from "next/link"
import type Job from "@/types/job"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"

interface BuildTableProps {
  builds: Job[]
  jobName: string
  isLoading?: boolean
}

export function BuildTable({ builds, jobName, isLoading = false }: BuildTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  if (builds.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <h3 className="mt-2 text-lg font-medium">没有找到构建记录</h3>
          <p className="mt-1 text-sm text-muted-foreground">该任务尚未执行任何构建</p>
        </div>
      </div>
    )
  }

  // 格式化日期
  const formatDate = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: zhCN })
    } catch (error) {
      return "未知时间"
    }
  }

  // 格式化持续时间
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}小时 ${minutes % 60}分钟`
    } else if (minutes > 0) {
      return `${minutes}分钟 ${seconds % 60}秒`
    } else {
      return `${seconds}秒`
    }
  }

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left font-medium p-2 pl-0">构建号</th>
            <th className="text-left font-medium p-2">状态</th>
            <th className="text-left font-medium p-2">触发类型</th>
            <th className="text-left font-medium p-2">关联单据</th>
            <th className="text-left font-medium p-2">开始时间</th>
            <th className="text-left font-medium p-2">持续时间</th>
            <th className="text-left font-medium p-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {builds.map((build) => (
            <tr key={build._id} className="border-b">
              <td className="p-2 pl-0 font-medium">
                <Link
                  href={`/job-monitor/${encodeURIComponent(jobName)}/${build.build_num}`}
                  className="hover:underline"
                >
                  #{build.build_num}
                </Link>
              </td>
              <td className="p-2">
                <div className="flex items-center gap-1">
                  {build.status === "SUCCESS" && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      成功
                    </Badge>
                  )}
                  {build.status === "FAILURE" && (
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                      <XCircle className="mr-1 h-3 w-3" />
                      失败
                    </Badge>
                  )}
                  {build.status === "RUNNING" && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      <PlayCircle className="mr-1 h-3 w-3" />
                      运行中
                    </Badge>
                  )}
                  {(build.status === "PENDING" || build.status === "WAITING") && (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                      <Clock className="mr-1 h-3 w-3" />
                      等待中
                    </Badge>
                  )}
                </div>
              </td>
              <td className="p-2">
                <Badge variant="outline">{build.trigger_type}</Badge>
              </td>
              <td className="p-2">
                <Link href={`/pipeline-monitor/${build.change_number}`} className="hover:underline">
                  {build.change_number}
                </Link>
              </td>
              <td className="p-2">{formatDate(build.start_time)}</td>
              <td className="p-2">{formatDuration(build.duration_ms)}</td>
              <td className="p-2">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/job-monitor/${encodeURIComponent(jobName)}/${build.build_num}`}>
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">查看详情</span>
                    </Link>
                  </Button>
                  {build.job_url && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={build.job_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">外部链接</span>
                      </a>
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
