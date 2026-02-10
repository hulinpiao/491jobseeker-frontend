import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { SearchBar } from '../components/SearchBar'
import { FilterPanel } from '../components/FilterPanel'
import { FilterToggle } from '../components/FilterToggle'
import { JobList } from '../components/JobList'
import { useMediaQuery } from '../hooks/useMediaQuery'
import type { JobFilters, EmploymentType, WorkArrangement } from '../types/job'

export function JobListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  // Read filters from URL params
  const filters: JobFilters = useMemo(() => {
    const keyword = searchParams.get('keyword') || undefined
    const location = searchParams.get('location') || undefined
    const employmentType = (searchParams.get('employmentType') as EmploymentType) || undefined
    const workArrangement = (searchParams.get('workArrangement') as WorkArrangement) || undefined

    return {
      ...(keyword && { keyword }),
      ...(location && { location }),
      ...(employmentType && { employmentType }),
      ...(workArrangement && { workArrangement }),
    }
  }, [searchParams])

  // Count active filters for the badge
  const activeFilterCount = Object.keys(filters).length

  // Read page from URL params
  const page = parseInt(searchParams.get('page') || '1', 10)

  const handleSearch = () => {
    // Search is triggered by filter changes in JobList
    // This is just a placeholder for explicit search action
  }

  const handleKeywordChange = (keyword: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (keyword) {
      newParams.set('keyword', keyword)
    } else {
      newParams.delete('keyword')
    }
    setSearchParams(newParams)
  }

  const handleFilterChange = (newFilters: JobFilters) => {
    const newParams = new URLSearchParams(searchParams)

    // Update params based on new filters
    if (newFilters.keyword) {
      newParams.set('keyword', newFilters.keyword)
    } else {
      newParams.delete('keyword')
    }

    if (newFilters.location) {
      newParams.set('location', newFilters.location)
    } else {
      newParams.delete('location')
    }

    if (newFilters.employmentType) {
      newParams.set('employmentType', newFilters.employmentType)
    } else {
      newParams.delete('employmentType')
    }

    if (newFilters.workArrangement) {
      newParams.set('workArrangement', newFilters.workArrangement)
    } else {
      newParams.delete('workArrangement')
    }

    setSearchParams(newParams)
  }

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams)
    if (newPage > 1) {
      newParams.set('page', newPage.toString())
    } else {
      newParams.delete('page')
    }
    setSearchParams(newParams)
  }

  // Show filter panel on desktop or when toggled on mobile
  const showFilterPanel = isDesktop || showMobileFilter

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      {/* Main Content - Vertical Stack Layout */}
      <main className="flex-1">
        {/* Search Section */}
        <section className="border-b bg-card px-6 py-6">
          <div className="mx-auto max-w-7xl">
            <h1 className="mb-4 text-2xl font-bold">Find Jobs</h1>
            <SearchBar
              value={filters.keyword ?? ''}
              onChange={handleKeywordChange}
              onSearch={handleSearch}
            />
          </div>
        </section>

        {/* Filters and Job List */}
        <section className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 md:py-6">
          <div className="flex flex-col gap-4">
            {/* Mobile Filter Toggle - hidden on desktop */}
            <FilterToggle
              show={showMobileFilter}
              onToggle={() => setShowMobileFilter(!showMobileFilter)}
              count={activeFilterCount}
            />

            {/* Filters - shown on desktop or when toggled on mobile */}
            {showFilterPanel && (
              <div className="overflow-hidden transition-all duration-300 ease-in-out">
                <FilterPanel filters={filters} onChange={handleFilterChange} />
              </div>
            )}

            {/* Job List */}
            <JobList filters={filters} page={page} onPageChange={handlePageChange} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
