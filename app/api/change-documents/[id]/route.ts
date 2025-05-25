import { type NextRequest, NextResponse } from "next/server"
import { getChangeDocumentById } from "@/lib/mock-data/change-documents"
import { getCurrentConfig } from "@/lib/config"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const config = getCurrentConfig()

  try {
    let changeDocument

    if (config.useMockData) {
      // 使用mock数据
      changeDocument = getChangeDocumentById(id)
    } else {
      // 从真实API获取数据
      const response = await fetch(`${config.baseUrl}/api/change-documents/${id}`)
      if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status })
      }
      const data = await response.json()
      changeDocument = data.data
    }

    if (!changeDocument) {
      return NextResponse.json({ error: "Change document not found" }, { status: 404 })
    }

    return NextResponse.json(changeDocument)
  } catch (error) {
    console.error("Error fetching change document:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
