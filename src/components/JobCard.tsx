import { MapPin, Briefcase, Clock } from 'lucide-react'
import { Badge } from './ui/Badge'
import { Card, CardHeader, CardContent } from './ui/Card'
import { formatSalary, formatDate } from '@/lib/utils'
import type { Job } from '@/types/job'

interface JobCardProps {
  job: Job
  isActive: boolean
  onClick: () => void
}

const STATUS_CONFIG = {
  active: { label: '待申请', variant: 'secondary' as const },
  applied: { label: '已申请', variant: 'outline' as const },
  interview: { label: '面试中', variant: 'default' as const },
  offered: { label: '已录用', variant: 'default' as const },
  rejected: { label: '已拒绝', variant: 'outline' as const },
} as const

const TYPE_LABELS = {
  'full-time': '全职',
  'part-time': '兼职',
  contract: '合同工',
  internship: '实习',
} as const

export function JobCard({ job, isActive, onClick }: JobCardProps) {
  const statusConfig = STATUS_CONFIG[job.status]

  return (
    <Card
      className={`cursor-pointer transition-colors hover:bg-accent/50 ${
        isActive ? 'border-primary bg-accent' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-semibold">{job.title}</h3>
          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{job.company}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" />
            {TYPE_LABELS[job.type]}
          </span>
        </div>

        <div className="text-sm font-medium text-primary">
          {formatSalary(job)}
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{formatDate(job.postedAt)}</span>
          <span>·</span>
          <span>{job.source}</span>
        </div>
      </CardContent>
    </Card>
  )
}
