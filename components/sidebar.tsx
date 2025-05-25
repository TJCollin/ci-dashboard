"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CpuIcon,
  FileText,
  Home,
  LayoutDashboard,
  PlusCircle,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <div
      className={cn(
        "relative h-full border-r bg-gradient-to-b from-background to-background/80 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center w-full")}>
          <CpuIcon className="h-6 w-6 text-primary" />
          {!collapsed && <span className="text-lg font-semibold">CI 平台</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", collapsed && "absolute -right-4 top-7 z-10 bg-background border shadow-sm")}
          onClick={toggleSidebar}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="space-y-1 py-4">
        <TooltipProvider delayDuration={0}>
          <NavItem
            href="/"
            icon={<Home className="h-5 w-5" />}
            label="主页"
            active={pathname === "/"}
            collapsed={collapsed}
          />
          <NavItem
            href="/pipeline-monitor"
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="流水线监控"
            active={pathname.startsWith("/pipeline-monitor")}
            collapsed={collapsed}
          />
          <NavItem
            href="/new-application"
            icon={<PlusCircle className="h-5 w-5" />}
            label="新业务申请"
            active={pathname.startsWith("/new-application")}
            collapsed={collapsed}
          />
          <NavItem
            href="/metrics"
            icon={<BarChart3 className="h-5 w-5" />}
            label="度量与分析"
            active={pathname.startsWith("/metrics")}
            collapsed={collapsed}
          />
          <NavItem
            href="/resources"
            icon={<FileText className="h-5 w-5" />}
            label="资源管理"
            active={pathname.startsWith("/resources")}
            collapsed={collapsed}
          />
          <NavItem
            href="/settings"
            icon={<Settings className="h-5 w-5" />}
            label="设置"
            active={pathname.startsWith("/settings")}
            collapsed={collapsed}
          />
  
        </TooltipProvider>

      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active: boolean
  collapsed: boolean
}

function NavItem({ href, icon, label, active, collapsed }: NavItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
            collapsed ? "justify-center" : "mx-2",
            active ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <div className={cn("transition-transform", active && "scale-110")}>{icon}</div>
          {!collapsed && <span>{label}</span>}
        </Link>
      </TooltipTrigger>
      {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
    </Tooltip>
  )
}
