import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { SidebarNav } from "@/components/sidebar-nav"
import { Providers } from "@/app/provider"
import { MainHeader } from "@/components/main-header"
import localFont from 'next/font/local'
import { ThemeProvider } from "@/components/theme-provider"
const inter = localFont({
  src: './fonts/Inter/Inter-Regular.woff2',
})

export const metadata: Metadata = {
  title: "CI 管理系统",
  description: "CI/CD 管理系统仪表盘",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex flex-col h-screen overflow-hidden">
            <MainHeader />
            <div className="flex flex-1 overflow-hidden">
              <SidebarNav>{children}</SidebarNav>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
