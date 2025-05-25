// 环境配置
export const config = {
  development: {
    baseUrl: 'http://localhost:3000',
    useMockData: true
  },
  production: {
    baseUrl: 'https://api.devops.example.com',
    useMockData: false
  }
}

// 获取当前环境
export const getEnvironment = () => {
  return process.env.NODE_ENV || 'development'
}

// 获取当前环境的配置
export const getCurrentConfig = () => {
  const env = getEnvironment()
  return config[env as keyof typeof config]
}