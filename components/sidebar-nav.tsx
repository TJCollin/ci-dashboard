"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  FileText,
  GitPullRequest,
  Home,
  LayoutDashboard,
  PlusCircle,
  Server,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
interface SidebarNavProps {
  children: React.ReactNode
}

export function SidebarNav({ children }: SidebarNavProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    "monitor": true,
  })

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const mainNavItems = [
    {
      title: "主页",
      href: "/",
      icon: Home,
    },
    {
      title: "流水线监控",
      id: "monitor",
      icon: LayoutDashboard,
      submenu: [
        {
          title: "单据监控",
          href: "/pipeline-monitor",
          icon: GitPullRequest,
        },
        {
          title: "任务监控",
          href: "/job-monitor",
          icon: Server,
        },
      ]
    },
    {
      title: "新业务申请",
      href: "/new-application",
      icon: PlusCircle,
    },
    {
      title: "度量与分析",
      href: "/metrics",
      icon: BarChart3,
    },
    {
      title: "资源管理",
      href: "/resources",
      icon: Server,
    },
  ]

  const utilityNavItems = [
    {
      title: "文档",
      href: "/docs",
      icon: FileText,
    },
    {
      title: "设置",
      href: "/settings",
      icon: Settings,
    },
  ]

  return (
    <>
      <TooltipProvider>
        <div
          className={cn(
            "group relative flex h-[calc(100vh-4rem)] flex-col border-r bg-background transition-all duration-300",
            collapsed ? "w-16" : "w-64",
          )}
        >
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="flex-1 py-2">
              <nav className="grid gap-1 px-2">
                {mainNavItems.map((item, index) => {
                  // 检查是否有子菜单
                  if (item.submenu) {
                    return (
                      <Collapsible
                        key={index}
                        open={openMenus[item.id || ""]}
                        onOpenChange={() => !collapsed && toggleMenu(item.id || "")}
                        className={cn("w-full", collapsed && "group/item")}
                      >
                        <div className="flex">
                          <CollapsibleTrigger asChild className="w-full">
                            <Button
                              variant="ghost"
                              className={cn(
                                "flex h-10 w-full items-center justify-start gap-2 rounded-md px-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                                pathname.startsWith(`/${item.id}`) && "bg-accent text-accent-foreground",
                                collapsed && "justify-center px-0",
                              )}
                            >
                              <item.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
                              {!collapsed && (
                                <>
                                  <span className="flex-1 text-left">{item.title}</span>
                                  {openMenus[item.id || ""] ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </>
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        {collapsed ? (
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <div className="flex h-10 items-center justify-center">
                                <item.icon className="h-5 w-5" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="flex flex-col items-start gap-2 p-2">
                              <p className="font-medium">{item.title}</p>
                              <div className="flex flex-col gap-1">
                                {item.submenu.map((subitem, subindex) => (
                                  <Link
                                    key={subindex}
                                    href={subitem.href}
                                    className="flex items-center gap-2 text-sm hover:underline"
                                  >
                                    <subitem.icon className="h-4 w-4" />
                                    {subitem.title}
                                  </Link>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <CollapsibleContent className="ml-6 mt-1 space-y-1">
                            {item.submenu.map((subitem, subindex) => (
                              <Link
                                key={subindex}
                                href={subitem.href}
                                className={cn(
                                  "flex h-8 items-center gap-2 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                                  pathname === subitem.href && "bg-accent/50 text-accent-foreground",
                                )}
                              >
                                <subitem.icon className="h-4 w-4" />
                                {subitem.title}
                              </Link>
                            ))}
                          </CollapsibleContent>
                        )}
                      </Collapsible>
                    )
                  }

                  // 没有子菜单的普通菜单项
                  return (
                    <Tooltip key={index} delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex h-10 items-center rounded-md px-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                            pathname === item.href && "bg-accent text-accent-foreground",
                            collapsed && "justify-center",
                          )}
                        >
                          <item.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-3")} />
                          {!collapsed && <span>{item.title}</span>}
                        </Link>
                      </TooltipTrigger>
                      {collapsed && (
                        <TooltipContent side="right" className="flex items-center gap-4">
                          {item.title}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  )
                })}
              </nav>
              <div className="mt-4">
                <div className={cn("mb-2 px-4 text-xs font-semibold text-muted-foreground", collapsed && "text-center")}>
                  {!collapsed && "工具"}
                </div>
                <nav className="grid gap-1 px-2">
                  {utilityNavItems.map((item, index) => (
                    <Tooltip key={index} delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex h-10 items-center rounded-md px-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                            pathname === item.href && "bg-accent text-accent-foreground",
                            collapsed && "justify-center",
                          )}
                        >
                          <item.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-3")} />
                          {!collapsed && <span>{item.title}</span>}
                        </Link>
                      </TooltipTrigger>
                      {collapsed && (
                        <TooltipContent side="right" className="flex items-center gap-4">
                          {item.title}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ))}
                </nav>
              </div>
            </ScrollArea>
          </div>

          <div className="relative h-16 shrink-0 border-t">
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", collapsed && "absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-background border shadow-sm", !collapsed && "absolute right-4 top-1/2 -translate-y-1/2")}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              <span className="sr-only">切换侧边栏</span>
            </Button>
          </div>
        </div>
      </TooltipProvider>
      <div className="flex-1 overflow-auto  h-[calc(100vh-4rem)] ">{children}</div>
    </>
  )
}
