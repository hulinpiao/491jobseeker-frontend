import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { JobList } from './JobList'
import type { JobFilters } from '@/types/job'

// Mock API
vi.mock('@/services/api', () => ({
  fetchJobs: vi.fn(),
}))

// Mock normalizeJob
vi.mock('@/types/job', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/types/job')>()
  return {
    ...actual,
    normalizeJob: (job: Record<string, unknown>) => ({
      ...job,
      id: (job as { _id: string })._id,
      title: (job as { job_title: string }).job_title,
      company: (job as { company_name_normalized: string }).company_name_normalized,
      location: (job as { job_location: string }).job_location,
      description: (job as { job_description: string }).job_description,
      employmentType: (job as { employment_type: string }).employment_type,
      workArrangement: (job as { work_arrangement: string }).work_arrangement,
      applyLink: (job as { apply_link: string }).apply_link,
      createdAt: (job as { created_at: string }).created_at,
      updatedAt: (job as { updated_at: string }).updated_at,
      sources: (job as { sources: Array<{ platform: string; job_posting_id: string; url: string }> }).sources.map((s) => ({
        platform: s.platform,
        jobId: s.job_posting_id,
        url: s.url,
      })),
    }),
  }
})

import { fetchJobs } from '@/services/api'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const mockJobsResponse = {
  data: [
    {
      _id: '1',
      job_title: '前端工程师',
      company_name_normalized: 'Test Company',
      city: '北京',
      state: '北京',
      country: '中国',
      job_location: '北京, 中国',
      job_description: 'Test description',
      employment_type: 'full_time' as const,
      work_arrangement: 'remote' as const,
      apply_link: 'https://example.com',
      sources: [],
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      _id: '2',
      job_title: '后端工程师',
      company_name_normalized: 'Another Company',
      city: '上海',
      state: '上海',
      country: '中国',
      job_location: '上海, 中国',
      job_description: 'Another description',
      employment_type: 'full_time' as const,
      work_arrangement: 'onsite' as const,
      apply_link: 'https://example.com/2',
      sources: [],
      created_at: '2024-01-02',
      updated_at: '2024-01-02',
    },
  ],
  total: 2,
  page: 1,
  limit: 10,
  totalPages: 1,
}

describe('JobList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该显示加载状态', () => {
    vi.mocked(fetchJobs).mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<JobList filters={{}} selectedJobId={null} onSelectJob={vi.fn()} />, {
      wrapper: createWrapper(),
    })

    expect(screen.getByText('加载中...')).toBeInTheDocument()
  })

  it('应该显示错误状态', async () => {
    vi.mocked(fetchJobs).mockRejectedValueOnce(new Error('API Error'))

    render(<JobList filters={{}} selectedJobId={null} onSelectJob={vi.fn()} />, {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(screen.getByText('加载失败，请稍后重试')).toBeInTheDocument()
    })
  })

  it('应该显示空状态', async () => {
    vi.mocked(fetchJobs).mockResolvedValueOnce({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    })

    render(<JobList filters={{}} selectedJobId={null} onSelectJob={vi.fn()} />, {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(screen.getByText('没有找到匹配的职位')).toBeInTheDocument()
    })
  })

  it('应该显示职位列表', async () => {
    vi.mocked(fetchJobs).mockResolvedValueOnce(mockJobsResponse)

    render(<JobList filters={{}} selectedJobId={null} onSelectJob={vi.fn()} />, {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(screen.getByText('共 2 个职位')).toBeInTheDocument()
      expect(screen.getByText('前端工程师')).toBeInTheDocument()
      expect(screen.getByText('后端工程师')).toBeInTheDocument()
    })
  })

  it('应该调用 fetchJobs 并传递筛选条件', async () => {
    vi.mocked(fetchJobs).mockResolvedValueOnce(mockJobsResponse)

    const filters: JobFilters = {
      keyword: '前端',
      location: '北京',
      employmentType: 'full_time',
      workArrangement: 'remote',
    }

    render(<JobList filters={filters} selectedJobId={null} onSelectJob={vi.fn()} />, {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(fetchJobs).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        keyword: '前端',
        location: '北京',
        employmentType: 'full_time',
        workArrangement: 'remote',
      })
    })
  })

  it('应该支持选择职位', async () => {
    vi.mocked(fetchJobs).mockResolvedValueOnce(mockJobsResponse)

    const onSelectJob = vi.fn()

    render(<JobList filters={{}} selectedJobId={null} onSelectJob={onSelectJob} />, {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(screen.getByText('前端工程师')).toBeInTheDocument()
    })

    // Click on the first job card
    const jobCard = screen.getByText('前端工程师').closest('.cursor-pointer')
    if (jobCard) {
      jobCard.click()
    }

    await waitFor(() => {
      expect(onSelectJob).toHaveBeenCalled()
    })
  })

  it('应该显示分页组件', async () => {
    vi.mocked(fetchJobs).mockResolvedValueOnce({
      ...mockJobsResponse,
      totalPages: 3,
    })

    const { container } = render(<JobList filters={{}} selectedJobId={null} onSelectJob={vi.fn()} />, {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(container.querySelector('[class*="justify-center"]')).toBeInTheDocument()
    })
  })

  it('不应该显示分页当只有一页', async () => {
    vi.mocked(fetchJobs).mockResolvedValueOnce({
      ...mockJobsResponse,
      totalPages: 1,
    })

    render(<JobList filters={{}} selectedJobId={null} onSelectJob={vi.fn()} />, {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(screen.queryByLabelText('pagination')).not.toBeInTheDocument()
    })
  })
})
