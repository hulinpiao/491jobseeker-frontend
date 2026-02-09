import { MapPin, Briefcase, Clock } from 'lucide-react'
import { Badge } from './ui/Badge'
import { Card, CardHeader, CardContent } from './ui/Card'
import { formatDate } from '@/lib/utils'
import type { Job } from '@/types/job'

interface JobCardProps {
  job: Job
  isActive: boolean
  onClick: () => void
}

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: '全职',
  part_time: '兼职',
  contract: '合同工',
  casual: '临时',
  temporary: '临时',
} as const

const WORK_ARRANGEMENT_LABELS: Record<string, string> = {
  onsite: '现场',
  hybrid: '混合',
  remote: '远程',
} as const

export function JobCard({ job, isActive, onClick }: JobCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-colors hover:bg-accent/50 ${
        isActive ? 'border-primary bg-accent' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <h3 className="line-clamp-1 font-semibold">{job.title}</h3>
        <p className="text-sm text-muted-foreground">{job.company}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {job.city}, {job.state}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" />
            {EMPLOYMENT_TYPE_LABELS[job.employmentType]}
          </span>
          <Badge variant="outline" className="text-xs">
            {WORK_ARRANGEMENT_LABELS[job.workArrangement]}
          </Badge>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{formatDate(job.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
