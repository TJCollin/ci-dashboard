import { type NextRequest, NextResponse } from "next/server"
import { getProjectById } from "@/lib/mock-data/projects"
import { getCurrentConfig } from "@/lib/config"
import { use } from "react";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string; changeId: string }> }) {
  const {id, changeId} = use(params)
  const config = getCurrentConfig()

  try {
    let project

    if (config.useMockData) {
      // 使用mock数据
      project = getProjectById(id)
    } else {
      // 从真实API获取数据
      const response = await fetch(`${config.baseUrl}/api/projects/${id}`)
      if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status })
      }
      const data = await response.json()
      project = data.data
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
