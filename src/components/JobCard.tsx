import { Link } from 'react-router-dom'
import { Clock, Building, TrendingUp } from 'lucide-react'
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
  if (score >= 0.8) return 'text-green-600 dark:text-green-400'
  if (score >= 0.6) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

export function JobCard({ job, isActive = false }: JobCardProps) {
  const matchPercentage = Math.round(job.analysis.matchScore * 100)

  return (
    <Card
      className={`hover:shadow-lg transition-all cursor-pointer ${
        isActive ? 'border-primary bg-accent' : ''
      }`}
    >
      <Link to={`/jobs/${job.id}`} className="block p-4" data-testid="job-card" data-job-id={job.id}>
        {/* Header: Platform badge + Match Score + Company */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${PLATFORM_COLORS[job.platform] || 'bg-gray-100 text-gray-800'}`}>
              {job.platformLabel}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground" title={`Company: ${job.company}`}>
              <Building className="h-3 w-3" />
              <span className="hidden sm:inline">{job.company}</span>
            </span>
          </div>

          {/* Match Score Indicator */}
          <div className={`flex items-center gap-1 text-xs font-medium ${getScoreColor(job.analysis.matchScore)}`} title="Match Score">
            <TrendingUp className="h-3 w-3" />
            <span>{matchPercentage}%</span>
          </div>
        </div>

        {/* Job Title */}
        <h3 className="text-xl font-bold line-clamp-1 mb-3">{job.title}</h3>

        {/* JD Preview */}
        <p className="mb-3 text-gray-600 dark:text-gray-400 line-clamp-3 text-sm">
          {job.description}
        </p>

        {/* Skills Section (if available) */}
        {job.analysis.matchingSkills && job.analysis.matchingSkills.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-1">Matching Skills:</p>
            <div className="flex flex-wrap gap-1">
              {job.analysis.matchingSkills.slice(0, 5).map((skill) => (
                <span key={skill} className="px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs">
                  {skill}
                </span>
              ))}
              {job.analysis.matchingSkills.length > 5 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                  +{job.analysis.matchingSkills.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Bottom Bar: Posted Date + Info with Icons */}
        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Posted {formatDate(job.updatedAt)}</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            {/* Location - always show */}
            <div className="flex items-center gap-1" title={`Location: ${job.city}, ${job.state}`}>
              <span>📍</span>
              <span className="hidden md:inline">{job.city}, {job.state}</span>
              <span className="md:hidden">{job.city}</span>
            </div>
            {/* Work Arrangement - only show if value exists and not unknown */}
            {job.workArrangement && job.workArrangement !== 'unknown' && (
              <div className="flex items-center gap-1" title={`Work Arrangement: ${WORK_ARRANGEMENT_LABELS[job.workArrangement]}`}>
                <span>🏠</span>
                <span>{WORK_ARRANGEMENT_LABELS[job.workArrangement]}</span>
              </div>
            )}
            {/* Employment Type - always show */}
            <div className="flex items-center gap-1" title={`Employment Type: ${EMPLOYMENT_TYPE_LABELS[job.employmentType]}`}>
              <span>💼</span>
              <span className="hidden sm:inline">{EMPLOYMENT_TYPE_LABELS[job.employmentType]}</span>
              <span className="sm:hidden">{EMPLOYMENT_TYPE_LABELS[job.employmentType]?.split('-')[0]}</span>
            </div>
          </div>
        </div>

        {/* Match Reason (tooltip) */}
        {job.analysis.matchReason && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-muted-foreground italic line-clamp-2" title={job.analysis.matchReason}>
              "{job.analysis.matchReason}"
            </p>
          </div>
        )}
      </Link>
    </Card>
  )
}
