import { type NextRequest, NextResponse } from "next/server"
import { generateJobs } from "@/lib/mock-data/jobs"
import { getCurrentConfig } from "@/lib/config"

export async function GET(
  request: NextRequest,
  { params }: { params: { jobName: string; buildNum: string; stageName: string } },
) {
  const jobName = decodeURIComponent(params.jobName)
  const buildNum = Number.parseInt(params.buildNum, 10)
  const stageName = decodeURIComponent(params.stageName)

  const config = getCurrentConfig()
  let stage

  if (config.useMockData) {
    // 使用mock数据
    const jobs = generateJobs(30)

    // 过滤出指定jobName和buildNum的任务
    const build = jobs.find((job) => job.job_name === jobName && job.build_num === buildNum)

    if (build) {
      // 查找匹配的阶段
      stage = build.stages.find((s) => s.name === stageName)
    }

    if (!stage) {
      // 如果找不到匹配的阶段，生成一个模拟阶段
      const mockJobs = generateJobs(1)
      if (mockJobs[0].stages && mockJobs[0].stages.length > 0) {
        stage = {
          ...mockJobs[0].stages[0],
          name: stageName,
        }
      }
    }
  } else {
    // 从真实API获取数据
    const response = await fetch(
      `${config.baseUrl}/api/jobs/${encodeURIComponent(jobName)}/builds/${buildNum}/stages/${encodeURIComponent(stageName)}`,
    )
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status })
    }
    stage = await response.json()
  }

  if (!stage) {
    return NextResponse.json({ error: "Stage not found" }, { status: 404 })
  }

  // 返回结果
  return NextResponse.json(stage)
}
