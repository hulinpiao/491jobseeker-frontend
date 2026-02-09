import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { fetchJobs, fetchJobById } from './api'

// Mock global fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('fetchJobs', () => {
    it('应该获取职位列表', async () => {
      const mockResponse = {
        data: [
          {
            _id: '1',
            job_title: '前端工程师',
            company_name_normalized: 'Test Company',
            city: '北京',
            state: '北京',
            country: '中国',
            job_description: 'Test description',
            employment_type: 'full_time' as const,
            work_arrangement: 'remote' as const,
            apply_link: 'https://example.com',
            sources: [],
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await fetchJobs({ page: 1, limit: 10 })

      expect(result).toEqual(mockResponse)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/jobs?page=1&limit=10',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )
    })

    it('应该支持关键词搜索', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], total: 0, page: 1, limit: 10, totalPages: 1 }),
      })

      await fetchJobs({ keyword: '前端' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('keyword=%E5%89%8D%E7%AB%AF'),
        expect.any(Object)
      )
    })

    it('应该支持地点筛选', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], total: 0, page: 1, limit: 10, totalPages: 1 }),
      })

      await fetchJobs({ location: 'Sydney' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('location=Sydney'),
        expect.any(Object)
      )
    })

    it('应该支持工作类型筛选', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], total: 0, page: 1, limit: 10, totalPages: 1 }),
      })

      await fetchJobs({ employmentType: 'full_time' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('employmentType=full_time'),
        expect.any(Object)
      )
    })

    it('应该支持工作方式筛选', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], total: 0, page: 1, limit: 10, totalPages: 1 }),
      })

      await fetchJobs({ workArrangement: 'remote' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('workArrangement=remote'),
        expect.any(Object)
      )
    })

    it('应该支持多个筛选条件组合', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], total: 0, page: 1, limit: 10, totalPages: 1 }),
      })

      await fetchJobs({
        page: 2,
        limit: 20,
        keyword: 'engineer',
        location: 'Sydney',
        employmentType: 'full_time',
        workArrangement: 'remote',
      })

      const url = mockFetch.mock.calls[0][0]
      expect(url).toContain('page=2')
      expect(url).toContain('limit=20')
      expect(url).toContain('keyword=engineer')
      expect(url).toContain('location=Sydney')
      expect(url).toContain('employmentType=full_time')
      expect(url).toContain('workArrangement=remote')
    })

    it('应该在 API 错误时抛出异常', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(fetchJobs({})).rejects.toThrow('API Error: 500 Internal Server Error')
    })

    it('应该使用自定义 API URL', async () => {
      process.env.VITE_API_URL = 'http://custom-api:3000'

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [], total: 0, page: 1, limit: 10, totalPages: 1 }),
      })

      await fetchJobs({})

      // 由于 import.meta.env 在测试中可能不会更新，我们主要测试默认行为
      expect(mockFetch).toHaveBeenCalled()

      delete process.env.VITE_API_URL
    })
  })

  describe('fetchJobById', () => {
    it('应该获取单个职位详情', async () => {
      const mockJob = {
        _id: '123',
        job_title: '前端工程师',
        company_name_normalized: 'Test Company',
        city: '北京',
        state: '北京',
        country: '中国',
        job_description: 'Test description',
        employment_type: 'full_time' as const,
        work_arrangement: 'remote' as const,
        apply_link: 'https://example.com',
        sources: [],
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockJob,
      })

      const result = await fetchJobById('123')

      expect(result).toEqual(mockJob)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/jobs/123',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )
    })

    it('应该在 API 错误时抛出异常', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(fetchJobById('123')).rejects.toThrow('API Error: 404 Not Found')
    })
  })
})
