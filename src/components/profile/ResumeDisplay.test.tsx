/**
 * ResumeDisplay Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResumeDisplay } from './ResumeDisplay'

describe('ResumeDisplay', () => {
  const mockFileName = 'my-resume.pdf'
  const mockUploadDate = new Date('2024-01-15')
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该渲染文件名', () => {
    render(
      <ResumeDisplay fileName={mockFileName} uploadDate={mockUploadDate} onDelete={mockOnDelete} />
    )

    expect(screen.getByText('my-resume.pdf')).toBeInTheDocument()
  })

  it('应该渲染上传日期', () => {
    render(
      <ResumeDisplay fileName={mockFileName} uploadDate={mockUploadDate} onDelete={mockOnDelete} />
    )

    expect(screen.getByText(/Uploaded/)).toBeInTheDocument()
  })

  it('应该渲染删除按钮', () => {
    render(
      <ResumeDisplay fileName={mockFileName} uploadDate={mockUploadDate} onDelete={mockOnDelete} />
    )

    const deleteButton = screen.getByRole('button')
    expect(deleteButton).toBeInTheDocument()
  })

  it('应该在点击删除按钮时调用 onDelete', () => {
    render(
      <ResumeDisplay fileName={mockFileName} uploadDate={mockUploadDate} onDelete={mockOnDelete} />
    )

    const deleteButton = screen.getByRole('button')
    deleteButton.click()

    expect(mockOnDelete).toHaveBeenCalledTimes(1)
  })
})
