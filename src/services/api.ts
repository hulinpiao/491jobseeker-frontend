/**
 * API Service for job data
 * Single Responsibility: Handle all API communication with new filtered jobs API
 */

import type {
  FilteredJob,
  FilteredJobsResponse,
  Job,
  JobFilters,
  JobsResponse,
  JobsStats,
  PlatformStats,
  DateStats,
} from '@/types/job';
import { normalizeJob } from '@/types/job';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Convert query parameters to URL search params
 */
function buildSearchParams(params: Record<string, string | number | boolean | undefined>): URLSearchParams {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  }
  return searchParams;
}

/**
 * Fetch jobs with pagination and filters
 */
export async function fetchJobs(filters: JobFilters & {
  page?: number;
  limit?: number;
}): Promise<JobsResponse> {
  const searchParams = buildSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 20,
    q: filters.q,
    location: filters.location,
    employmentType: filters.employmentType,
    workArrangement: filters.workArrangement,
    platform: filters.platform,
    minScore: filters.minScore,
    date: filters.date,
  });

  const queryString = searchParams.toString();
  const endpoint = `/api/jobs${queryString ? `?${queryString}` : ''}`;

  const response = await fetchApi<FilteredJobsResponse>(endpoint);

  return {
    jobs: response.data.map(normalizeJob),
    total: response.total,
    page: response.page,
    limit: response.limit,
    totalPages: response.totalPages,
  };
}

/**
 * Fetch a single job by ID
 */
export async function fetchJobById(id: string): Promise<Job> {
  const apiJob = await fetchApi<FilteredJob>(`/api/jobs/${id}`);
  return normalizeJob(apiJob);
}

/**
 * Fetch job statistics summary
 */
export async function fetchJobsStats(): Promise<JobsStats> {
  const apiStats = await fetchApi<{
    total: number;
    byPlatform: Array<{ platform: string; count: number }>;
    avgScore: number;
    byDate: Array<{ date: string; count: number }>;
  }>(`/api/jobs/stats/summary`);

  const platformLabels: Record<string, string> = {
    linkedin: 'LinkedIn',
    indeed: 'Indeed',
    seek: 'Seek',
  };

  return {
    total: apiStats.total,
    byPlatform: apiStats.byPlatform.map(s => ({
      platform: s.platform as any,
      platformLabel: platformLabels[s.platform] || s.platform,
      count: s.count,
    })),
    avgScore: apiStats.avgScore,
    byDate: apiStats.byDate,
  };
}

/**
 * Fetch platform statistics
 */
export async function fetchPlatformStats(): Promise<PlatformStats[]> {
  const apiStats = await fetchApi<Array<{ platform: string; count: number }>>(
    `/api/jobs/stats/platforms`
  );

  const platformLabels: Record<string, string> = {
    linkedin: 'LinkedIn',
    indeed: 'Indeed',
    seek: 'Seek',
  };

  return apiStats.map(s => ({
    platform: s.platform as any,
    platformLabel: platformLabels[s.platform] || s.platform,
    count: s.count,
  }));
}

/**
 * Fetch available dates
 */
export async function fetchAvailableDates(): Promise<DateStats[]> {
  return fetchApi<DateStats[]>(`/api/jobs/stats/dates`);
}
