/**
 * JobFilterPanel Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { JobFilterPanel } from './JobFilterPanel'

describe('JobFilterPanel', () => {
  const mockOnJobSeek = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该渲染标题', () => {
    render(<JobFilterPanel analysisComplete={false} onJobSeek={mockOnJobSeek} />)

    expect(screen.getByText('Job Preferences')).toBeInTheDocument()
  })

  it('应该为 491 签证持有人显示签证消息', () => {
    render(
      <JobFilterPanel visaType="491" analysisComplete={false} onJobSeek={mockOnJobSeek} />
    )

    expect(
      screen.getByText(/Focus on regional areas for better opportunities/)
    ).toBeInTheDocument()
  })

  it('应该为 482 签证持有人显示签证消息', () => {
    render(
      <JobFilterPanel visaType="482" analysisComplete={false} onJobSeek={mockOnJobSeek} />
    )

    expect(
      screen.getByText(/Eligible for both regional and metropolitan/)
    ).toBeInTheDocument()
  })

  it('不应该为没有签证的用户显示消息', () => {
    render(<JobFilterPanel analysisComplete={false} onJobSeek={mockOnJobSeek} />)

    expect(
      screen.queryByText(/Focus on regional areas/)
    ).not.toBeInTheDocument()
  })

  it('应该在未完成分析时禁用按钮', () => {
    render(<JobFilterPanel analysisComplete={false} onJobSeek={mockOnJobSeek} />)

    const button = screen.getByRole('button', { name: 'Job Seeking' })
    expect(button).toBeDisabled()
  })

  it('应该显示提示消息当未完成分析时', () => {
    render(<JobFilterPanel analysisComplete={false} onJobSeek={mockOnJobSeek} />)

    expect(
      screen.getByText('Complete AI analysis to enable job search')
    ).toBeInTheDocument()
  })

  it('应该在选择地点和工作类型后启用按钮', async () => {
    render(<JobFilterPanel analysisComplete onJobSeek={mockOnJobSeek} />)

    const locationCheckbox = screen.getByLabelText('Canberra')
    const jobTypeCheckbox = screen.getByLabelText('Full Time')

    await userEvent.click(locationCheckbox)
    await userEvent.click(jobTypeCheckbox)

    const button = screen.getByRole('button', { name: 'Job Seeking' })
    expect(button).not.toBeDisabled()
  })

  it('应该在未选择地点时禁用按钮', async () => {
    render(<JobFilterPanel analysisComplete onJobSeek={mockOnJobSeek} />)

    const jobTypeCheckbox = screen.getByLabelText('Full Time')
    await userEvent.click(jobTypeCheckbox)

    const button = screen.getByRole('button', { name: 'Job Seeking' })
    expect(button).toBeDisabled()
  })

  it('应该在未选择工作类型时禁用按钮', async () => {
    render(<JobFilterPanel analysisComplete onJobSeek={mockOnJobSeek} />)

    const locationCheckbox = screen.getByLabelText('Canberra')
    await userEvent.click(locationCheckbox)

    const button = screen.getByRole('button', { name: 'Job Seeking' })
    expect(button).toBeDisabled()
  })

  it('应该在点击按钮时调用 onJobSeek', async () => {
    render(<JobFilterPanel analysisComplete onJobSeek={mockOnJobSeek} />)

    const locationCheckbox = screen.getByLabelText('Canberra')
    const jobTypeCheckbox = screen.getByLabelText('Full Time')

    await userEvent.click(locationCheckbox)
    await userEvent.click(jobTypeCheckbox)

    const button = screen.getByRole('button', { name: 'Job Seeking' })
    await userEvent.click(button)

    expect(mockOnJobSeek).toHaveBeenCalledWith({
      locations: ['canberra'],
      jobTypes: ['full-time'],
      postedTime: undefined,
      remoteOption: undefined,
    })
  })

  it('应该支持多选地点', async () => {
    render(<JobFilterPanel analysisComplete onJobSeek={mockOnJobSeek} />)

    await userEvent.click(screen.getByLabelText('Canberra'))
    await userEvent.click(screen.getByLabelText('Adelaide'))
    await userEvent.click(screen.getByLabelText('Full Time'))

    const button = screen.getByRole('button', { name: 'Job Seeking' })
    await userEvent.click(button)

    expect(mockOnJobSeek).toHaveBeenCalledWith(
      expect.objectContaining({
        locations: ['canberra', 'adelaide'],
      })
    )
  })

  it('应该支持多选工作类型', async () => {
    render(<JobFilterPanel analysisComplete onJobSeek={mockOnJobSeek} />)

    await userEvent.click(screen.getByLabelText('Canberra'))
    await userEvent.click(screen.getByLabelText('Full Time'))
    await userEvent.click(screen.getByLabelText('Part Time'))

    const button = screen.getByRole('button', { name: 'Job Seeking' })
    await userEvent.click(button)

    expect(mockOnJobSeek).toHaveBeenCalledWith(
      expect.objectContaining({
        jobTypes: ['full-time', 'part-time'],
      })
    )
  })

  it('应该支持选择发布时间', async () => {
    render(<JobFilterPanel analysisComplete onJobSeek={mockOnJobSeek} />)

    await userEvent.click(screen.getByLabelText('Canberra'))
    await userEvent.click(screen.getByLabelText('Full Time'))

    // Open Posted Date section
    await userEvent.click(screen.getByRole('button', { name: 'Posted Date' }))
    await userEvent.click(screen.getByLabelText('1 day ago'))

    const button = screen.getByRole('button', { name: 'Job Seeking' })
    await userEvent.click(button)

    expect(mockOnJobSeek).toHaveBeenCalledWith(
      expect.objectContaining({
        postedTime: '1d',
      })
    )
  })

  it('应该支持选择远程选项', async () => {
    render(<JobFilterPanel analysisComplete onJobSeek={mockOnJobSeek} />)

    await userEvent.click(screen.getByLabelText('Canberra'))
    await userEvent.click(screen.getByLabelText('Full Time'))

    // Open Work Mode section
    await userEvent.click(screen.getByRole('button', { name: 'Work Mode' }))
    await userEvent.click(screen.getByLabelText('Remote'))

    const button = screen.getByRole('button', { name: 'Job Seeking' })
    await userEvent.click(button)

    expect(mockOnJobSeek).toHaveBeenCalledWith(
      expect.objectContaining({
        remoteOption: 'remote',
      })
    )
  })

  it('应该渲染所有地点选项', async () => {
    render(<JobFilterPanel analysisComplete onJobSeek={mockOnJobSeek} />)

    // Location is defaultExpanded, so options should be visible
    expect(screen.getByLabelText('Canberra')).toBeInTheDocument()
    expect(screen.getByLabelText('Adelaide')).toBeInTheDocument()
    expect(screen.getByLabelText('Perth')).toBeInTheDocument()
    expect(screen.getByLabelText('Gold Coast')).toBeInTheDocument()
    expect(screen.getByLabelText('All Regional Areas')).toBeInTheDocument()
    expect(screen.getByLabelText('All Australia (Including Non-Regional)')).toBeInTheDocument()
  })

  it('应该渲染所有工作类型选项', () => {
    render(<JobFilterPanel analysisComplete onJobSeek={mockOnJobSeek} />)

    expect(screen.getByLabelText('Full Time')).toBeInTheDocument()
    expect(screen.getByLabelText('Part Time')).toBeInTheDocument()
    expect(screen.getByLabelText('Contract')).toBeInTheDocument()
  })

  it('应该渲染所有远程选项', async () => {
    render(<JobFilterPanel analysisComplete onJobSeek={mockOnJobSeek} />)

    // Open Work Mode section first
    await userEvent.click(screen.getByRole('button', { name: 'Work Mode' }))

    expect(screen.getByLabelText('Onsite')).toBeInTheDocument()
    expect(screen.getByLabelText('Hybrid')).toBeInTheDocument()
    expect(screen.getByLabelText('Remote')).toBeInTheDocument()
  })

  it('应该渲染所有发布时间选项', async () => {
    render(<JobFilterPanel analysisComplete onJobSeek={mockOnJobSeek} />)

    // Open Posted Date section first
    await userEvent.click(screen.getByRole('button', { name: 'Posted Date' }))

    expect(screen.getByLabelText('1 day ago')).toBeInTheDocument()
    expect(screen.getByLabelText('3 days ago')).toBeInTheDocument()
    expect(screen.getByLabelText('1 week ago')).toBeInTheDocument()
    expect(screen.getByLabelText('1 month ago')).toBeInTheDocument()
  })
})
