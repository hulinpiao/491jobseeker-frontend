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
  salary: { min: 35000, max: 55000, currency: 'CNY', period: 'month' },
  type: 'full-time',
  status: 'active',
  description: '负责抖音核心业务的前端开发',
  requirements: ['5年以上前端经验', '精通 React'],
  postedAt: new Date().toISOString(),
  source: 'boss',
}

describe('JobCard', () => {
  it('renders job information', () => {
    render(<JobCard job={mockJob} isActive={false} onClick={() => {}} />)

    expect(screen.getByText('高级前端工程师')).toBeInTheDocument()
    expect(screen.getByText('ByteDance')).toBeInTheDocument()
    expect(screen.getByText('北京')).toBeInTheDocument()
    expect(screen.getByText(/CNY 35,000/)).toBeInTheDocument()
  })

  it('shows status badge', () => {
    render(<JobCard job={mockJob} isActive={false} onClick={() => {}} />)

    expect(screen.getByText('待申请')).toBeInTheDocument()
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
