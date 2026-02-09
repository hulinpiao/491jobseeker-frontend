import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { BackButton } from './BackButton'
import { ActionButtons } from './ActionButtons'
import type { Job } from '@/types/job'

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

interface JobDetailContentProps {
  job: Job
}

export function JobDetailContent({ job }: JobDetailContentProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold">491 JobSeeker</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 md:px-6 md:py-8" data-testid="job-detail">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Job Header */}
        <Card className="mb-6 p-6">
          <h1 className="mb-4 text-3xl font-bold">{job.title}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">{job.company}</Badge>
            <Badge variant="outline">{job.location}</Badge>
            <Badge variant="secondary">{WORK_ARRANGEMENT_LABELS[job.workArrangement]}</Badge>
            <Badge variant="outline">{EMPLOYMENT_TYPE_LABELS[job.employmentType]}</Badge>
          </div>
        </Card>

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

        {/* Source Info */}
        {job.sources.length > 0 && (
          <Card className="mt-6 p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {job.sources.map((source, index) => (
                  <Badge key={index} variant="secondary" className="capitalize">
                    Source: {source.platform}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={job.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Apply on original platform"
                >
                  Apply on {job.sources[0]?.platform || 'External Site'}
                </a>
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
