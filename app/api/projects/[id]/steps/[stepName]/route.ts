import { type NextRequest, NextResponse } from "next/server"
import { getProjectStep } from "@/lib/mock-data/projects"
import { getCurrentConfig } from "@/lib/config"

export async function GET(request: NextRequest, { params }: { params: { id: string; stepName: string; changeId: string } }) {
  const { id, stepName, changeId } = params
  const config = getCurrentConfig()

  try {
    let step

    if (config.useMockData) {
      // 使用mock数据
      step = getProjectStep(id, stepName, changeId)
    } else {
      // 从真实API获取数据
      const response = await fetch(`${config.baseUrl}/api/projects/${id}/steps/${stepName}?changeId=${changeId}`)
      if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status })
      }
      const data = await response.json()
      step = data.data
    }

    if (!step) {
      return NextResponse.json({ error: "Step not found" }, { status: 404 })
    }

    return NextResponse.json(step)
  } catch (error) {
    console.error("Error fetching project step:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
