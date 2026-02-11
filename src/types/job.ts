// Types for filtered jobs from job_scraper_filtered.filtered_jobs collection

export type Platform = 'linkedin' | 'indeed' | 'seek';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'casual' | 'temporary' | 'unknown';
export type WorkArrangement = 'onsite' | 'hybrid' | 'remote' | 'unknown';
export type ExclusionStage = 'visa' | 'security' | null;

// API response types from backend
export interface FilteredJob {
  _id: string;
  date: string; // YYYY-MM-DD format
  platform: Platform;
  job_posting_id: string;
  company_name_normalized: string;
  city: string;
  state: string;
  country: string;
  employment_type: EmploymentType;
  work_arrangement: WorkArrangement;
  job_title: string;
  job_description: string;
  job_location: string;
  apply_link: string;
  analysis: {
    passed: boolean;
    match_score: number;
    match_reason: string;
    matching_skills: string[];
    missing_skills: string[];
    exclusion_stage?: ExclusionStage;
    exclusion_reason?: string;
  };
  updated_at: string;
  created_at?: string;
}

export interface FilteredJobsResponse {
  data: FilteredJob[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Normalized types for frontend use
export interface Job {
  id: string;
  date: string;
  platform: Platform;
  platformLabel: string;
  title: string;
  company: string;
  location: string;
  city: string;
  state: string;
  country: string;
  description: string;
  employmentType: EmploymentType;
  workArrangement: WorkArrangement;
  applyLink: string;
  analysis: {
    passed: boolean;
    matchScore: number;
    matchReason: string;
    matchingSkills: string[];
    missingSkills: string[];
    exclusionStage?: ExclusionStage;
    exclusionReason?: string;
  };
  updatedAt: string;
  createdAt?: string;
}

// Convert API job to frontend job
export function normalizeJob(apiJob: FilteredJob): Job {
  const platformLabels: Record<Platform, string> = {
    linkedin: 'LinkedIn',
    indeed: 'Indeed',
    seek: 'Seek',
  };

  return {
    id: apiJob._id,
    date: apiJob.date,
    platform: apiJob.platform,
    platformLabel: platformLabels[apiJob.platform],
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
    analysis: {
      passed: apiJob.analysis.passed,
      matchScore: apiJob.analysis.match_score,
      matchReason: apiJob.analysis.match_reason,
      matchingSkills: apiJob.analysis.matching_skills,
      missingSkills: apiJob.analysis.missing_skills,
      exclusionStage: apiJob.analysis.exclusion_stage,
      exclusionReason: apiJob.analysis.exclusion_reason,
    },
    updatedAt: apiJob.updated_at,
    createdAt: apiJob.created_at,
  };
}

export interface JobFilters {
  q?: string;
  location?: string;
  employmentType?: EmploymentType;
  workArrangement?: WorkArrangement;
  platform?: Platform;
  minScore?: number;
  date?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Statistics types
export interface PlatformStats {
  platform: Platform;
  platformLabel: string;
  count: number;
}

export interface DateStats {
  date: string;
  count: number;
}

export interface JobsStats {
  total: number;
  byPlatform: PlatformStats[];
  avgScore: number;
  byDate: DateStats[];
}
