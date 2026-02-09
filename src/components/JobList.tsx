import { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { JobCard } from './JobCard'
import { Pagination } from './Pagination'
import type { Job, JobFilters } from '@/types/job'
import { fetchJobs } from '@/mock-data/jobs'

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
    queryFn: () => fetchJobs(page, limit),
  })

  // Apply client-side filtering for demo
  // In production, this would be handled by the API
  const filteredJobs = useMemo(() => {
    if (!data) return []

    return data.jobs.filter((job) => {
      if (filters.keyword && !job.title.toLowerCase().includes(filters.keyword.toLowerCase()) &&
          !job.company.toLowerCase().includes(filters.keyword.toLowerCase())) {
        return false
      }
      if (filters.location && !job.location.includes(filters.location)) {
        return false
      }
      if (filters.type && job.type !== filters.type) {
        return false
      }
      if (filters.status && job.status !== filters.status) {
        return false
      }
      if (filters.minSalary) {
        const salaryInYear = job.salary.period === 'month'
          ? (job.salary.min || 0) * 12
          : (job.salary.min || 0)
        if (salaryInYear < filters.minSalary) {
          return false
        }
      }
      return true
    })
  }, [data, filters])

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1)
  }, [filters.keyword, filters.location, filters.type, filters.status, filters.minSalary])

  const totalPages = Math.ceil((filteredJobs.length) / limit)
  const displayedJobs = filteredJobs.slice((page - 1) * limit, page * limit)

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

  if (displayedJobs.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">没有找到匹配的职位</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 text-sm text-muted-foreground">
        共 {filteredJobs.length} 个职位
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {displayedJobs.map((job) => (
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
