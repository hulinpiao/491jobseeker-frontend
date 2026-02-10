/**
 * JobFilterPanel Component
 * Single Responsibility: Job search filters with validation
 */

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { DisclosureTriangle } from '@/components/ui/DisclosureTriangle'
import type { JobFilters } from '@/types/resume'

interface JobFilterPanelProps {
  visaType?: string
  analysisComplete: boolean
  onJobSeek: (filters: JobFilters) => void
}

const LOCATION_OPTIONS = [
  { value: 'canberra', label: 'Canberra' },
  { value: 'adelaide', label: 'Adelaide' },
  { value: 'perth', label: 'Perth' },
  { value: 'gold-coast', label: 'Gold Coast' },
  { value: 'regional-all', label: 'All Regional Areas' },
  { value: 'australia-all', label: 'All Australia (Including Non-Regional)' },
]

const JOB_TYPE_OPTIONS = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
]

const POSTED_TIME_OPTIONS = [
  { value: '1d', label: '1 day ago' },
  { value: '3d', label: '3 days ago' },
  { value: '1w', label: '1 week ago' },
  { value: '1m', label: '1 month ago' },
]

const REMOTE_OPTIONS = [
  { value: 'onsite', label: 'Onsite' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'remote', label: 'Remote' },
]

export function JobFilterPanel({
  visaType,
  analysisComplete,
  onJobSeek,
}: JobFilterPanelProps) {
  const [locations, setLocations] = useState<string[]>([])
  const [jobTypes, setJobTypes] = useState<string[]>([])
  const [postedTime, setPostedTime] = useState<string | undefined>()
  const [remoteOption, setRemoteOption] = useState<string | undefined>()

  const toggleLocation = (value: string) => {
    setLocations((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const toggleJobType = (value: string) => {
    setJobTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const isButtonEnabled =
    analysisComplete && locations.length > 0 && jobTypes.length > 0

  const getVisaMessage = (): string | null => {
    if (visaType === '491' || visaType === '494') {
      return 'Focus on regional areas for better opportunities with your visa.'
    }
    if (visaType === '482' || visaType === '186') {
      return 'Eligible for both regional and metropolitan positions.'
    }
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Job Preferences</h2>

      {getVisaMessage() && (
        <div className="rounded-md bg-primary/10 p-4 text-sm text-primary">
          {getVisaMessage()}
        </div>
      )}

      {/* Location Filter */}
      <DisclosureTriangle title="Location" defaultExpanded>
        <div className="space-y-2">
          {LOCATION_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={locations.includes(option.value)}
                onChange={() => toggleLocation(option.value)}
                className="h-4 w-4 rounded border-input"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </DisclosureTriangle>

      {/* Job Type Filter */}
      <DisclosureTriangle title="Job Type" defaultExpanded>
        <div className="space-y-2">
          {JOB_TYPE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={jobTypes.includes(option.value)}
                onChange={() => toggleJobType(option.value)}
                className="h-4 w-4 rounded border-input"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </DisclosureTriangle>

      {/* Posted Date Filter */}
      <DisclosureTriangle title="Posted Date">
        <div className="space-y-2">
          {POSTED_TIME_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="postedTime"
                checked={postedTime === option.value}
                onChange={() => setPostedTime(option.value)}
                className="h-4 w-4 border-input"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </DisclosureTriangle>

      {/* Work Mode Filter */}
      <DisclosureTriangle title="Work Mode">
        <div className="space-y-2">
          {REMOTE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="remoteOption"
                checked={remoteOption === option.value}
                onChange={() => setRemoteOption(option.value)}
                className="h-4 w-4 border-input"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </DisclosureTriangle>

      {/* Job Seeking Button */}
      <Button
        onClick={() => onJobSeek({ locations, jobTypes, postedTime, remoteOption })}
        disabled={!isButtonEnabled}
        className="w-full"
        size="lg"
      >
        Job Seeking
      </Button>

      {!isButtonEnabled && (
        <p className="text-xs text-center text-muted-foreground">
          {analysisComplete
            ? 'Please select at least one location and job type'
            : 'Complete AI analysis to enable job search'}
        </p>
      )}
    </div>
  )
}
