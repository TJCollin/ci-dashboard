// 项目类型定义
export interface Project {
  id: string
  name: string
  description: string
  repository: string
  branch: string
  status: string
  lastBuildTime?: Date
  lastBuildStatus?: string
  steps: ProjectStep[]
}

// 项目步骤类型定义
export interface ProjectStep {
  id: string
  name: string
  status: string
  startTime?: Date
  endTime?: Date
  duration?: number
  logs?: string[]
  jobId?: string
}

// 生成随机日期，在指定天数范围内
function randomDate(daysAgo = 30): Date {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo))
  return date
}

// 生成随机状态
function randomStatus(): string {
  const statuses = ["success", "failed", "running", "waiting", "pending"]
  return statuses[Math.floor(Math.random() * statuses.length)]
}

// 生成随机持续时间（分钟）
function randomDuration(): number {
  return Math.floor(Math.random() * 120) + 5
}

// 生成随机日志
function generateLogs(count: number, status: string): string[] {
  const infoLogs = [
    "正在初始化构建环境...",
    "正在拉取代码...",
    "正在安装依赖...",
    "正在编译代码...",
    "正在运行测试...",
    "正在打包应用...",
    "正在部署应用...",
    "正在验证部署...",
    "构建完成",
  ]

  const errorLogs = [
    "错误: 无法连接到代码仓库",
    "错误: 依赖安装失败",
    "错误: 编译错误，详情见日志",
    "错误: 测试失败，有5个用例未通过",
    "错误: 打包失败，缺少必要文件",
    "错误: 部署超时",
    "构建失败",
  ]

  const logs = []

  // 添加时间戳和随机日志
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(Date.now() - (count - i) * 60000).toISOString().replace("T", " ").substring(0, 19)

    if (status === "failed" && i > count * 0.7) {
      // 在失败状态下，后30%的日志是错误日志
      logs.push(`[${timestamp}] ${errorLogs[Math.floor(Math.random() * errorLogs.length)]}`)
    } else {
      logs.push(`[${timestamp}] ${infoLogs[Math.floor(Math.random() * infoLogs.length)]}`)
    }
  }

  return logs
}

// 生成项目步骤
function generateProjectSteps(projectId: string): ProjectStep[] {
  const stepNames = ["模块编译", "模块测试", "全量编译", "全量测试", "构建", "构建测试"]
  const startTime = randomDate(7)

  return stepNames.map((name, index) => {
    const status = randomStatus()
    const duration = randomDuration()
    const stepStartTime = new Date(startTime.getTime() + index * 1000 * 60 * 15) // 每个步骤间隔15分钟
    const stepEndTime =
      status !== "running" && status !== "waiting" && status !== "pending"
        ? new Date(stepStartTime.getTime() + duration * 60 * 1000)
        : undefined

    // 生成10-30条随机日志
    const logCount = Math.floor(Math.random() * 20) + 10
    const logs = generateLogs(logCount, status)

    // 生成关联的任务ID
    const jobId = `job-${projectId}-${index}`

    return {
      id: `${projectId}-step-${index}`,
      name,
      status,
      startTime: stepStartTime,
      endTime: stepEndTime,
      duration: duration,
      logs,
      jobId,
    }
  })
}

// 生成单个项目
export function generateProject(index: number): Project {
  const id = `project-${1000 + index}`
  const repositories = ["android-app-main", "system-core", "ui-framework", "network-service", "media-player"]
  const repository = repositories[index % repositories.length]
  const branches = ["master", "develop", "feature/new-ui", "bugfix/memory-leak", "release/v2.0"]
  const branch = branches[index % branches.length]

  const projectNames = {
    "android-app-main": "Android主应用",
    "system-core": "系统核心",
    "ui-framework": "UI框架",
    "network-service": "网络服务",
    "media-player": "媒体播放器",
  }

  const name = projectNames[repository as keyof typeof projectNames] || repository

  const descriptions = {
    "android-app-main": "Android主应用项目，包含用户界面和业务逻辑",
    "system-core": "系统核心模块，提供底层功能支持",
    "ui-framework": "UI框架项目，提供统一的界面组件",
    "network-service": "网络服务模块，处理网络请求和数据传输",
    "media-player": "媒体播放器模块，支持音视频播放功能",
  }

  const description = descriptions[repository as keyof typeof descriptions] || `${repository}项目描述`

  const status = randomStatus()
  const lastBuildTime = randomDate(3)

  // 生成6个固定步骤
  const steps = generateProjectSteps(id)

  // 项目的最后构建状态取决于步骤的状态
  const failedSteps = steps.filter((step) => step.status === "failed")
  const runningSteps = steps.filter(
    (step) => step.status === "running" || step.status === "waiting" || step.status === "pending",
  )

  let lastBuildStatus
  if (failedSteps.length > 0) {
    lastBuildStatus = "failed"
  } else if (runningSteps.length > 0) {
    lastBuildStatus = "running"
  } else {
    lastBuildStatus = "success"
  }

  return {
    id,
    name,
    description,
    repository,
    branch,
    status,
    lastBuildTime,
    lastBuildStatus,
    steps,
  }
}

// 生成多个项目
export function generateProjects(count = 3): Project[] {
  return Array.from({ length: count }).map((_, index) => generateProject(index))
}

// 根据过滤条件筛选项目
export function filterProjects(
  projects: Project[],
  filters: {
    status?: string | null
    repository?: string | null
    search?: string | null
  },
): Project[] {
  let filtered = [...projects]

  if (filters.status) {
    filtered = filtered.filter((project) => project.status === filters.status)
  }

  if (filters.repository) {
    filtered = filtered.filter((project) => project.repository === filters.repository)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      (project) =>
        project.id.toLowerCase().includes(searchLower) ||
        project.name.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower),
    )
  }

  return filtered
}

// 获取单个项目通过ID
export function getProjectById(id: string): Project | undefined {
  // 生成3个项目，然后查找匹配的ID
  const projects = generateProjects(3)
  return projects.find((project) => project.id === id)
}

// 获取项目中的步骤通过步骤名称
export function getProjectStep(projectId: string, stepName: string, changeId: string): ProjectStep | undefined {
  const project = getProjectById(projectId)
  if (!project) return undefined

  return project.steps.find(
    (step) => step.name.toLowerCase() === stepName.toLowerCase() || step.id.toLowerCase() === stepName.toLowerCase(),
  )
}

// 导出一个默认的mock数据集
export const mockProjects = (changeId: string) => generateProjects(3)
