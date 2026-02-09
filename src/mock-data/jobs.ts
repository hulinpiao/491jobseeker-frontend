import type { Job } from '@/types/job'

export const mockJobs: Job[] = [
  {
    id: '1',
    title: '高级前端工程师',
    company: 'ByteDance',
    location: '北京',
    salary: { min: 35000, max: 55000, currency: 'CNY', period: 'month' },
    type: 'full-time',
    status: 'active',
    description: '负责抖音核心业务的前端开发，使用 React 和 TypeScript。',
    requirements: ['5年以上前端经验', '精通 React 和 TypeScript', '有大型项目经验'],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    url: 'https://example.com/job/1',
    source: 'boss',
  },
  {
    id: '2',
    title: '后端开发工程师',
    company: 'Alibaba',
    location: '杭州',
    salary: { min: 30000, max: 50000, currency: 'CNY', period: 'month' },
    type: 'full-time',
    status: 'applied',
    description: '负责电商平台后端服务开发，使用 Java 和 Spring Cloud。',
    requirements: ['3年以上 Java 开发经验', '熟悉 Spring Cloud', '有高并发经验'],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    url: 'https://example.com/job/2',
    source: 'lagou',
  },
  {
    id: '3',
    title: '算法工程师',
    company: 'Tencent',
    location: '深圳',
    salary: { min: 40000, max: 70000, currency: 'CNY', period: 'month' },
    type: 'full-time',
    status: 'active',
    description: '负责推荐算法研发，优化推荐效果。',
    requirements: ['硕士及以上学历', '熟悉机器学习算法', '有推荐系统经验优先'],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    url: 'https://example.com/job/3',
    source: 'boss',
  },
  {
    id: '4',
    title: 'React 开发实习生',
    company: 'Meituan',
    location: '北京',
    salary: { min: 200, max: 300, currency: 'CNY', period: 'day' },
    type: 'internship',
    status: 'active',
    description: '参与外卖平台前端开发，学习最佳实践。',
    requirements: ['本科在读', '熟悉 React 基础', '每周实习4天以上'],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    url: 'https://example.com/job/4',
    source: 'boss',
  },
  {
    id: '5',
    title: '全栈工程师',
    company: 'StartupXYZ',
    location: '上海',
    salary: { min: 25000, max: 40000, currency: 'CNY', period: 'month' },
    type: 'full-time',
    status: 'interview',
    description: '独立负责产品全栈开发，从需求到上线。',
    requirements: ['3年以上开发经验', '前后端都能胜任', '有创业精神'],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    url: 'https://example.com/job/5',
    source: 'liepin',
  },
  {
    id: '6',
    title: 'Flutter 开发工程师',
    company: 'DJI',
    location: '深圳',
    salary: { min: 28000, max: 45000, currency: 'CNY', period: 'month' },
    type: 'full-time',
    status: 'active',
    description: '负责无人机 App 开发，使用 Flutter 跨平台技术。',
    requirements: ['2年以上 Flutter 经验', '熟悉 Dart 语言', '有移动端开发经验'],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    url: 'https://example.com/job/6',
    source: 'boss',
  },
  {
    id: '7',
    title: '前端开发工程师（兼职）',
    company: 'RemoteWork',
    location: '远程',
    salary: { min: 300, max: 500, currency: 'USD', period: 'day' },
    type: 'part-time',
    status: 'active',
    description: '远程兼职前端开发，灵活工作时间。',
    requirements: ['英语流利', '前端基础扎实', '能独立工作'],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    url: 'https://example.com/job/7',
    source: 'lagou',
  },
  {
    id: '8',
    title: 'DevOps 工程师',
    company: 'Huawei',
    location: '东莞',
    salary: { min: 32000, max: 52000, currency: 'CNY', period: 'month' },
    type: 'contract',
    status: 'active',
    description: '负责 CI/CD 系统建设和维护。',
    requirements: ['熟悉 Kubernetes', '有 CI/CD 经验', '熟悉云服务'],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    url: 'https://example.com/job/8',
    source: 'liepin',
  },
]

export async function fetchJobs(page = 1, limit = 10): Promise<{
  jobs: Job[]
  total: number
  page: number
  limit: number
}> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const start = (page - 1) * limit
  const end = start + limit
  const jobs = mockJobs.slice(start, end)

  return {
    jobs,
    total: mockJobs.length,
    page,
    limit,
  }
}

export async function fetchJobById(id: string): Promise<Job | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockJobs.find((job) => job.id === id)
}
