import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { JobCard } from './JobCard'
import { Pagination } from './Pagination'
import type { Job, JobFilters } from '@/types/job'
import { fetchJobs as apiFetchJobs } from '@/services/api'
import { normalizeJob } from '@/types/job'

interface JobListProps {
  filters: JobFilters
  selectedJobId?: string | null
}

export function JobList({ filters, selectedJobId }: JobListProps) {
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
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-destructive">Failed to load jobs. Please try again.</p>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-muted-foreground">No jobs found matching your criteria</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="mb-4 text-sm text-muted-foreground">
        {total} {total === 1 ? 'job' : 'jobs'} found
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isActive={selectedJobId === job.id}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
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
