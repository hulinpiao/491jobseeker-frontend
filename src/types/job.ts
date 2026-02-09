// Raw API response types from backend
export interface ApiJob {
  _id: string
  dedup_key: string
  job_title: string
  company_name_normalized: string
  job_location: string
  city: string
  state: string
  country: string
  job_description: string
  employment_type: 'full_time' | 'part_time' | 'contract' | 'casual' | 'temporary'
  work_arrangement: 'onsite' | 'hybrid' | 'remote'
  apply_link: string
  sources: Array<{
    platform: string
    job_posting_id: string
    url: string
  }>
  created_at: string
  updated_at: string
}

export interface ApiJobsResponse {
  data: ApiJob[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Normalized types for frontend use
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'casual' | 'temporary'
export type WorkArrangement = 'onsite' | 'hybrid' | 'remote'

export interface Job {
  id: string
  title: string
  company: string
  location: string
  city: string
  state: string
  country: string
  description: string
  employmentType: EmploymentType
  workArrangement: WorkArrangement
  applyLink: string
  sources: Array<{
    platform: string
    jobId: string
    url: string
  }>
  createdAt: string
  updatedAt: string
}

// Convert API job to frontend job
export function normalizeJob(apiJob: ApiJob): Job {
  return {
    id: apiJob._id,
    title: apiJob.job_title,
    company: apiJob.company_name_normalized,
    location: apiJob.job_location,
    city: apiJob.city,
    state: apiJob.state,
    country: apiJob.country,
    description: apiJob.job_description,
    employmentType: apiJob.employment_type,
    workArrangement: apiJob.work_arrangement,
    applyLink: apiJob.apply_link,
    sources: apiJob.sources.map(s => ({
      platform: s.platform,
      jobId: s.job_posting_id,
      url: s.url,
    })),
    createdAt: apiJob.created_at,
    updatedAt: apiJob.updated_at,
  }
}

export interface JobFilters {
  keyword?: string
  location?: string
  employmentType?: EmploymentType
  workArrangement?: WorkArrangement
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface JobsResponse {
  jobs: Job[]
  total: number
  page: number
  limit: number
  totalPages: number
}
