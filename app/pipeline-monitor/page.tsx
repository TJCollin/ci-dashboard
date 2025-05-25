"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, ChevronDown, Clock, Filter, PlayCircle, Search, User, XCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { Pagination } from "@/components/pagination"
import { ChangeDocumentTable } from "@/components/pipeline-monitor/change-document-table"
import type ChangeDocument from "@/types/change-document"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GitPullRequest, MoreHorizontal } from "lucide-react"
import Link from "next/link"

interface PaginationData {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface ApiResponse {
  data: ChangeDocument[]
  pagination: PaginationData
  filters: {
    status: string | null
    ciType: string | null
    repository: string | null
    search: string | null
  }
}

export default function PipelineMonitorPage() {
  const [view, setView] = useState<"kanban" | "list">("list")
  const [documents, setDocuments] = useState<ChangeDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [ciTypeFilter, setCiTypeFilter] = useState<string | null>(null)
  const [repositoryFilter, setRepositoryFilter] = useState<string | null>(null)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Replace the two separate useEffect hooks with a single one
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const queryParams = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
        })

        if (debouncedSearchTerm) {
          queryParams.append("search", debouncedSearchTerm)
        }

        if (statusFilter) {
          queryParams.append("status", statusFilter)
        }

        if (ciTypeFilter) {
          queryParams.append("ciType", ciTypeFilter)
        }

        if (repositoryFilter) {
          queryParams.append("repository", repositoryFilter)
        }
        console.log("queryParams", queryParams.toString())

        const response = await fetch(`/api/change-documents?${queryParams.toString()}`)
        const data: ApiResponse = await response.json()
        setDocuments(data.data)
        setPagination(data.pagination)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [pagination.page, pagination.limit, debouncedSearchTerm, statusFilter, ciTypeFilter, repositoryFilter])

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  const handlePageSizeChange = (limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }))
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value === "all" ? null : value)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleCiTypeFilterChange = (value: string) => {
    setCiTypeFilter(value === "all" ? null : value)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleRepositoryFilterChange = (value: string) => {
    setRepositoryFilter(value === "all" ? null : value)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setDebouncedSearchTerm("")
    setStatusFilter(null)
    setCiTypeFilter(null)
    setRepositoryFilter(null)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <p className="text-muted-foreground">实时追踪和查看所有正在进行或最近完成的 CI/CD 流水线</p>
        </div>

        <div className="mb-6">
          <Tabs defaultValue={view} onValueChange={(value) => setView(value as "kanban" | "list")} className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="kanban">看板视图</TabsTrigger>
                <TabsTrigger value="list">列表视图</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="搜索单据..."
                    className="w-full rounded-md pl-8 md:w-[200px] lg:w-[300px]"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                      <span className="sr-only">筛选</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>筛选选项</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      {view === "list" && (
                        <div className="mb-2">
                          <label className="text-xs font-medium mb-1 block">状态</label>
                          <Select value={statusFilter || "all"} onValueChange={handleStatusFilterChange}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="所有状态" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">所有状态</SelectItem>
                              <SelectItem value="ACTIVE">进行中</SelectItem>
                              <SelectItem value="MERGED">已合入</SelectItem>
                              <SelectItem value="ABANDONED">已放弃</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className="mb-2">
                        <label className="text-xs font-medium mb-1 block">CI 类型</label>
                        <Select value={ciTypeFilter || "all"} onValueChange={handleCiTypeFilterChange}>
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="所有类型" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">所有类型</SelectItem>
                            <SelectItem value="App CI">App CI</SelectItem>
                            <SelectItem value="系统 CI">系统 CI</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="mb-2">
                        <label className="text-xs font-medium mb-1 block">仓库</label>
                        <Select value={repositoryFilter || "all"} onValueChange={handleRepositoryFilterChange}>
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="所有仓库" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">所有仓库</SelectItem>
                            <SelectItem value="android-app-main">android-app-main</SelectItem>
                            <SelectItem value="system-core">system-core</SelectItem>
                            <SelectItem value="ui-framework">ui-framework</SelectItem>
                            <SelectItem value="network-service">network-service</SelectItem>
                            <SelectItem value="media-player">media-player</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-2" onClick={clearFilters}>
                        清除筛选
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1">
                  <User className="h-4 w-4 mr-1" />
                  只看我的
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>

            <TabsContent value="kanban" className="mt-0">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">所有单据</CardTitle>
                    <Badge variant="outline">{pagination.total}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    ) : documents.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground text-sm">没有找到单据</div>
                    ) : (
                      documents.map((doc) => (
                        <div key={doc._id} className="rounded-lg border p-3 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                              <Link
                                href={`/pipeline-monitor/${doc.change_number}`}
                                className="font-medium hover:underline"
                              >
                                {doc.change_number}
                              </Link>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">更多选项</span>
                            </Button>
                          </div>
                          <div className="mt-2">
                            <Link
                              href={`/pipeline-monitor/${doc.change_number}`}
                              className="line-clamp-1 text-sm font-medium hover:underline"
                            >
                              {doc.rdc.title}
                            </Link>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{doc.owner.name}</span>
                              <span>•</span>
                              <span>{new Date(doc.created_at).toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              {doc.ci_type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {doc.repository}
                            </Badge>
                            {doc.rdc.key && (
                              <Badge
                                variant="outline"
                                className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs"
                              >
                                {doc.rdc.key}
                              </Badge>
                            )}
                          </div>
                          <div className="mt-3">
                            {doc.current_state.ci_status === "PENDING" && (
                              <div className="flex items-center gap-2 text-xs">
                                <Clock className="h-3.5 w-3.5 text-blue-500" />
                                <span>等待中</span>
                              </div>
                            )}
                            {doc.current_state.ci_status === "RUNNING" && (
                              <div className="flex items-center gap-2 text-xs">
                                <PlayCircle className="h-3.5 w-3.5 text-amber-500" />
                                <span>运行中</span>
                              </div>
                            )}
                            {doc.current_state.ci_status === "SUCCESS" && (
                              <div className="flex items-center gap-2 text-xs">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                <span>构建成功</span>
                              </div>
                            )}
                            {doc.current_state.ci_status === "FAILED" && (
                              <div className="flex items-center gap-2 text-xs">
                                <XCircle className="h-3.5 w-3.5 text-red-500" />
                                <span>构建失败</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    pageSize={pagination.limit}
                    onPageSizeChange={handlePageSizeChange}
                    totalItems={pagination.total}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>流水线列表</CardTitle>
                  <CardDescription>所有 CI/CD 流水线实例</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChangeDocumentTable documents={documents} isLoading={isLoading} />
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    pageSize={pagination.limit}
                    onPageSizeChange={handlePageSizeChange}
                    totalItems={pagination.total}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
