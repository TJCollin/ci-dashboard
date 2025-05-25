"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Search, Server } from "lucide-react"
import { Pagination } from "@/components/pagination"
import { JobTable } from "@/components/job-monitor/job-table"
import type Job from "@/types/job"

export default function JobMonitorPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [jobTypeFilter, setJobTypeFilter] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch jobs data
  useEffect(() => {
    const fetchJobs = async () => {
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

        if (jobTypeFilter) {
          queryParams.append("job_type", jobTypeFilter)
        }

        const response = await fetch(`/api/jobs?${queryParams.toString()}`)
        const data = await response.json()
        console.log("data", data.data)

        setJobs(data.data)
        setPagination({
          ...pagination,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        })
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [pagination.page, pagination.limit, debouncedSearchTerm, statusFilter, jobTypeFilter])

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

  const handleJobTypeFilterChange = (value: string) => {
    setJobTypeFilter(value === "all" ? null : value)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setDebouncedSearchTerm("")
    setStatusFilter(null)
    setJobTypeFilter(null)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">任务监控</h1>
          <p className="text-muted-foreground">查看和管理所有CI/CD任务</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="mr-2 h-5 w-5 text-primary" />
              任务列表
            </CardTitle>
            <CardDescription>所有CI/CD任务及其状态</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="搜索任务..."
                    className="w-full rounded-md pl-8 md:w-[300px]"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">筛选</span>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Select value={statusFilter || "all"} onValueChange={handleStatusFilterChange}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有状态</SelectItem>
                    <SelectItem value="SUCCESS">成功</SelectItem>
                    <SelectItem value="FAILURE">失败</SelectItem>
                    <SelectItem value="RUNNING">运行中</SelectItem>
                    <SelectItem value="PENDING">等待中</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={jobTypeFilter || "all"} onValueChange={handleJobTypeFilterChange}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="任务类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有类型</SelectItem>
                    <SelectItem value="app_ci">App CI</SelectItem>
                    <SelectItem value="system_ci">系统 CI</SelectItem>
                    <SelectItem value="integration_ci">集成 CI</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  清除筛选
                </Button>
              </div>
            </div>

            <JobTable jobs={jobs} isLoading={isLoading} />

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
      </main>
    </div>
  )
}
