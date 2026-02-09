import { Building2, MapPin, Calendar, ExternalLink } from 'lucide-react'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card'
import { formatDate } from '@/lib/utils'
import type { Job } from '@/types/job'

interface JobDetailProps {
  job: Job | null
}

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: '全职',
  part_time: '兼职',
  contract: '合同工',
  casual: '临时',
  temporary: '临时',
} as const

const WORK_ARRANGEMENT_LABELS: Record<string, string> = {
  onsite: '现场办公',
  hybrid: '混合办公',
  remote: '远程办公',
} as const

export function JobDetail({ job }: JobDetailProps) {
  if (!job) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <p>请从左侧选择一个职位查看详情</p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="mb-2">{job.title}</CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{job.company}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Job Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">工作类型</p>
              <p className="font-medium">{EMPLOYMENT_TYPE_LABELS[job.employmentType]}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">工作方式</p>
              <Badge variant="outline">{WORK_ARRANGEMENT_LABELS[job.workArrangement]}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">工作地点</p>
              <div className="flex items-center gap-1 font-medium">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {job.city}, {job.state}, {job.country}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">发布时间</p>
              <div className="flex items-center gap-1 font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {formatDate(job.createdAt)}
              </div>
            </div>
          </div>

          {/* Source */}
          {job.sources.length > 0 && (
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm text-muted-foreground">数据来源</p>
                <div className="flex flex-wrap gap-1">
                  {job.sources.map((source, index) => (
                    <Badge key={index} variant="secondary" className="capitalize">
                      {source.platform}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1 h-4 w-4" />
                  申请职位
                </a>
              </Button>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="mb-2 font-semibold">职位描述</h3>
            <div className="max-h-96 overflow-y-auto rounded-lg border p-4">
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">{job.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
