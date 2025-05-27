
// 定义测试 APK 的接口
interface TestApk {
  name: string; // APK 名称
  apk_url: string; // APK URL
  depend_name?: string; // 依赖 APK 名称（可选）
  depend_url?: string; // 依赖 APK URL（可选）
}

// 定义测试用例的接口
interface TestCase {
  total: number; // 总测试用例数
  passed: number; // 通过的测试用例数
  failed: number; // 失败的测试用例数
  skipped: number; // 跳过的测试用例数
}

// 定义测试阶段的接口
interface Stage {
  name: string; // 阶段名称
  status: string; // 阶段状态
  duration_ms: number; // 阶段持续时间（毫秒）
  failure_details?: string[]; // 失败详情（可选）
}

// 定义测试结果的接口
interface TestResult {
  name: string; // 测试结果名称
  values: string; // 测试结果数据
}

// 定义投票结果的接口
interface VoteResult {
  type: string; // 投票类型
  score: number; // 投票分数
}

// 定义 CI 测试情况的主接口
interface Test {
  _id: string; // MongoDB 自动生成的文档 ID
  test_id: string; // 测试唯一标识符
  change_number: string; // 关联的单据号
  commit_id: string; // 关联的 commit ID
  patchset: number; // 关联的补丁集版本
  ci_job_id: string; // 关联的 CI 作业 ID
  job_name: string; // 测试 job 名
  build_num: number; // 构建 job 号
  test_type: string; // 测试类型
  status: string; // 测试状态 (PASSED, FAILED 等)
  start_time: Date; // 测试开始时间
  end_time: Date; // 测试结束时间
  duration_ms: number; // 测试持续时间（毫秒）
  project_id: string; // 测试项目 ID（关联）
  project_name: string; // 测试项目名称
  test_apks: TestApk[]; // 测试的 APK 列表
  test_cases: TestCase; // 测试用例统计
  stages: Stage[]; // 测试阶段详情
  logs_url: string; // 测试日志 URL
  vote_result: VoteResult; // 投票结果
  test_ret: TestResult[]; // 测试结果
}

export default Test;