"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, HelpCircle, LogOut, Settings, User } from "lucide-react"
import { useState } from "react"

interface UserHeaderProps {
  userName?: string
  userEmail?: string
  userAvatar?: string
}

export function UserHeader({ userName = "张三", userEmail = "zhangsan@example.com", userAvatar }: UserHeaderProps) {
  const [unreadNotifications, setUnreadNotifications] = useState(3)

  return (
    <div className="flex items-center gap-2">
      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                {unreadNotifications}
              </span>
            )}
            <span className="sr-only">通知</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[300px]">
          <DropdownMenuLabel>通知</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-[300px] overflow-auto">
            <div className="p-2 text-sm hover:bg-muted rounded-md cursor-pointer">
              <div className="font-medium">新单据已提交</div>
              <div className="text-muted-foreground text-xs">李四提交了新单据 CR-12345</div>
              <div className="text-muted-foreground text-xs mt-1">10分钟前</div>
            </div>
            <div className="p-2 text-sm hover:bg-muted rounded-md cursor-pointer">
              <div className="font-medium">构建失败</div>
              <div className="text-muted-foreground text-xs">单据 CR-12340 构建失败</div>
              <div className="text-muted-foreground text-xs mt-1">30分钟前</div>
            </div>
            <div className="p-2 text-sm hover:bg-muted rounded-md cursor-pointer">
              <div className="font-medium">系统维护通知</div>
              <div className="text-muted-foreground text-xs">系统将于今晚22:00-24:00进行维护</div>
              <div className="text-muted-foreground text-xs mt-1">2小时前</div>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-center text-primary">查看全部通知</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Help */}
      <Button variant="ghost" size="icon">
        <HelpCircle className="h-5 w-5" />
        <span className="sr-only">帮助</span>
      </Button>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar || "/placeholder.svg?height=32&width=32"} alt={userName} />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userName}</p>
              <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>个人信息</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>设置</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>退出登录</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
