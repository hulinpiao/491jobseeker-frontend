import { Link } from 'react-router-dom'
import { Clock, Building } from 'lucide-react'
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
        {/* Job Title with Company Icon on Right */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-bold line-clamp-1 flex-1">{job.title}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0" title={`Company: ${job.company}`}>
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">{job.company}</span>
          </div>
        </div>

        {/* JD Preview */}
        <p className="mt-3 text-gray-600 dark:text-gray-400 line-clamp-3 text-sm">
          {job.description}
        </p>

        {/* Bottom Bar: Posted Date + Info with Icons */}
        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Posted {formatDate(job.createdAt)}</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            {/* Location - always show */}
            <div className="flex items-center gap-1" title={`Location: ${job.location}`}>
              <span>📍</span>
              <span>{job.location}</span>
            </div>
            {/* Work Arrangement - only show if value exists */}
            {job.workArrangement && WORK_ARRANGEMENT_LABELS[job.workArrangement] && (
              <div className="flex items-center gap-1" title={`Work Arrangement: ${WORK_ARRANGEMENT_LABELS[job.workArrangement]}`}>
                <span>🏠</span>
                <span>{WORK_ARRANGEMENT_LABELS[job.workArrangement]}</span>
              </div>
            )}
            {/* Employment Type - always show */}
            <div className="flex items-center gap-1" title={`Employment Type: ${EMPLOYMENT_TYPE_LABELS[job.employmentType]}`}>
              <span>💼</span>
              <span>{EMPLOYMENT_TYPE_LABELS[job.employmentType]}</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  )
}
