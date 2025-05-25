import type { Stage, StageIssue, Artifact, Upload, VoteResult } from "@/types/job"
import type Job from "@/types/job"

// 生成随机日期，在指定天数范围内
function randomDate(daysAgo = 30): Date {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo))
  return date
}

// 生成随机状态
function randomStatus(): string {
  const statuses = ["SUCCESS", "FAILURE", "RUNNING", "WAITING", "PENDING", "ABORTED"]
  return statuses[Math.floor(Math.random() * statuses.length)]
}

// 生成随机持续时间（毫秒）
function randomDuration(): number {
  return Math.floor(Math.random() * 3600000) + 300000 // 5-65分钟
}

// 生成随机字符串ID
function randomId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 10)}`
}

// 生成随机阶段问题
function generateStageIssues(count: number): StageIssue[] {
  const issueTypes = ["ERROR", "WARNING", "NOTICE"]
  const descriptions = [
    "编译错误：找不到符号",
    "测试失败：预期结果不匹配",
    "代码风格问题：缺少分号",
    "性能警告：方法执行时间过长",
    "安全警告：使用了不安全的API",
    "依赖冲突：版本不兼容",
    "内存泄漏：资源未释放",
    "线程安全问题：并发访问未同步",
    "网络超时：连接失败",
    "权限不足：无法访问资源",
  ]
  const aiAnswers = [
    "检查变量名是否拼写正确，确保已导入相关包",
    "更新测试用例以匹配新的业务逻辑",
    "添加缺失的分号以符合代码规范",
    "考虑使用异步处理或优化算法复杂度",
    "替换为推荐的安全API或添加适当的安全检查",
    "更新依赖版本或使用兼容性解决方案",
    "在finally块中关闭资源或使用try-with-resources",
    "使用同步机制如锁或原子操作确保线程安全",
    "增加超时时间或添加重试机制",
    "检查权限设置并申请必要的访问权限",
  ]

  return Array.from({ length: count }).map(() => {
    const type = issueTypes[Math.floor(Math.random() * issueTypes.length)]
    const description = descriptions[Math.floor(Math.random() * descriptions.length)]
    const ai_answer = aiAnswers[Math.floor(Math.random() * aiAnswers.length)]

    return {
      type,
      description,
      ai_answer,
    }
  })
}

// 生成随机阶段
function generateStages(count: number): Stage[] {
  const stageNames = [
    "准备环境",
    "代码检查",
    "编译构建",
    "单元测试",
    "集成测试",
    "部署",
    "验证",
    "性能测试",
    "安全扫描",
    "发布",
  ]

  let startTime = randomDate(7)
  const stages: Stage[] = []

  for (let i = 0; i < count; i++) {
    const name = stageNames[i % stageNames.length]
    const status = i === count - 1 && Math.random() > 0.7 ? "RUNNING" : randomStatus()
    const start_time = new Date(startTime)

    // 如果状态是RUNNING、WAITING或PENDING，则没有结束时间
    const isRunning = ["RUNNING", "WAITING", "PENDING"].includes(status)
    const duration = randomDuration()
    const end_time = isRunning ?  new Date(start_time.getTime() + duration) : new Date(start_time.getTime() + duration)

    // 只有失败或警告的阶段才有问题
    const hasIssues = ["FAILURE", "WARNING"].includes(status)
    const issues_found = hasIssues ? Math.floor(Math.random() * 5) + 1 : 0
    const issues = hasIssues ? generateStageIssues(issues_found) : []

    stages.push({
      name,
      status,
      start_time,
      end_time,
      logs_url: `/api/logs/${randomId("log")}`,
      issues_found,
      issues,
    })

    // 更新下一阶段的开始时间
    startTime = new Date(start_time.getTime() + (duration + Math.floor(Math.random() * 300000))) // 添加5分钟内的随机间隔
  }

  return stages
}

// 生成随机构建产物
function generateArtifacts(count: number): Artifact[] {
  const artifactTypes = ["jar", "war", "zip", "tar.gz", "apk", "exe", "dmg", "deb", "rpm", "html", "xml", "json", "txt"]
  const prefixes = ["app", "lib", "core", "ui", "api", "service", "util", "common", "data", "report", "doc"]

  return Array.from({ length: count }).map(() => {
    const type = artifactTypes[Math.floor(Math.random() * artifactTypes.length)]
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const name = `${prefix}-${Math.floor(Math.random() * 1000)}.${type}`
    const size_bytes = Math.floor(Math.random() * 100000000) + 1024 // 1KB-100MB
    const path = `/artifacts/${name}`

    return {
      name,
      path,
      size_bytes,
    }
  })
}

// 生成随机上传信息
function generateUpload(): Upload {
  const url = `https://example.com/upload/${randomId("upload")}`
  const commit_id = Array.from({ length: 40 })
    .map(() => "0123456789abcdef"[Math.floor(Math.random() * 16)])
    .join("")

  const apkCount = Math.floor(Math.random() * 3)
  const apks = Array.from({ length: apkCount }).map((_, i) => ({
    name: `app-${["debug", "release", "profile"][i % 3]}.apk`,
  }))

  return {
    url,
    commit_id,
    apks,
  }
}

