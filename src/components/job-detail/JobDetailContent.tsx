import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BackButton } from './BackButton'
import { ActionButtons } from './ActionButtons'
import { CheckCircle, XCircle, Building2, MapPin, Calendar } from 'lucide-react'
import type { Job } from '@/types/job'

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

interface JobDetailContentProps {
  job: Job
}

export function JobDetailContent({ job }: JobDetailContentProps) {
  const matchPercentage = Math.round(job.analysis.matchScore * 100)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      {/* Main Content */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 md:px-6 md:py-8" data-testid="job-detail">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Match Score Card */}
        <Card className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Match Score</p>
              <div className={`text-4xl font-bold ${getScoreColor(job.analysis.matchScore)}`}>
                {matchPercentage}%
              </div>
            </div>
            <div className="text-right">
              <div className={`px-3 py-1 rounded-lg text-sm font-medium ${PLATFORM_COLORS[job.platform] || 'bg-gray-100 text-gray-800'}`}>
                {job.platformLabel}
              </div>
            </div>
          </div>
          {job.analysis.matchReason && (
            <p className="mt-4 text-sm text-muted-foreground italic">
              "{job.analysis.matchReason}"
            </p>
          )}
        </Card>

        {/* Job Header */}
        <Card className="mb-6 p-6">
          <h1 className="mb-4 text-3xl font-bold">{job.title}</h1>
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <span className="text-lg font-medium">{job.company}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.city}, {job.state}
            </Badge>
            <Badge variant="secondary">{WORK_ARRANGEMENT_LABELS[job.workArrangement]}</Badge>
            <Badge variant="outline">{EMPLOYMENT_TYPE_LABELS[job.employmentType]}</Badge>
            <Badge variant="default" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {job.date}
            </Badge>
          </div>
        </Card>

        {/* Skills Analysis */}
        {(job.analysis.matchingSkills.length > 0 || job.analysis.missingSkills.length > 0) && (
          <Card className="mb-6 p-6">
            <h2 className="mb-4 text-xl font-semibold">Skills Analysis</h2>

            {job.analysis.matchingSkills.length > 0 && (
              <div className="mb-4">
                <h3 className="mb-2 text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Matching Skills ({job.analysis.matchingSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.analysis.matchingSkills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {job.analysis.missingSkills.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Missing Skills ({job.analysis.missingSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.analysis.missingSkills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Action Buttons */}
        <div className="mb-6">
          <ActionButtons />
        </div>

        {/* Full Description */}
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Job Description</h2>
          <div className="prose max-w-none whitespace-pre-wrap text-sm text-muted-foreground">
            {job.description}
          </div>
        </Card>

        {/* Apply Link */}
        <Card className="mt-6 p-4">
          <Button asChild className="w-full sm:w-auto">
            <a
              href={job.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              title="Apply on original platform"
            >
              Apply on {job.platformLabel}
            </a>
          </Button>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
