import { useState } from 'react'
import { SearchBar } from './components/SearchBar'
import { FilterPanel } from './components/FilterPanel'
import { JobList } from './components/JobList'
import { JobDetail } from './components/JobDetail'
import type { Job, JobFilters } from './types/job'

function App() {
  const [filters, setFilters] = useState<JobFilters>({})
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  const handleSearch = () => {
    // Search is triggered by filter changes in JobList
    // This is just a placeholder for explicit search action
  }

  const handleKeywordChange = (keyword: string) => {
    setFilters((prev) => ({ ...prev, keyword: keyword || undefined }))
  }

  return (
    <div className="flex h-screen flex-col bg-background">
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

      {/* Main Content */}
      <main className="mx-auto max-w-7xl flex-1 px-4 py-4 md:px-6 md:py-6">
        <div className="grid grid-cols-1 gap-4 h-[calc(100vh-140px)] md:grid-cols-12 md:gap-6 md:h-[calc(100vh-180px)]">
          {/* Left Sidebar - Filters */}
          <aside className="hidden md:block md:col-span-3 overflow-y-auto">
            <FilterPanel filters={filters} onChange={setFilters} />
          </aside>

          {/* Middle - Job List */}
          <section className="col-span-1 overflow-hidden md:col-span-4">
            <JobList
              filters={filters}
              selectedJobId={selectedJob?.id ?? null}
              onSelectJob={setSelectedJob}
            />
          </section>

          {/* Right - Job Detail */}
          <section className="hidden md:block md:col-span-5 overflow-hidden">
            <JobDetail job={selectedJob} />
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
