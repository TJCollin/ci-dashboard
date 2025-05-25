import type ChangeDocument from "@/types/change-document"

// 生成随机日期，在指定天数范围内
function randomDate(daysAgo = 30): Date {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo))
  return date
}

// 生成随机状态
function randomStatus(): string {
  const statuses = ["SUCCESS", "FAILED", "RUNNING", "PENDING"]
  return statuses[Math.floor(Math.random() * statuses.length)]
}

// 生成单个变更单据
export function generateChangeDocument(index: number): ChangeDocument {
  const changeNumber = `${1000 + index}`
  const createdAt = randomDate(30)
  const updatedAt = new Date(createdAt.getTime() + Math.random() * 1000 * 60 * 60 * 24 * 5) // 0-5天后
  const mergedAt =
    Math.random() > 0.7 ? new Date(updatedAt.getTime() + Math.random() * 1000 * 60 * 60 * 24 * 3) : undefined // 70%的概率有合入时间

  const repositories = ["android-app-main", "system-core", "ui-framework", "network-service", "media-player"]
  const repository = repositories[index % repositories.length]

  const branches = ["master", "develop", "feature/new-ui", "bugfix/memory-leak", "release/v2.0"]
  const branch = branches[index % branches.length]

  const ciStatus = randomStatus()
  const testStatus = randomStatus()

  // 生成补丁集
  const patchsetCount = Math.floor(Math.random() * 5) + 1 // 1-5个补丁集
  const patchsets = Array.from({ length: patchsetCount }).map((_, i) => {
    const patchsetCreatedAt = new Date(createdAt.getTime() + i * 1000 * 60 * 60 * 12) // 每个补丁集间隔12小时
    return {
      number: i + 1,
      commit_id: `commit-${changeNumber}-${i + 1}`,
      created_at: patchsetCreatedAt,
      status: i === patchsetCount - 1 ? "ACTIVE" : "SUPERSEDED",
    }
  })

  // 生成投票
  const voteCount = Math.floor(Math.random() * 3) + 1 // 1-3个投票
  const votes = Array.from({ length: voteCount }).map((_, i) => {
    const voteTime = new Date(updatedAt.getTime() - (voteCount - i) * 1000 * 60 * 60) // 投票时间递增
    return {
      type: ["Code-Review", "Verified", "QA-Review"][i % 3],
      user: ["张三", "李四", "王五", "赵六"][Math.floor(Math.random() * 4)],
      time: voteTime,
      mark: Math.floor(Math.random() * 3) - 1, // -1, 0, 1
    }
  })

  // 生成CI任务
  const ciCount = Math.floor(Math.random() * 3) + 1 // 1-3个CI任务
  const totalCi = Array.from({ length: ciCount }).map((_, i) => {
    return {
      job_name: `${repository}-ci-${i + 1}`,
      job_type: ["app_ci", "system_ci", "integration_ci"][i % 3],
      id: `ci-${changeNumber}-${i + 1}`,
      build_num: 1000 + i,
      build_ret: randomStatus(),
      job_url: `https://jenkins.example.com/job/${repository}-ci-${i + 1}/${1000 + i}/`,
      project_id: `project-${1000 + i}`,
      project_name: `${repository} 项目`,
    }
  })

  // 生成测试任务
  const testCount = Math.floor(Math.random() * 2) + 1 // 1-2个测试任务
  const totalTest = Array.from({ length: testCount }).map((_, i) => {
    return {
      id: `test-${changeNumber}-${i + 1}`,
      job_name: `${repository}-test-${i + 1}`,
      build_num: 2000 + i,
      job_url: `https://jenkins.example.com/job/${repository}-test-${i + 1}/${2000 + i}/`,
      build_ret: randomStatus(),
      project_id: `project-${1000 + i}`,
      project_name: `${repository} 项目`,
    }
  })

  // 计算单据开放天数
  const daysOpen = Math.ceil((new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))

  return {
    _id: `doc-${changeNumber}`,
    change_number: changeNumber,
    server: "gerrit.example.com",
    rdc: {
      key: `RDC-${1000 + Math.floor(Math.random() * 1000)}`,
      url: `https://rdc.example.com/issues/RDC-${1000 + Math.floor(Math.random() * 1000)}`,
      title: `[${repository}] 修复${branch}分支上的问题 #${changeNumber}`,
    },
    current_patchset: patchsetCount,
    repository,
    branch,
    status: mergedAt ? "MERGED" : Math.random() > 0.9 ? "ABANDONED" : "ACTIVE",
    owner: {
      id: `user-${100 + (index % 10)}`,
      name: ["张三", "李四", "王五", "赵六", "钱七"][index % 5],
      email: `user${100 + (index % 10)}@example.com`,
    },
    refs_spec: `refs/changes/${changeNumber.slice(-2)}/${changeNumber}/${patchsetCount}`,
    topic: Math.random() > 0.5 ? `topic-${Math.floor(Math.random() * 100)}` : "",
    created_at: createdAt,
    updated_at: updatedAt,
    merged_at: mergedAt,
    patchsets,
    ci_type: ["app_ci", "system_ci", "integration_ci"][index % 3],
    current_state: {
      ci_status: ciStatus,
      test_status: testStatus,
    },
    votes,
    total_ci: totalCi,
    total_test: totalTest,
    summary: {
      total_ci_runs: ciCount,
      total_test_runs: testCount,
      latest_ci_job_id: totalCi.length > 0 ? totalCi[0].id : "",
      latest_test_id: totalTest.length > 0 ? totalTest[0].id : "",
      days_open: daysOpen,
    },
  }
}

// 生成多个变更单据
export function generateChangeDocuments(count = 10): ChangeDocument[] {
  return Array.from({ length: count }).map((_, index) => generateChangeDocument(index))
}

// 根据过滤条件筛选变更单据
export function filterChangeDocuments(
  documents: ChangeDocument[],
  filters: {
    status?: string | null
    ciType?: string | null
    repository?: string | null
    search?: string | null
    ciStatus?: string | null
  },
): ChangeDocument[] {
  let filtered = [...documents]

  if (filters.status) {
    filtered = filtered.filter((doc) => doc.status === filters.status)
  }

  if (filters.ciType) {
    filtered = filtered.filter((doc) => doc.ci_type === filters.ciType)
  }

  if (filters.repository) {
    filtered = filtered.filter((doc) => doc.repository === filters.repository)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      (doc) =>
        doc._id.toLowerCase().includes(searchLower) ||
        doc.change_number.toLowerCase().includes(searchLower) ||
        doc.rdc.title.toLowerCase().includes(searchLower) ||
        doc.owner.name.toLowerCase().includes(searchLower),
    )
  }

  if (filters.ciStatus) {
    filtered = filtered.filter((doc) => doc.current_state.ci_status === filters.ciStatus)
  }

  return filtered
}

// 分页函数
export function paginateChangeDocuments(
  documents: ChangeDocument[],
  page = 1,
  limit = 10,
): {
  data: ChangeDocument[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
} {
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const totalDocuments = documents.length
  const totalPages = Math.ceil(totalDocuments / limit)

  return {
    data: documents.slice(startIndex, endIndex),
    pagination: {
      total: totalDocuments,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  }
}

// 根据ID获取单个变更单据
export function getChangeDocumentById(id: string): ChangeDocument | undefined {
  // 生成10个单据，然后查找匹配的ID
  const documents = generateChangeDocuments(10)
  return documents.find((doc) => doc._id === id || doc.change_number === id)
}

// 导出一个默认的mock数据集
export const mockChangeDocuments = generateChangeDocuments(10)