// 生成随机投票结果
function generateVoteResult(): VoteResult {
  const types = ["VERIFIED", "CODE_REVIEW", "QA_REVIEW"]
  const scores = [-2, -1, 0, 1, 2]

  return {
    type: types[Math.floor(Math.random() * types.length)],
    score: scores[Math.floor(Math.random() * scores.length)],
  }
}

// 生成单个Job
export function generateJob(index: number): Job {
  const job_id = `job-${10000 + index}`
  const _id = randomId("id")
  const change_number = `${1000 + Math.floor(index / 3)}`
  const patchset = Math.floor(Math.random() * 5) + 1
  const commit_id = Array.from({ length: 40 })
    .map(() => "0123456789abcdef"[Math.floor(Math.random() * 16)])
    .join("")

  const projectNames = [
    "Android主应用",
    "系统核心",
    "UI框架",
    "网络服务",
    "媒体播放器",
    "图片服务",
    "数据同步",
    "安全模块",
  ]
  const projectIds = [
    "android-app-main",
    "system-core",
    "ui-framework",
    "network-service",
    "media-player",
    "image-service",
    "data-sync",
    "security-module",
  ]
  const projectIndex = index % projectIds.length
  const project_id = projectIds[projectIndex]
  const project_name = projectNames[projectIndex]

  const jobTypes = ["build", "test", "deploy", "verify", "release"]
  const job_type = jobTypes[Math.floor(Math.random() * jobTypes.length)]

  const buildTypes = ["debug", "release", "profile", "nightly", "weekly"]
  const build_type = buildTypes[Math.floor(Math.random() * buildTypes.length)]

  const buildTargets = ["production", "staging", "testing", "development"]
  const build_target = buildTargets[Math.floor(Math.random() * buildTargets.length)]

  const triggerTypes = ["manual", "automatic", "scheduled", "webhook", "api"]
  const trigger_type = triggerTypes[Math.floor(Math.random() * triggerTypes.length)]

  const build_num = 1000 + index
  const job_name = `${project_id}-${job_type}-${build_type}`

  const nodes = ["build-node-01", "build-node-02", "test-node-01", "test-node-02", "deploy-node-01"]
  const node = nodes[Math.floor(Math.random() * nodes.length)]

  const work_dir = `/workspace/${project_id}/${job_id}`

  const status = randomStatus()
  const start_time = randomDate(30)
  const isCompleted = !["RUNNING", "WAITING", "PENDING"].includes(status)
  const duration_ms = randomDuration()
  const end_time = isCompleted ? new Date(start_time.getTime() + duration_ms) : new Date(start_time.getTime() + duration_ms)

  const stageCount = Math.floor(Math.random() * 5) + 3 // 3-7个阶段
  const stages = generateStages(stageCount)

  const artifactCount = isCompleted ? Math.floor(Math.random() * 5) + 1 : 0
  const artifacts = generateArtifacts(artifactCount)

  const upload = isCompleted && Math.random() > 0.3 ? generateUpload() : generateUpload()
  const vote_result = isCompleted ? generateVoteResult() : generateVoteResult()
  const job_url = "jobUrl"

  return {
    _id,
    job_id,
    change_number,
    patchset,
    commit_id,
    job_name,
    job_type,
    build_type,
    build_target,
    trigger_type,
    build_num,
    project_id,
    project_name,
    node,
    work_dir,
    status,
    start_time,
    end_time,
    duration_ms,
    vote_result,
    stages,
    artifacts,
    upload,
    job_url
  }
}

