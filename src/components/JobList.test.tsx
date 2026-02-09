import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
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
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

const mockJobsResponse = {
  data: [
    {
      _id: '1',
      job_title: 'Frontend Engineer',
      company_name_normalized: 'TechCorp',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      job_location: 'San Francisco, CA',
      job_description: 'Build modern web applications',
      employment_type: 'full_time' as const,
      work_arrangement: 'remote' as const,
      apply_link: 'https://example.com',
      sources: [],
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      _id: '2',
      job_title: 'Backend Engineer',
      company_name_normalized: 'DataFlow',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      job_location: 'New York, NY',
      job_description: 'Build scalable APIs',
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

  it('displays loading state', () => {
    vi.mocked(fetchJobs).mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<JobList filters={{}} />, {
      wrapper: createWrapper(),
    })

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('displays error state', async () => {
    vi.mocked(fetchJobs).mockRejectedValueOnce(new Error('API Error'))

    render(<JobList filters={{}} />, {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(screen.getByText('Failed to load jobs. Please try again.')).toBeInTheDocument()
    })
  })

  it('displays empty state', async () => {
    vi.mocked(fetchJobs).mockResolvedValueOnce({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    })

    render(<JobList filters={{}} />, {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(screen.getByText('No jobs found matching your criteria')).toBeInTheDocument()
    })
  })

  it('displays job list', async () => {
    vi.mocked(fetchJobs).mockResolvedValueOnce(mockJobsResponse)

    render(<JobList filters={{}} />, {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(screen.getByText('2 jobs found')).toBeInTheDocument()
      expect(screen.getByText('Frontend Engineer')).toBeInTheDocument()
      expect(screen.getByText('Backend Engineer')).toBeInTheDocument()
    })
  })

  it('calls fetchJobs with filters', async () => {
    vi.mocked(fetchJobs).mockResolvedValueOnce(mockJobsResponse)

    const filters: JobFilters = {
      keyword: 'frontend',
      location: 'San Francisco',
      employmentType: 'full_time',
      workArrangement: 'remote',
    }

    render(<JobList filters={filters} />, {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(fetchJobs).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        keyword: 'frontend',
        location: 'San Francisco',
        employmentType: 'full_time',
        workArrangement: 'remote',
      })
    })
  })

  it('displays pagination when multiple pages', async () => {
    vi.mocked(fetchJobs).mockResolvedValueOnce({
      ...mockJobsResponse,
      totalPages: 3,
    })

    const { container } = render(<JobList filters={{}} />, {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(container.querySelector('[class*="justify-center"]')).toBeInTheDocument()
    })
  })

  it('does not display pagination when only one page', async () => {
    vi.mocked(fetchJobs).mockResolvedValueOnce({
      ...mockJobsResponse,
      totalPages: 1,
    })

    render(<JobList filters={{}} />, {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(screen.queryByLabelText('pagination')).not.toBeInTheDocument()
    })
  })
})
