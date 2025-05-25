import { type NextRequest, NextResponse } from "next/server"
import { mockProjects } from "@/lib/mock-data/projects"
import { getCurrentConfig } from "@/lib/config"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const changeId = params.id
  const config = getCurrentConfig()

  try {
    let projects

    if (config.useMockData) {
      // 使用mock数据
      projects = mockProjects(changeId)
    } else {
      // 从真实API获取数据
      const response = await fetch(`${config.baseUrl}/api/change-documents/${changeId}/projects`)
      if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status })
      }
      const data = await response.json()
      projects = data.data
    }

    if (!projects) {
      return NextResponse.json({ error: "Projects not found" }, { status: 404 })
    }

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
