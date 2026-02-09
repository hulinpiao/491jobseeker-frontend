import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { JobCard } from './JobCard'
import type { Job } from '@/types/job'

const mockJob: Job = {
  id: '1',
  title: 'Senior Frontend Engineer',
  company: 'TechCorp',
  location: 'San Francisco, CA',
  city: 'San Francisco',
  state: 'CA',
  country: 'USA',
  description: 'Develop and maintain core frontend features for our platform',
  employmentType: 'full_time',
  workArrangement: 'remote',
  applyLink: 'https://example.com/apply',
  sources: [
    { platform: 'linkedin', jobId: '123', url: 'https://linkedin.com/job/123' },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

function createWrapper() {
  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>{children}</MemoryRouter>
  )
}

describe('JobCard', () => {
  it('renders job information', () => {
    render(<JobCard job={mockJob} isActive={false} />, {
      wrapper: createWrapper(),
    })

    expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument()
    expect(screen.getByText('TechCorp')).toBeInTheDocument()
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument()
  })

  it('shows employment type and work arrangement badges', () => {
    render(<JobCard job={mockJob} isActive={false} />, {
      wrapper: createWrapper(),
    })

    expect(screen.getByText('Full-time')).toBeInTheDocument()
    expect(screen.getByText('Remote')).toBeInTheDocument()
  })

  it('shows job description preview', () => {
    render(<JobCard job={mockJob} isActive={false} />, {
      wrapper: createWrapper(),
    })

    expect(screen.getByText(/Develop and maintain core frontend features/)).toBeInTheDocument()
  })

  it('applies active styling when selected', () => {
    const { container, rerender } = render(<JobCard job={mockJob} isActive={false} />, {
      wrapper: createWrapper(),
    })
    const card = container.firstChild as HTMLElement

    expect(card).not.toHaveClass('border-primary')

    rerender(<JobCard job={mockJob} isActive={true} />)
    expect(card).toHaveClass('border-primary')
  })

  it('contains link to job detail page', () => {
    const { container } = render(<JobCard job={mockJob} isActive={false} />, {
      wrapper: createWrapper(),
    })

    const link = container.querySelector('a')
    expect(link).toHaveAttribute('href', '/jobs/1')
  })
})
