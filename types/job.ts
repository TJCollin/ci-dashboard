// 定义阶段问题的接口
export interface StageIssue {
  description: string // 该阶段报错的问题描述
  type: string // 该阶段报错的类型
  ai_answer: string // 该阶段的报错的 AI 建议
}

// 定义构建阶段的接口
export interface Stage {
  name: string // 阶段名称
  status: string // 阶段状态
  start_time: Date // 阶段开始时间
  end_time: Date // 阶段结束时间
  logs_url: string // 日志 URL
  issues_found?: number // 发现的问题数（如适用）
  issues?: StageIssue[] // 该阶段报错的问题
}

// 定义构建产物的接口
export interface Artifact {
  name: string // 产物名称
  path: string // 产物路径
  size_bytes: number // 产物大小（字节）
}

// 定义上传信息的接口
export interface Upload {
  url: string // UD 上传 URL
  commit_id: string // UD 上传 commit_id
  apks: {
    // UD 上传 apk 列表
    name: string // UD 上传 apk 名称
  }[]
}

// 定义投票结果的接口
export interface VoteResult {
  type: string // 投票类型
  score: number // 投票分数
}

// 定义 CI 测试任务的主接口
export interface Job {
  _id: string // MongoDB 自动生成的文档 ID
  job_id: string // CI 作业唯一标识符
  change_number: string // 关联的单据号
  patchset: number // 关联的补丁集版本
  commit_id: string // 关联的 commit ID
  job_name: string // Jenkins 作业名称
  job_type: string // 作业类型 (app_ci, system_ci 等)
  build_type: string // 构建类型 (sc_build, as_build，UD、每日构建等)
  build_target: string // 编译目标 (modem, ap, target, zssi, zssitarget 等)
  trigger_type: string // 触发类型 (gerrit_event, scheduled)
  build_num: number // 构建号
  project_id: string // 构建项目 ID（关联）
  project_name: string // 构建项目名称
  node: string // 构建节点
  work_dir: string // 执行目录
  status: string // 构建状态 (SUCCESS, FAILURE 等)
  start_time: Date // 构建开始时间
  end_time: Date // 构建结束时间
  duration_ms: number // 构建持续时间（毫秒）
  vote_result: VoteResult // 投票结果
  stages: Stage[] // 构建阶段详情
  artifacts: Artifact[] // 构建产物
  upload: Upload // UD 上传信息
  job_url: string
}

export default Job
