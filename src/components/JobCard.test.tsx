import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { JobCard } from './JobCard'
import type { Job } from '@/types/job'

const mockJob: Job = {
  id: '1',
  title: '高级前端工程师',
  company: 'ByteDance',
  location: '北京',
  city: '北京',
  state: '北京',
  country: '中国',
  description: '负责抖音核心业务的前端开发',
  employmentType: 'full_time',
  workArrangement: 'remote',
  applyLink: 'https://example.com/apply',
  sources: [
    { platform: 'boss', jobId: '123', url: 'https://boss.com/job/123' },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('JobCard', () => {
  it('renders job information', () => {
    render(<JobCard job={mockJob} isActive={false} onClick={() => {}} />)

    expect(screen.getByText('高级前端工程师')).toBeInTheDocument()
    expect(screen.getByText('ByteDance')).toBeInTheDocument()
    // Use function matcher for text split across elements
    expect(screen.getByText((_content, element) => {
      return element?.textContent === '北京, 北京'
    })).toBeInTheDocument()
  })

  it('shows employment type and work arrangement', () => {
    render(<JobCard job={mockJob} isActive={false} onClick={() => {}} />)

    expect(screen.getByText('全职')).toBeInTheDocument()
    expect(screen.getByText('远程')).toBeInTheDocument()
  })

  it('applies active styling when selected', () => {
    const { container, rerender } = render(<JobCard job={mockJob} isActive={false} onClick={() => {}} />)
    const card = container.firstChild as HTMLElement

    expect(card).not.toHaveClass('border-primary')

    rerender(<JobCard job={mockJob} isActive={true} onClick={() => {}} />)
    expect(card).toHaveClass('border-primary')
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<JobCard job={mockJob} isActive={false} onClick={handleClick} />)

    const card = screen.getByText('高级前端工程师').closest('.cursor-pointer')
    if (card) {
      await user.click(card)
      expect(handleClick).toHaveBeenCalled()
    }
  })
})
