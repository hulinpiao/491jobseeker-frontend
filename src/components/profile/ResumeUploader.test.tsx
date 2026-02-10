/**
 * ResumeUploader Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ResumeUploader } from './ResumeUploader'

// Store onDrop callback for tests
let mockOnDrop: ((files: File[]) => void) | null = null

// Mock react-dropzone
vi.mock('react-dropzone', () => ({
  useDropzone: ({ onDrop }: { onDrop: (files: File[]) => void }) => {
    mockOnDrop = onDrop
    return {
      getRootProps: () => ({ 'data-testid': 'dropzone' }),
      getInputProps: () => ({ 'data-testid': 'file-input' }),
      isDragActive: false,
      fileRejections: [],
      open: () => onDrop([]),
    }
  },
}))

// Mock resumeApi
vi.mock('@/services/resumeApi', () => ({
  resumeApi: {
    uploadResume: vi.fn(),
  },
}))

import { resumeApi } from '@/services/resumeApi'

const mockUploadResume = resumeApi.uploadResume as ReturnType<typeof vi.fn>

describe('ResumeUploader', () => {
  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockOnDrop = null
  })

  it('应该渲染上传区域', () => {
    render(<ResumeUploader onUploadSuccess={mockOnSuccess} />)

    expect(screen.getByText('Drag & drop your resume')).toBeInTheDocument()
    expect(screen.getByText('or click to browse')).toBeInTheDocument()
    expect(screen.getByText(/Supported formats/)).toBeInTheDocument()
  })

  it('应该显示支持的文件格式', () => {
    render(<ResumeUploader onUploadSuccess={mockOnSuccess} />)

    expect(screen.getByText(/PDF, DOC, DOCX, TXT/)).toBeInTheDocument()
    expect(screen.getByText(/max 5MB/)).toBeInTheDocument()
  })

  it('应该在上传成功时调用 onUploadSuccess', async () => {
    mockUploadResume.mockResolvedValueOnce({
      resumeId: 'resume-123',
      fileName: 'test.pdf',
      uploadDate: new Date().toISOString(),
    })

    render(<ResumeUploader onUploadSuccess={mockOnSuccess} />)

    // Simulate file drop using the mock callback
    const testFile = new File(['content'], 'test.pdf', { type: 'application/pdf' })
    mockOnDrop?.([testFile])

    await waitFor(() => {
      expect(mockUploadResume).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith({
        resumeId: 'resume-123',
        fileName: 'test.pdf',
      })
    })
  })

  it('应该在上传失败时调用 onUploadError', async () => {
    const error = new Error('Upload failed')
    mockUploadResume.mockRejectedValueOnce(error)

    render(<ResumeUploader onUploadSuccess={mockOnSuccess} onUploadError={mockOnError} />)

    const testFile = new File(['content'], 'test.pdf', { type: 'application/pdf' })
    mockOnDrop?.([testFile])

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(error)
    })
  })

  it('应该在上传失败时显示错误消息', async () => {
    mockUploadResume.mockRejectedValueOnce(new Error('Network error'))

    render(<ResumeUploader onUploadSuccess={mockOnSuccess} />)

    const testFile = new File(['content'], 'test.pdf', { type: 'application/pdf' })
    mockOnDrop?.([testFile])

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  it('应该在上传时显示加载状态', async () => {
    mockUploadResume.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({ resumeId: 'resume-123', fileName: 'test.pdf', uploadDate: new Date().toISOString() })
          }, 100)
        })
    )

    render(<ResumeUploader onUploadSuccess={mockOnSuccess} />)

    const testFile = new File(['content'], 'test.pdf', { type: 'application/pdf' })
    mockOnDrop?.([testFile])

    await waitFor(() => {
      expect(screen.getByText(/Uploading\.\.\./)).toBeInTheDocument()
    })
  })
})
