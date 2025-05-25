import { type NextRequest, NextResponse } from "next/server"
import { generateJobs, filterJobs, paginateJobs } from "@/lib/mock-data/jobs"
import { getCurrentConfig } from "@/lib/config"

export async function GET(request: NextRequest) {
  // 获取查询参数
  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
  const status = searchParams.get("status")
  const repository = searchParams.get("repository")
  const search = searchParams.get("search")

  const config = getCurrentConfig()
  let jobs

  if (config.useMockData) {
    // 使用mock数据
    jobs = generateJobs(30)
  } else {
    // 从真实API获取数据
    const response = await fetch(`${config.baseUrl}/api/jobs?${searchParams.toString()}`)
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status })
    }
    const data = await response.json()
    jobs = data.data
  }

  // 应用过滤条件
  const filteredJobs = filterJobs(jobs, {
    status,
    search,
  })

  // 应用分页
  const result = paginateJobs(filteredJobs, page, limit)

  // 返回结果
  return NextResponse.json({
    data: result.data,
    pagination: result.pagination,
    filters: {
      status,
      repository,
      search,
    },
  })

}
