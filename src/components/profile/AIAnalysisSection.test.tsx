/**
 * AIAnalysisSection Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AIAnalysisSection } from './AIAnalysisSection'

// Mock resumeApi
vi.mock('@/services/resumeApi', () => ({
  resumeApi: {
    analyzeResume: vi.fn(),
  },
}))

import { resumeApi } from '@/services/resumeApi'

const mockAnalyzeResume = resumeApi.analyzeResume as ReturnType<typeof vi.fn>

describe('AIAnalysisSection', () => {
  const mockResumeId = 'resume-123'
  const mockOnComplete = vi.fn()

  const mockAnalysisResult = {
    skills: [
      { category: 'Frontend', items: ['React', 'TypeScript'] },
      { category: 'Backend', items: ['Node.js', 'Python'] },
    ],
    summary: 'Experienced software developer with 5 years of experience.',
    jobKeywords: ['Frontend Developer', 'Full Stack Developer'],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该渲染分析按钮', () => {
    render(<AIAnalysisSection resumeId={mockResumeId} onAnalysisComplete={mockOnComplete} />)

    expect(screen.getByText('Analyze Your Resume')).toBeInTheDocument()
    expect(screen.getByText(/Analyze Resume with AI/)).toBeInTheDocument()
  })

  it('应该显示描述文本', () => {
    render(<AIAnalysisSection resumeId={mockResumeId} onAnalysisComplete={mockOnComplete} />)

    expect(
      screen.getByText(/Get AI-powered insights into your skills/)
    ).toBeInTheDocument()
  })

  it('应该在点击按钮时触发分析', async () => {
    mockAnalyzeResume.mockResolvedValueOnce(mockAnalysisResult)

    render(<AIAnalysisSection resumeId={mockResumeId} onAnalysisComplete={mockOnComplete} />)

    const button = screen.getByRole('button', { name: /Analyze Resume with AI/ })
    await userEvent.click(button)

    expect(mockAnalyzeResume).toHaveBeenCalledWith(mockResumeId)
  })

  it('应该在分析完成后显示结果', async () => {
    mockAnalyzeResume.mockResolvedValueOnce(mockAnalysisResult)

    render(<AIAnalysisSection resumeId={mockResumeId} onAnalysisComplete={mockOnComplete} />)

    const button = screen.getByRole('button', { name: /Analyze Resume with AI/ })
    await userEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('AI Analysis Results')).toBeInTheDocument()
    })

    expect(screen.getByText('Skills')).toBeInTheDocument()
    expect(screen.getByText('Summary')).toBeInTheDocument()
    expect(screen.getByText('Recommended Job Titles')).toBeInTheDocument()
  })

  it('应该调用 onAnalysisComplete 回调', async () => {
    mockAnalyzeResume.mockResolvedValueOnce(mockAnalysisResult)

    render(<AIAnalysisSection resumeId={mockResumeId} onAnalysisComplete={mockOnComplete} />)

    const button = screen.getByRole('button', { name: /Analyze Resume with AI/ })
    await userEvent.click(button)

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith(mockAnalysisResult)
    })
  })

  it('应该在分析失败时显示错误', async () => {
    mockAnalyzeResume.mockRejectedValueOnce(new Error('Analysis failed'))

    render(<AIAnalysisSection resumeId={mockResumeId} onAnalysisComplete={mockOnComplete} />)

    const button = screen.getByRole('button', { name: /Analyze Resume with AI/ })
    await userEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Analysis Failed')).toBeInTheDocument()
    })
  })

  it('应该显示技能分类', async () => {
    mockAnalyzeResume.mockResolvedValueOnce(mockAnalysisResult)

    render(<AIAnalysisSection resumeId={mockResumeId} onAnalysisComplete={mockOnComplete} />)

    const button = screen.getByRole('button', { name: /Analyze Resume with AI/ })
    await userEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Frontend')).toBeInTheDocument()
      expect(screen.getByText('Backend')).toBeInTheDocument()
    })
  })

  it('应该显示职位关键词', async () => {
    mockAnalyzeResume.mockResolvedValueOnce(mockAnalysisResult)

    render(<AIAnalysisSection resumeId={mockResumeId} onAnalysisComplete={mockOnComplete} />)

    const button = screen.getByRole('button', { name: /Analyze Resume with AI/ })
    await userEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
      expect(screen.getByText('Full Stack Developer')).toBeInTheDocument()
    })
  })
})
