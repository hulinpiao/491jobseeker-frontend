import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { JobCard } from './JobCard'
import { Pagination } from './Pagination'
import type { Job, JobFilters } from '@/types/job'
import { fetchJobs as apiFetchJobs } from '@/services/api'
import { normalizeJob } from '@/types/job'

interface JobListProps {
  filters: JobFilters
  selectedJobId: string | null
  onSelectJob: (job: Job) => void
}

export function JobList({ filters, selectedJobId, onSelectJob }: JobListProps) {
  const [page, setPage] = useState(1)
  const limit = 10

  // Build query key from filters
  const queryKey = ['jobs', filters, page]

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () =>
      apiFetchJobs({
        page,
        limit,
        keyword: filters.keyword,
        location: filters.location,
        employmentType: filters.employmentType,
        workArrangement: filters.workArrangement,
      }),
  })

  // Normalize API jobs to frontend Jobs
  const jobs: Job[] = data?.data.map(normalizeJob) ?? []
  const total = data?.meta.total ?? 0
  const totalPages = data?.meta.totalPages ?? 1

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-destructive">加载失败，请稍后重试</p>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">没有找到匹配的职位</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 text-sm text-muted-foreground">
        共 {total} 个职位
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isActive={selectedJobId === job.id}
            onClick={() => onSelectJob(job)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  )
}
