import { type NextRequest, NextResponse } from "next/server"
import { generateJobs, filterJobs, paginateJobs } from "@/lib/mock-data/jobs"
import { getCurrentConfig } from "@/lib/config"

export async function GET(request: NextRequest, { params }: { params: { jobName: string } }) {
  const jobName = decodeURIComponent(params.jobName)

  // 获取查询参数
  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
  const status = searchParams.get("status")

  const config = getCurrentConfig()
  let jobs

  if (config.useMockData) {
    // 使用mock数据
    jobs = generateJobs(30)
    // console.log("jobs", jobs)

    // 过滤出指定jobName的任务
    jobs = jobs.filter((job) => job.job_name === jobName)

    // 按构建号降序排序
    jobs.sort((a, b) => b.build_num - a.build_num)
  } else {
    // 从真实API获取数据
    const response = await fetch(
      `${config.baseUrl}/api/jobs/${encodeURIComponent(jobName)}/builds?${searchParams.toString()}`,
    )
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status })
    }
    const data = await response.json()
    jobs = data.data
  }

  // 应用过滤条件
  const filteredJobs = filterJobs(jobs, {
    status,
  })

  console.log("filteredJobs", filteredJobs, jobs)

  // 应用分页
  const result = paginateJobs(jobs, page, limit)
  console.log("result", result)
  

  // 返回结果
  return NextResponse.json({
    data: result.data,
    pagination: result.pagination,
    filters: {
      status,
    },
  })
}
