import { useState } from 'react'
import { SearchBar } from '../components/SearchBar'
import { FilterPanel } from '../components/FilterPanel'
import { JobList } from '../components/JobList'
import type { JobFilters } from '../types/job'

export function JobListPage() {
  const [filters, setFilters] = useState<JobFilters>({})

  const handleSearch = () => {
    // Search is triggered by filter changes in JobList
    // This is just a placeholder for explicit search action
  }

  const handleKeywordChange = (keyword: string) => {
    setFilters((prev) => ({ ...prev, keyword: keyword || undefined }))
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-4 text-2xl font-bold">491 JobSeeker</h1>
          <SearchBar
            value={filters.keyword ?? ''}
            onChange={handleKeywordChange}
            onSearch={handleSearch}
          />
        </div>
      </header>

      {/* Main Content - Vertical Stack Layout */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4 md:px-6 md:py-6">
        <div className="flex flex-col gap-4">
          {/* Filters - shown on desktop */}
          <div className="hidden md:block">
            <FilterPanel filters={filters} onChange={setFilters} />
          </div>

          {/* Job List */}
          <JobList filters={filters} />
        </div>
      </main>
    </div>
  )
}
