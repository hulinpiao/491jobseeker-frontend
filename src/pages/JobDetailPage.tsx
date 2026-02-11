import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchJobById } from '@/services/api'
import { JobDetailSkeleton } from '@/components/job-detail/JobDetailSkeleton'
import { JobDetailError } from '@/components/job-detail/JobDetailError'
import { JobNotFound } from '@/components/job-detail/JobNotFound'
import { JobDetailContent } from '@/components/job-detail/JobDetailContent'

export function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>()

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => fetchJobById(jobId!),
    enabled: !!jobId,
    retry: 1,
  })

  if (isLoading) {
    return <JobDetailSkeleton />
  }

  if (isError) {
    return <JobDetailError error={error} />
  }

  if (!data) {
    return <JobNotFound />
  }

  return <JobDetailContent job={data} />
}
