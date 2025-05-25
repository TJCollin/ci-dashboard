import { type NextRequest, NextResponse } from "next/server"
import { generateProjects, filterProjects } from "@/lib/mock-data/projects"
import { getCurrentConfig } from "@/lib/config"

export async function GET(request: NextRequest) {
  // 获取查询参数
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get("status")
  const repository = searchParams.get("repository")
  const search = searchParams.get("search")

  const config = getCurrentConfig()
  let projects

  if (config.useMockData) {
    // 使用mock数据
    projects = generateProjects(10)
  } else {
    // 从真实API获取数据
    const response = await fetch(`${config.baseUrl}/api/projects?${searchParams.toString()}`)
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status })
    }
    const data = await response.json()
    projects = data.data
  }

  // 应用过滤条件
  const filteredProjects = filterProjects(projects, {
    status,
    repository,
    search,
  })

  // 返回结果
  return NextResponse.json({
    data: filteredProjects,
    filters: {
      status,
      repository,
      search,
    },
  })

}