// 生成多个Job
export function generateJobs(count = 30): Job[] {
  return Array.from({ length: count }).map((_, index) => generateJob(index))
}

// 根据过滤条件筛选Jobs
export function filterJobs(
  jobs: Job[],
  filters: {
    status?: string | null
    project_id?: string | null
    job_type?: string | null
    build_type?: string | null
    search?: string | null
    change_number?: string | null
  },
): Job[] {
  let filtered = [...jobs]

  if (filters.status) {
    filtered = filtered.filter((job) => job.status === filters.status)
  }

  if (filters.project_id) {
    filtered = filtered.filter((job) => job.project_id === filters.project_id)
  }

  if (filters.job_type) {
    filtered = filtered.filter((job) => job.job_type === filters.job_type)
  }

  if (filters.build_type) {
    filtered = filtered.filter((job) => job.build_type === filters.build_type)
  }

  if (filters.change_number) {
    filtered = filtered.filter((job) => job.change_number === filters.change_number)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      (job) =>
        job.job_id.toLowerCase().includes(searchLower) ||
        job.job_name.toLowerCase().includes(searchLower) ||
        job.project_name.toLowerCase().includes(searchLower) ||
        job.commit_id.toLowerCase().includes(searchLower),
    )
  }

  return filtered
}

// 分页函数
export function paginateJobs(
  jobs: Job[],
  page = 1,
  limit = 10,
): {
  data: Job[]
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
  const totalJobs = jobs.length
  const totalPages = Math.ceil(totalJobs / limit)

  return {
    data: jobs.slice(startIndex, endIndex),
    pagination: {
      total: totalJobs,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  }
}

// 获取单个Job通过ID
export function getJobById(id: string): Job | undefined {
  // 从ID中提取数字部分，确保相同ID总是返回相同的任务
  const match = id.match(/\d+/)
  if (!match) return undefined

  const index = Number.parseInt(match[0]) % 100 // 限制在100个任务内循环
  return generateJob(index)
}

// 根据项目ID和步骤名称获取Job
export function getJobByProjectAndStep(projectId: string, stepName: string): Job | undefined {
  // 将项目ID和步骤名称转换为一个确定性的索引
  const projectHash = projectId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const stepHash = stepName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const combinedHash = (projectHash + stepHash) % 100 // 限制在100个任务内循环

  const job = generateJob(combinedHash)

  // 修改任务以匹配请求的项目ID和步骤
  job.project_id = projectId
  job.project_name = `项目 ${projectId}`

  // 根据步骤名称调整任务类型
  const stepToJobTypeMap: Record<string, string> = {
    模块编译: "module_build",
    模块测试: "module_test",
    全量编译: "full_build",
    全量测试: "full_test",
    构建: "build",
    构建测试: "build_test",
  }

  job.job_type = stepToJobTypeMap[stepName] || job.job_type
  job.job_name = `${projectId}-${job.job_type}`

  return job
}

// 导出一个默认的mock数据集
export const mockJobs = generateJobs(30)
