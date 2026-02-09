import { Building2, MapPin, Calendar, ExternalLink, CheckCircle2 } from 'lucide-react'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card'
import { formatSalary, formatDate } from '@/lib/utils'
import type { Job } from '@/types/job'

interface JobDetailProps {
  job: Job | null
}

const STATUS_CONFIG = {
  active: { label: '待申请', description: '尚未申请此职位' },
  applied: { label: '已申请', description: '已提交申请，等待回复' },
  interview: { label: '面试中', description: '正在面试流程中' },
  offered: { label: '已录用', description: '恭喜！已收到录用通知' },
  rejected: { label: '已拒绝', description: '很遗憾，申请未通过' },
} as const

const TYPE_LABELS = {
  'full-time': '全职',
  'part-time': '兼职',
  contract: '合同工',
  internship: '实习',
} as const

export function JobDetail({ job }: JobDetailProps) {
  if (!job) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <p>请从左侧选择一个职位查看详情</p>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[job.status]

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
            <Badge variant="default">{statusConfig.label}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Job Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">薪资</p>
              <p className="font-medium text-primary">{formatSalary(job)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">工作类型</p>
              <p className="font-medium">{TYPE_LABELS[job.type]}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">工作地点</p>
              <div className="flex items-center gap-1 font-medium">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {job.location}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">发布时间</p>
              <div className="flex items-center gap-1 font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {formatDate(job.postedAt)}
              </div>
            </div>
          </div>

          {/* Source */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm text-muted-foreground">数据来源</p>
              <p className="font-medium capitalize">{job.source}</p>
            </div>
            {job.url && (
              <Button variant="outline" size="sm" asChild href={job.url}>
                <ExternalLink className="mr-1 h-4 w-4" />
                查看原职位
              </Button>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="mb-2 font-semibold">职位描述</h3>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{job.description}</p>
          </div>

          {/* Requirements */}
          {job.requirements.length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold">任职要求</h3>
              <ul className="space-y-1">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Status Description */}
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm">
              <span className="font-medium">当前状态：</span>
              {statusConfig.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
