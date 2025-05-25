import { type NextRequest, NextResponse } from "next/server"
import { getJobById } from "@/lib/mock-data/jobs"
import { getCurrentConfig } from "@/lib/config"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const config = getCurrentConfig()

  try {
    let job

    if (config.useMockData) {
      // 使用mock数据
      job = getJobById(id)
    } else {
      // 从真实API获取数据
      const response = await fetch(`${config.baseUrl}/api/jobs/${id}`)
      if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status })
      }
      const data = await response.json()
      job = data.data
    }

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
