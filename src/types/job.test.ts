import { describe, it, expect } from 'vitest'
import { normalizeJob, type ApiJob } from './job'

describe('Job Types', () => {
  describe('normalizeJob', () => {
    const mockApiJob: ApiJob = {
      _id: '507f1f77bcf86cd799439011',
      dedup_key: 'test-key',
      job_title: '高级前端工程师',
      company_name_normalized: 'ByteDance',
      job_location: '北京, 中国',
      city: '北京',
      state: '北京',
      country: '中国',
      job_description: '负责抖音核心业务的前端开发',
      employment_type: 'full_time',
      work_arrangement: 'remote',
      apply_link: 'https://example.com/apply',
      sources: [
        {
          platform: 'boss',
          job_posting_id: '123',
          url: 'https://boss.com/job/123',
        },
      ],
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
    }

    it('应该正确转换 API 职位数据到前端职位数据', () => {
      const result = normalizeJob(mockApiJob)

      expect(result).toEqual({
        id: '507f1f77bcf86cd799439011',
        title: '高级前端工程师',
        company: 'ByteDance',
        location: '北京, 中国',
        city: '北京',
        state: '北京',
        country: '中国',
        description: '负责抖音核心业务的前端开发',
        employmentType: 'full_time',
        workArrangement: 'remote',
        applyLink: 'https://example.com/apply',
        sources: [
          {
            platform: 'boss',
            jobId: '123',
            url: 'https://boss.com/job/123',
          },
        ],
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      })
    })

    it('应该将 _id 映射到 id', () => {
      const result = normalizeJob(mockApiJob)
      expect(result.id).toBe(mockApiJob._id)
    })

    it('应该将 job_title 映射到 title', () => {
      const result = normalizeJob(mockApiJob)
      expect(result.title).toBe(mockApiJob.job_title)
    })

    it('应该将 company_name_normalized 映射到 company', () => {
      const result = normalizeJob(mockApiJob)
      expect(result.company).toBe(mockApiJob.company_name_normalized)
    })

    it('应该将 job_location 映射到 location', () => {
      const result = normalizeJob(mockApiJob)
      expect(result.location).toBe(mockApiJob.job_location)
    })

    it('应该将 job_description 映射到 description', () => {
      const result = normalizeJob(mockApiJob)
      expect(result.description).toBe(mockApiJob.job_description)
    })

    it('应该将 employment_type 映射到 employmentType', () => {
      const result = normalizeJob(mockApiJob)
      expect(result.employmentType).toBe(mockApiJob.employment_type)
    })

    it('应该将 work_arrangement 映射到 workArrangement', () => {
      const result = normalizeJob(mockApiJob)
      expect(result.workArrangement).toBe(mockApiJob.work_arrangement)
    })

    it('应该正确转换 sources 数组', () => {
      const result = normalizeJob(mockApiJob)
      expect(result.sources).toHaveLength(1)
      expect(result.sources[0]).toEqual({
        platform: 'boss',
        jobId: '123',
        url: 'https://boss.com/job/123',
      })
    })

    it('应该将 job_posting_id 映射到 jobId', () => {
      const result = normalizeJob(mockApiJob)
      expect(result.sources[0].jobId).toBe(mockApiJob.sources[0].job_posting_id)
    })

    it('应该将 created_at 映射到 createdAt', () => {
      const result = normalizeJob(mockApiJob)
      expect(result.createdAt).toBe(mockApiJob.created_at)
    })

    it('应该将 updated_at 映射到 updatedAt', () => {
      const result = normalizeJob(mockApiJob)
      expect(result.updatedAt).toBe(mockApiJob.updated_at)
    })

    it('应该处理空的 sources 数组', () => {
      const jobWithEmptySources: ApiJob = {
        ...mockApiJob,
        sources: [],
      }
      const result = normalizeJob(jobWithEmptySources)
      expect(result.sources).toEqual([])
    })

    it('应该处理多个 sources', () => {
      const jobWithMultipleSources: ApiJob = {
        ...mockApiJob,
        sources: [
          { platform: 'boss', job_posting_id: '123', url: 'https://boss.com/job/123' },
          { platform: 'linkedin', job_posting_id: '456', url: 'https://linkedin.com/job/456' },
        ],
      }
      const result = normalizeJob(jobWithMultipleSources)
      expect(result.sources).toHaveLength(2)
      expect(result.sources[0].platform).toBe('boss')
      expect(result.sources[1].platform).toBe('linkedin')
    })

    it('应该支持所有 employment_type 值', () => {
      const employmentTypes: ApiJob['employment_type'][] = [
        'full_time',
        'part_time',
        'contract',
        'casual',
        'temporary',
      ]

      employmentTypes.forEach((type) => {
        const job: ApiJob = { ...mockApiJob, employment_type: type }
        const result = normalizeJob(job)
        expect(result.employmentType).toBe(type)
      })
    })

    it('应该支持所有 work_arrangement 值', () => {
      const workArrangements: ApiJob['work_arrangement'][] = [
        'onsite',
        'hybrid',
        'remote',
      ]

      workArrangements.forEach((arrangement) => {
        const job: ApiJob = { ...mockApiJob, work_arrangement: arrangement }
        const result = normalizeJob(job)
        expect(result.workArrangement).toBe(arrangement)
      })
    })
  })
})
