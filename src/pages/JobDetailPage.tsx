import { useParams } from 'react-router-dom'
import { JobDetail } from '../components/JobDetail'
import type { Job } from '../types/job'

// Mock data - will be replaced with API call in S3
const mockJob: Job = {
  id: 'mock-job-id',
  title: 'Software Engineer',
  company: 'Example Company',
  location: 'Sydney, NSW',
  city: 'Sydney',
  state: 'NSW',
  country: 'Australia',
  description: 'This is a placeholder job description. In a future task, this will be replaced with actual data from the API.',
  employmentType: 'full_time',
  workArrangement: 'hybrid',
  applyLink: 'https://example.com/apply',
  sources: [
    {
      platform: 'seek',
      jobId: '12345',
      url: 'https://example.com/job/12345',
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void jobId // Will be used in S3 for API call

  // TODO: In S3, replace this with actual API call using jobId
  const job = mockJob

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center gap-4">
          <h1 className="text-2xl font-bold">491 JobSeeker</h1>
          <span className="text-muted-foreground">/ Job Details</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl flex-1 px-4 py-4 md:px-6 md:py-6">
        <JobDetail job={job} />
      </main>
    </div>
  )
}
