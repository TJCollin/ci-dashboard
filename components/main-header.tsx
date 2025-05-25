"use client"

import { UserHeader } from "@/components/user-header"
import { Code2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MainHeader() {
  const pathname = usePathname()

  // 根据当前路径获取页面标题
  const getPageTitle = () => {
    switch (true) {
      case pathname === "/":
        return "仪表盘"
      case pathname === "/new-application":
        return "新业务申请"
      case pathname.startsWith("/pipeline-monitor"):
        return "CI 流水线监控"
      case pathname === "/metrics":
        return "度量与分析"
      case pathname === "/resources":
        return "资源管理"
      case pathname === "/settings":
        return "设置"
      default:
        return ""
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Code2 className="h-6 w-6" />
            <span className="hidden md:inline-block">CI 管理系统</span>
          </Link>
          {getPageTitle() && <h1 className="text-xl font-semibold hidden md:block">{getPageTitle()}</h1>}
        </div>
        <UserHeader />
      </div>
    </header>
  )
}
