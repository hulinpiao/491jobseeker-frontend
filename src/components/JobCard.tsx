import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { Card } from './ui/Card'
import { formatDate } from '@/lib/utils'
import type { Job } from '@/types/job'

interface JobCardProps {
  job: Job
  isActive?: boolean
}

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  casual: 'Casual',
  temporary: 'Temporary',
} as const

const WORK_ARRANGEMENT_LABELS: Record<string, string> = {
  onsite: 'On-site',
  hybrid: 'Hybrid',
  remote: 'Remote',
} as const

export function JobCard({ job, isActive = false }: JobCardProps) {
  return (
    <Card
      className={`hover:shadow-lg transition-all cursor-pointer ${
        isActive ? 'border-primary bg-accent' : ''
      }`}
    >
      <Link to={`/jobs/${job.id}`} className="block p-4" data-testid="job-card" data-job-id={job.id}>
        {/* Job Title with Icons on Right */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-bold line-clamp-1 flex-1">{job.title}</h3>
          <div className="flex items-center gap-1 text-lg shrink-0" title="Company">
            <span>🏢</span>
          </div>
        </div>

        {/* JD Preview */}
        <p className="mt-3 text-gray-600 dark:text-gray-400 line-clamp-3 text-sm">
          {job.description}
        </p>

        {/* Bottom Bar: Posted Date + Icons */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Posted {formatDate(job.createdAt)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1" title={`Location: ${job.location}`}>
              <span>📍</span>
              <span className="text-xs">{job.location}</span>
            </div>
            <div className="flex items-center gap-1" title={`Work Arrangement: ${WORK_ARRANGEMENT_LABELS[job.workArrangement]}`}>
              <span>🏠</span>
            </div>
            <div className="flex items-center gap-1" title={`Employment Type: ${EMPLOYMENT_TYPE_LABELS[job.employmentType]}`}>
              <span>💼</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  )
}
