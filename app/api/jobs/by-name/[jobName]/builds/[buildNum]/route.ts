import { type NextRequest, NextResponse } from "next/server"
import { generateJobs } from "@/lib/mock-data/jobs"
import { getCurrentConfig } from "@/lib/config"

export async function GET(request: NextRequest, { params }: { params: { jobName: string; buildNum: string } }) {
  const jobName = decodeURIComponent(params.jobName)
  const buildNum = Number.parseInt(params.buildNum, 10)

  const config = getCurrentConfig()
  let build

  if (config.useMockData) {
    // 使用mock数据
    const jobs = generateJobs(30)

    // 过滤出指定jobName和buildNum的任务
    build = jobs.find((job) => job.job_name === jobName && job.build_num === buildNum)

    if (!build) {
      // 如果找不到匹配的构建，生成一个模拟构建
      const mockJobs = generateJobs(1)
      build = {
        ...mockJobs[0],
        job_name: jobName,
        build_num: buildNum,
      }
    }
  } else {
    // 从真实API获取数据
    const response = await fetch(`${config.baseUrl}/api/jobs/${encodeURIComponent(jobName)}/builds/${buildNum}`)
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status })
    }
    build = await response.json()
  }

  if (!build) {
    return NextResponse.json({ error: "Build not found" }, { status: 404 })
  }

  // 返回结果
  return NextResponse.json(build)
}
