"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, ChevronDown, ChevronUp, Clock, Filter, Search, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"

// 模拟项目健康度数据
const projectsData = [
  {
    id: 1,
    name: "android-app-main",
    type: "App CI",
    successRate: 94.5,
    avgDuration: "12:24",
    lastBuild: "成功",
    lastBuildTime: "1小时前",
    codeQuality: 92,
    testCoverage: 87,
    healthScore: 90,
  },
  {
    id: 2,
    name: "system-core-module",
    type: "系统 CI",
    successRate: 89.2,
    avgDuration: "28:45",
    lastBuild: "成功",
    lastBuildTime: "3小时前",
    codeQuality: 88,
    testCoverage: 82,
    healthScore: 86,
  },
  {
    id: 3,
    name: "ui-components",
    type: "App CI",
    successRate: 97.8,
    avgDuration: "08:12",
    lastBuild: "成功",
    lastBuildTime: "2小时前",
    codeQuality: 95,
    testCoverage: 90,
    healthScore: 94,
  },
  {
    id: 4,
    name: "network-service",
    type: "系统 CI",
    successRate: 91.3,
    avgDuration: "18:36",
    lastBuild: "失败",
    lastBuildTime: "30分钟前",
    codeQuality: 84,
    testCoverage: 78,
    healthScore: 82,
  },
  {
    id: 5,
    name: "media-player",
    type: "App CI",
    successRate: 93.7,
    avgDuration: "15:18",
    lastBuild: "运行中",
    lastBuildTime: "正在进行",
    codeQuality: 90,
    testCoverage: 85,
    healthScore: 88,
  },
  {
    id: 6,
    name: "data-storage",
    type: "系统 CI",
    successRate: 96.2,
    avgDuration: "22:05",
    lastBuild: "成功",
    lastBuildTime: "5小时前",
    codeQuality: 93,
    testCoverage: 88,
    healthScore: 92,
  },
  {
    id: 7,
    name: "security-module",
    type: "系统 CI",
    successRate: 98.1,
    avgDuration: "19:42",
    lastBuild: "成功",
    lastBuildTime: "1天前",
    codeQuality: 96,
    testCoverage: 92,
    healthScore: 95,
  },
]

export function ProjectHealthTable() {
  const [sortField, setSortField] = useState("healthScore")
  const [sortDirection, setSortDirection] = useState("desc")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sortedProjects = [...projectsData]
    .filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.type.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      } else {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
    })

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索项目..."
            className="w-full rounded-md pl-8 md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Filter className="h-4 w-4 mr-1" />
          筛选
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left font-medium p-2 pl-0 cursor-pointer" onClick={() => handleSort("name")}>
                <div className="flex items-center">
                  项目名称
                  {sortField === "name" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </th>
              <th className="text-left font-medium p-2">CI 类型</th>
              <th className="text-left font-medium p-2 cursor-pointer" onClick={() => handleSort("successRate")}>
                <div className="flex items-center">
                  成功率
                  {sortField === "successRate" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </th>
              <th className="text-left font-medium p-2 cursor-pointer" onClick={() => handleSort("avgDuration")}>
                <div className="flex items-center">
                  平均时长
                  {sortField === "avgDuration" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </th>
              <th className="text-left font-medium p-2">最近构建</th>
              <th className="text-left font-medium p-2 cursor-pointer" onClick={() => handleSort("codeQuality")}>
                <div className="flex items-center">
                  代码质量
                  {sortField === "codeQuality" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </th>
              <th className="text-left font-medium p-2 cursor-pointer" onClick={() => handleSort("testCoverage")}>
                <div className="flex items-center">
                  测试覆盖率
                  {sortField === "testCoverage" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </th>
              <th className="text-left font-medium p-2 cursor-pointer" onClick={() => handleSort("healthScore")}>
                <div className="flex items-center">
                  健康评分
                  {sortField === "healthScore" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProjects.map((project) => (
              <tr key={project.id} className="border-b">
                <td className="p-2 pl-0 font-medium">{project.name}</td>
                <td className="p-2">
                  <Badge variant="outline">{project.type}</Badge>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <span>{project.successRate}%</span>
                    <Progress value={project.successRate} className="h-1.5 w-16" />
                  </div>
                </td>
                <td className="p-2">{project.avgDuration}</td>
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    {project.lastBuild === "成功" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    {project.lastBuild === "失败" && <XCircle className="h-4 w-4 text-red-500" />}
                    {project.lastBuild === "运行中" && <Clock className="h-4 w-4 text-amber-500" />}
                    <span>{project.lastBuild}</span>
                    <span className="text-muted-foreground">({project.lastBuildTime})</span>
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <span>{project.codeQuality}/100</span>
                    <Progress value={project.codeQuality} className="h-1.5 w-16" />
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <span>{project.testCoverage}%</span>
                    <Progress value={project.testCoverage} className="h-1.5 w-16" />
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        project.healthScore >= 90
                          ? "text-green-500"
                          : project.healthScore >= 80
                            ? "text-amber-500"
                            : "text-red-500"
                      }
                    >
                      {project.healthScore}/100
                    </span>
                    <Progress
                      value={project.healthScore}
                      className={`h-1.5 w-16 ${
                        project.healthScore >= 90
                          ? "bg-green-100"
                          : project.healthScore >= 80
                            ? "bg-amber-100"
                            : "bg-red-100"
                      }`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
