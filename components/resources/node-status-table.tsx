"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Power,
  RefreshCw,
  Settings,
  Wrench,
  XCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// 模拟节点数据
const nodesData = [
  {
    id: "worker-01",
    name: "Worker 01",
    type: "App CI",
    status: "online",
    ip: "192.168.1.101",
    cpuUsage: 65,
    memoryUsage: 72,
    diskUsage: 48,
    uptime: "45天12小时",
    lastSeen: "刚刚",
    jobs: 8,
  },
  {
    id: "worker-02",
    name: "Worker 02",
    type: "App CI",
    status: "online",
    ip: "192.168.1.102",
    cpuUsage: 78,
    memoryUsage: 85,
    diskUsage: 52,
    uptime: "30天8小时",
    lastSeen: "刚刚",
    jobs: 12,
  },
  {
    id: "worker-03",
    name: "Worker 03",
    type: "系统 CI",
    status: "warning",
    ip: "192.168.1.103",
    cpuUsage: 92,
    memoryUsage: 88,
    diskUsage: 65,
    uptime: "15天3小时",
    lastSeen: "刚刚",
    jobs: 6,
  },
  {
    id: "worker-04",
    name: "Worker 04",
    type: "系统 CI",
    status: "maintenance",
    ip: "192.168.1.104",
    cpuUsage: 5,
    memoryUsage: 10,
    diskUsage: 45,
    uptime: "2小时",
    lastSeen: "刚刚",
    jobs: 0,
  },
  {
    id: "worker-05",
    name: "Worker 05",
    type: "App CI",
    status: "offline",
    ip: "192.168.1.105",
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 42,
    uptime: "0",
    lastSeen: "30分钟前",
    jobs: 0,
  },
  {
    id: "worker-06",
    name: "Worker 06",
    type: "系统 CI",
    status: "online",
    ip: "192.168.1.106",
    cpuUsage: 45,
    memoryUsage: 60,
    diskUsage: 38,
    uptime: "60天4小时",
    lastSeen: "刚刚",
    jobs: 4,
  },
  {
    id: "worker-07",
    name: "Worker 07",
    type: "App CI",
    status: "online",
    ip: "192.168.1.107",
    cpuUsage: 55,
    memoryUsage: 48,
    diskUsage: 30,
    uptime: "25天16小时",
    lastSeen: "刚刚",
    jobs: 7,
  },
]

export function NodeStatusTable() {
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedNodes = [...nodesData].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    } else {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }
  })

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left font-medium p-2 pl-0 cursor-pointer" onClick={() => handleSort("name")}>
              <div className="flex items-center">
                节点名称
                {sortField === "name" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </th>
            <th className="text-left font-medium p-2">类型</th>
            <th className="text-left font-medium p-2">状态</th>
            <th className="text-left font-medium p-2">IP 地址</th>
            <th className="text-left font-medium p-2 cursor-pointer" onClick={() => handleSort("cpuUsage")}>
              <div className="flex items-center">
                CPU
                {sortField === "cpuUsage" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </th>
            <th className="text-left font-medium p-2 cursor-pointer" onClick={() => handleSort("memoryUsage")}>
              <div className="flex items-center">
                内存
                {sortField === "memoryUsage" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </th>
            <th className="text-left font-medium p-2 cursor-pointer" onClick={() => handleSort("diskUsage")}>
              <div className="flex items-center">
                磁盘
                {sortField === "diskUsage" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </th>
            <th className="text-left font-medium p-2">运行时间</th>
            <th className="text-left font-medium p-2 cursor-pointer" onClick={() => handleSort("jobs")}>
              <div className="flex items-center">
                任务数
                {sortField === "jobs" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </div>
            </th>
            <th className="text-left font-medium p-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {sortedNodes.map((node) => (
            <tr key={node.id} className="border-b">
              <td className="p-2 pl-0 font-medium">{node.name}</td>
              <td className="p-2">
                <Badge variant="outline">{node.type}</Badge>
              </td>
              <td className="p-2">
                {node.status === "online" && (
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    在线
                  </Badge>
                )}
                {node.status === "offline" && (
                  <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                    <XCircle className="mr-1 h-3 w-3" />
                    离线
                  </Badge>
                )}
                {node.status === "warning" && (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    警告
                  </Badge>
                )}
                {node.status === "maintenance" && (
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                    <Wrench className="mr-1 h-3 w-3" />
                    维护中
                  </Badge>
                )}
              </td>
              <td className="p-2">{node.ip}</td>
              <td className="p-2">
                <div className="flex items-center gap-2">
                  <Progress
                    value={node.cpuUsage}
                    className={`h-1.5 w-16 ${
                      node.cpuUsage > 90 ? "bg-red-100" : node.cpuUsage > 70 ? "bg-amber-100" : "bg-green-100"
                    }`}
                  />
                  <span className="text-xs">{node.cpuUsage}%</span>
                </div>
              </td>
              <td className="p-2">
                <div className="flex items-center gap-2">
                  <Progress
                    value={node.memoryUsage}
                    className={`h-1.5 w-16 ${
                      node.memoryUsage > 90 ? "bg-red-100" : node.memoryUsage > 70 ? "bg-amber-100" : "bg-green-100"
                    }`}
                  />
                  <span className="text-xs">{node.memoryUsage}%</span>
                </div>
              </td>
              <td className="p-2">
                <div className="flex items-center gap-2">
                  <Progress
                    value={node.diskUsage}
                    className={`h-1.5 w-16 ${
                      node.diskUsage > 90 ? "bg-red-100" : node.diskUsage > 70 ? "bg-amber-100" : "bg-green-100"
                    }`}
                  />
                  <span className="text-xs">{node.diskUsage}%</span>
                </div>
              </td>
              <td className="p-2">
                <div className="flex flex-col">
                  <span>{node.uptime}</span>
                  <span className="text-xs text-muted-foreground">最后活动: {node.lastSeen}</span>
                </div>
              </td>
              <td className="p-2">{node.jobs}</td>
              <td className="p-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">操作菜单</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>节点操作</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>配置</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      <span>重启</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Power className="mr-2 h-4 w-4" />
                      <span>关闭</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Wrench className="mr-2 h-4 w-4" />
                      <span>维护模式</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">
                      <XCircle className="mr-2 h-4 w-4" />
                      <span>移除节点</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
