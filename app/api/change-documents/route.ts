import { type NextRequest, NextResponse } from "next/server"
import {
  generateChangeDocuments,
  filterChangeDocuments,
  paginateChangeDocuments,
} from "@/lib/mock-data/change-documents"
import { getCurrentConfig } from "@/lib/config"

export async function GET(request: NextRequest) {
  // 获取查询参数
  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
  const status = searchParams.get("status")
  const ciType = searchParams.get("ciType")
  const repository = searchParams.get("repository")
  const search = searchParams.get("search")
  const ciStatus = searchParams.get("ciStatus")

  const config = getCurrentConfig()
  let documents

  if (config.useMockData) {
    // 使用mock数据
    documents = generateChangeDocuments(50)
  } else {
    // 从真实API获取数据
    const response = await fetch(`${config.baseUrl}/api/change-documents?${searchParams.toString()}`)
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status })
    }
    const data = await response.json()
    documents = data.data
  }

  // 应用过滤条件
  const filteredDocuments = filterChangeDocuments(documents, {
    status,
    ciType,
    repository,
    search,
    ciStatus,
  })

  // 应用分页
  const result = paginateChangeDocuments(filteredDocuments, page, limit)

  // 返回结果
  return NextResponse.json({
    data: result.data,
    pagination: result.pagination,
    filters: {
      status,
      ciType,
      repository,
      search,
      ciStatus,
    },
  })
}
