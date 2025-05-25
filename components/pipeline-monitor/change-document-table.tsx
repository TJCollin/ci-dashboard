import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, GitPullRequest, MoreHorizontal, PlayCircle, XCircle } from "lucide-react"
import Link from "next/link"
import type ChangeDocument from "@/types/change-document"

interface ChangeDocumentTableProps {
  documents: ChangeDocument[]
  isLoading?: boolean
}

export function ChangeDocumentTable({ documents, isLoading = false }: ChangeDocumentTableProps) {
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

  if (documents.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <GitPullRequest className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="mt-2 text-lg font-medium">没有找到单据</h3>
          <p className="mt-1 text-sm text-muted-foreground">尝试调整筛选条件或搜索关键词</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left font-medium p-2 pl-0">单据号</th>
            {/* <th className="text-left font-medium p-2">标题</th> */}
            <th className="text-left font-medium p-2">提交人</th>
            <th className="text-left font-medium p-2">CI 类型</th>
            <th className="text-left font-medium p-2">仓库</th>
            <th className="text-left font-medium p-2">CI总体状态</th>
            <th className="text-left font-medium p-2">提交时间</th>
            <th className="text-left font-medium p-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc._id} className="border-b">
              <td className="p-2 pl-0">
                <div className="flex items-center gap-2">
                  <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                  <Link href={`/pipeline-monitor/${doc.change_number}`} className="font-medium hover:underline">
                    {doc.change_number}
                  </Link>
                </div>
              </td>
              {/* <td className="p-2 max-w-[200px] truncate">
                <Link href={`/pipeline-monitor/${doc.change_number}`} className="hover:underline">
                  {doc.rdc.title}
                </Link>
                {doc.rdc.key && (
                  <Badge variant="outline" className="ml-2 bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">
                    {doc.rdc.key}
                  </Badge>
                )}
              </td> */}
              <td className="p-2">{doc.owner.name}</td>
              <td className="p-2">
                <Badge variant="outline">{doc.ci_type}</Badge>
              </td>
              <td className="p-2">{doc.repository}</td>
              <td className="p-2">
                <div className="flex items-center gap-1">
                  {doc.current_state.ci_status === "PENDING" && (
                    <>
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>等待中</span>
                    </>
                  )}
                  {doc.current_state.ci_status === "RUNNING" && (
                    <>
                      <PlayCircle className="h-4 w-4 text-amber-500" />
                      <span>运行中</span>
                    </>
                  )}
                  {doc.current_state.ci_status === "SUCCESS" && (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>成功</span>
                    </>
                  )}
                  {doc.current_state.ci_status === "FAILED" && (
                    <>
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>失败</span>
                    </>
                  )}
                </div>
              </td>
              <td className="p-2">{new Date(doc.created_at).toLocaleString()}</td>
              <td className="p-2">
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
