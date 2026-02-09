import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { JobDetail } from './JobDetail'
import type { Job } from '@/types/job'

const mockJob: Job = {
  id: '1',
  title: 'Software Engineer',
  company: 'Google',
  city: 'Sydney',
  state: 'NSW',
  country: 'AU',
  employmentType: 'full_time',
  workArrangement: 'remote',
  description: 'Test description',
  applyLink: 'https://example.com/apply',
  createdAt: '2024-01-01T00:00:00Z',
  sources: [{ platform: 'seek', url: 'https://example.com' }],
}

describe('JobDetail', () => {
  it('未选择职位时应显示提示信息', () => {
    render(<JobDetail job={null} />)
    expect(screen.getByText(/请从左侧选择/)).toBeInTheDocument()
  })

  it('应该显示职位详情', () => {
    render(<JobDetail job={mockJob} />)
    expect(screen.getByText(mockJob.title)).toBeInTheDocument()
    expect(screen.getByText(mockJob.company)).toBeInTheDocument()
  })

  it('应该显示工作类型', () => {
    render(<JobDetail job={mockJob} />)
    expect(screen.getByText('全职')).toBeInTheDocument()
  })

  it('应该显示工作方式', () => {
    render(<JobDetail job={mockJob} />)
    expect(screen.getByText('远程办公')).toBeInTheDocument()
  })

  it('应该显示工作地点', () => {
    render(<JobDetail job={mockJob} />)
    expect(screen.getByText(/Sydney/)).toBeInTheDocument()
    expect(screen.getByText(/NSW/)).toBeInTheDocument()
  })

  it('应该显示职位描述', () => {
    render(<JobDetail job={mockJob} />)
    expect(screen.getByText(mockJob.description)).toBeInTheDocument()
  })

  it('应该显示数据来源', () => {
    render(<JobDetail job={mockJob} />)
    expect(screen.getByText('seek')).toBeInTheDocument()
  })

  it('应该显示申请链接', () => {
    render(<JobDetail job={mockJob} />)
    const link = screen.getByText('申请职位').closest('a')
    expect(link).toHaveAttribute('href', mockJob.applyLink)
  })

  it('无数据来源时应隐藏来源区域', () => {
    const jobWithoutSources = { ...mockJob, sources: [] }
    render(<JobDetail job={jobWithoutSources} />)
    expect(screen.queryByText('数据来源')).not.toBeInTheDocument()
  })
})
