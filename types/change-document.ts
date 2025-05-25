interface Owner {
  id: string // 所有者ID
  name: string // 所有者姓名
  email: string // 所有者邮箱
}

interface Rdc {
  key: string // rdc需求key
  url: string // rdc对应链接
  title: string // rdc名称
}

interface Patchset {
  number: number // 补丁集版本号
  commit_id: string // 对应的commit ID
  created_at: Date // 补丁集创建时间
  status: string // 补丁集状态
}

interface Vote {
  type: string // 投票标签类型
  user: string // 投票人
  time: Date // 投票时间
  mark: number // 投票分数
}

interface TotalCi {
  job_name: string // job名称
  job_type: string // 作业类型(app_ci, system_ci等)
  id: string // ci ID（关联）
  build_num: number // 构建号
  build_ret: string // 构建结果
  job_url: string // job URL
  project_id: string // 项目ID（关联）
  project_name: string // 项目名称
}

interface TotalTest {
  id: string // test ID（关联）
  job_name: string // job名称
  build_num: number // 构建号
  job_url: string // job URL
  build_ret: string // 构建结果
  project_id: string // 项目ID（关联）
  project_name: string // 项目名称
}

interface Summary {
  total_ci_runs: number // CI运行总次数
  total_test_runs: number // 失败的CI运行次数
  latest_ci_job_id: string // 最新CI构建ID
  latest_test_id: string // 最新测试ID
  days_open: number // 单据开放天数
}

interface CurrentState {
  ci_status: string // CI总体状态
  test_status: string // 测试总体状态
}

interface ChangeDocument {
  _id: string // MongoDB自动生成的文档ID
  change_number: string // 单据号，关键标识符
  server: string // Gerrit所属server
  rdc: Rdc // RDC信息
  current_patchset: number // 当前的补丁集版本号
  repository: string // 代码仓库名称
  branch: string // 分支名称
  status: string // 单据状态(ACTIVE, ABANDONED, MERGED等)
  owner: Owner // 所有者信息
  refs_spec: string // refs spec
  topic: string // commit topic
  created_at: Date // 单据创建时间
  updated_at: Date // 单据最后更新时间
  merged_at?: Date // 单据合入时间(如适用)
  patchsets: Patchset[] // 补丁集历史记录
  ci_type: string // CI类型
  current_state: CurrentState // 当前状态
  votes: Vote[] // 单据投票情况
  total_ci: TotalCi[] // CI构建情况
  total_test: TotalTest[] // 测试情况
  summary: Summary // 汇总信息
}

export default ChangeDocument
