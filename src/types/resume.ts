/**
 * Resume Types
 * Single Responsibility: Define type definitions for resume functionality
 */

/**
 * AI analysis result from resume processing
 */
export interface AnalysisResult {
  skills: SkillCategory[]
  summary: string
  jobKeywords: string[]
}

/**
 * Skills grouped by category
 */
export interface SkillCategory {
  category: string
  items: string[]
}

/**
 * Job filters for search
 */
export interface JobFilters {
  locations: string[]
  jobTypes: string[]
  postedTime?: string
  remoteOption?: string
}

/**
 * Uploaded resume metadata
 */
export interface ResumeData {
  resumeId: string
  fileName: string
  uploadDate: Date
}

/**
 * Upload API response
 */
export interface UploadResult {
  resumeId: string
  fileName: string
  uploadDate: string
}

/**
 * Resume metadata with optional analysis
 */
export interface ResumeMetadata {
  resumeId: string
  fileName: string
  uploadDate: string
  hasAnalysis: boolean
  analysis?: AnalysisResult
}
