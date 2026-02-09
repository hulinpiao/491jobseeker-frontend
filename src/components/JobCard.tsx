import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { Badge } from './ui/Badge'
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
      <Link to={`/jobs/${job.id}`} className="block p-4">
        {/* Job Title */}
        <h3 className="text-xl font-bold line-clamp-1">{job.title}</h3>

        {/* Company Info Bar */}
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="default">{job.company}</Badge>
          <Badge variant="outline">{job.location}</Badge>
          <Badge variant="secondary">{WORK_ARRANGEMENT_LABELS[job.workArrangement]}</Badge>
          <Badge variant="outline">{EMPLOYMENT_TYPE_LABELS[job.employmentType]}</Badge>
        </div>

        {/* JD Preview */}
        <p className="mt-3 text-gray-600 dark:text-gray-400 line-clamp-3 text-sm">
          {job.description}
        </p>

        {/* Posted Date */}
        <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Posted {formatDate(job.createdAt)}</span>
        </div>
      </Link>
    </Card>
  )
}
