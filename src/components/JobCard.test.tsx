import { describe, it, expect } from 'vitest'
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
    // Company name displayed with building icon
    expect(screen.getByText('TechCorp')).toBeInTheDocument()
    // Location text displayed next to pin icon
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument()
  })

  it('shows company icon on title row', () => {
    render(<JobCard job={mockJob} isActive={false} />, {
      wrapper: createWrapper(),
    })

    // Check that TechCorp is displayed (company name)
    expect(screen.getByText('TechCorp')).toBeInTheDocument()
    // Check that Building icon exists in the card
    const card = screen.getByTestId('job-card')
    expect(card.querySelector('.lucide-building')).toBeInTheDocument()
  })

  it('shows location, work arrangement and employment type with icons and text', () => {
    render(<JobCard job={mockJob} isActive={false} />, {
      wrapper: createWrapper(),
    })

    // Check for icons with text
    expect(screen.getByText('📍')).toBeInTheDocument() // Location icon
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument() // Location text
    expect(screen.getByText('🏠')).toBeInTheDocument() // Work arrangement icon
    expect(screen.getByText('Remote')).toBeInTheDocument() // Work arrangement text
    expect(screen.getByText('💼')).toBeInTheDocument() // Employment type icon
    expect(screen.getByText('Full-time')).toBeInTheDocument() // Employment type text
  })

  it('shows job description preview', () => {
    render(<JobCard job={mockJob} isActive={false} />, {
      wrapper: createWrapper(),
    })

    // Use data-testid to select the specific card and check description
    const card = screen.getByTestId('job-card')
    expect(card).toContainHTML('Develop and maintain')
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
