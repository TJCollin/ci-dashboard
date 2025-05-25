import type { ProjectStep } from "./projects"

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

// 生成单个步骤
export function generateStep(projectId: string, index: number): ProjectStep {
  const id = `${projectId}-step-${index}`
  const stepNames = ["代码检查", "编译构建", "单元测试", "集成测试", "部署测试环境", "验收测试"]
  const name = stepNames[index % stepNames.length]
  const status = randomStatus()
  const startTime = randomDate(7)
  const duration = randomDuration()
  const endTime =
    status !== "running" && status !== "waiting" && status !== "pending"
      ? new Date(startTime.getTime() + duration * 60 * 1000)
      : undefined

  // 生成10-30条随机日志
  const logCount = Math.floor(Math.random() * 20) + 10
  const logs = generateLogs(logCount, status)

  return {
    id,
    name,
    status,
    startTime,
    endTime,
    duration,
    logs,
  }
}

// 生成多个步骤
export function generateSteps(projectId: string, count = 5): ProjectStep[] {
  return Array.from({ length: count }).map((_, index) => generateStep(projectId, index))
}

// 获取单个步骤通过ID
export function getStepById(projectId: string, stepId: string): ProjectStep | undefined {
  // 生成5个步骤，然后查找匹配的ID
  const steps = generateSteps(projectId, 5)
  return steps.find((step) => step.id === stepId)
}

// 导出一个默认的mock数据集
export const mockSteps = (projectId: string) => generateSteps(projectId, 5)
