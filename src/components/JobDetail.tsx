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
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  casual: 'Casual',
  temporary: 'Temporary',
  unknown: 'Unknown',
} as const

const WORK_ARRANGEMENT_LABELS: Record<string, string> = {
  onsite: 'On-site',
  hybrid: 'Hybrid',
  remote: 'Remote',
  unknown: 'Unknown',
} as const

const PLATFORM_COLORS: Record<string, string> = {
  linkedin: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  indeed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  seek: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
}

function getScoreColor(score: number): string {
  if (score >= 0.8) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950'
  if (score >= 0.6) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950'
  return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950'
}

export function JobDetail({ job }: JobDetailProps) {
  if (!job) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <p>Select a job to view details</p>
      </div>
    )
  }

  const matchPercentage = Math.round(job.analysis.matchScore * 100)

  return (
    <div className="h-full overflow-y-auto">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${PLATFORM_COLORS[job.platform] || 'bg-gray-100 text-gray-800'}`}>
                  {job.platformLabel}
                </span>
                <div className={`px-2 py-0.5 rounded text-xs font-medium ${getScoreColor(job.analysis.matchScore)}`}>
                  {matchPercentage}% Match
                </div>
              </div>
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
              <p className="text-sm text-muted-foreground">Employment Type</p>
              <p className="font-medium">{EMPLOYMENT_TYPE_LABELS[job.employmentType]}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Work Arrangement</p>
              <Badge variant="outline">{WORK_ARRANGEMENT_LABELS[job.workArrangement]}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Location</p>
              <div className="flex items-center gap-1 font-medium">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {job.city}, {job.state}, {job.country}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Posted Date</p>
              <div className="flex items-center gap-1 font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {formatDate(job.updatedAt)}
              </div>
            </div>
          </div>

          {/* Skills Analysis */}
          {(job.analysis.matchingSkills.length > 0 || job.analysis.missingSkills.length > 0) && (
            <div className="space-y-3">
              <h3 className="font-semibold">Skills Analysis</h3>

              {job.analysis.matchingSkills.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-green-700 dark:text-green-400">
                    Matching Skills ({job.analysis.matchingSkills.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {job.analysis.matchingSkills.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {job.analysis.missingSkills.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-red-700 dark:text-red-400">
                    Missing Skills ({job.analysis.missingSkills.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {job.analysis.missingSkills.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Match Reason */}
          {job.analysis.matchReason && (
            <div>
              <p className="mb-1 text-sm text-muted-foreground">Match Reason</p>
              <p className="text-sm italic">&quot;{job.analysis.matchReason}&quot;</p>
            </div>
          )}

          {/* Apply Link */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm text-muted-foreground">Apply on {job.platformLabel}</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-4 w-4" />
                Apply Now
              </a>
            </Button>
          </div>

          {/* Description */}
          <div>
            <h3 className="mb-2 font-semibold">Job Description</h3>
            <div className="max-h-96 overflow-y-auto rounded-lg border p-4">
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">{job.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
