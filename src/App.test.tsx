import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

// Mock React Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
    isLoading: false,
    error: null,
  }),
  QueryClient: vi.fn().mockImplementation(() => ({
    clear: vi.fn(),
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
}))

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该渲染应用标题', () => {
    render(<App />)
    expect(screen.getByText('491 JobSeeker')).toBeInTheDocument()
  })

  it('应该渲染搜索栏', () => {
    render(<App />)
    const searchInput = screen.getByPlaceholderText('搜索职位、公司...')
    expect(searchInput).toBeInTheDocument()
  })

  it('应该支持输入搜索关键词', async () => {
    const user = userEvent.setup()
    render(<App />)

    const searchInput = screen.getByPlaceholderText('搜索职位、公司...')
    await user.type(searchInput, '前端工程师')

    expect(searchInput).toHaveValue('前端工程师')
  })

  it('应该显示职位列表区域', () => {
    render(<App />)
    expect(screen.getByText('没有找到匹配的职位')).toBeInTheDocument()
  })

  it('应该显示筛选面板', () => {
    render(<App />)
    expect(screen.getByText('筛选条件')).toBeInTheDocument()
  })

  it('应该显示工作地点输入框', () => {
    render(<App />)
    expect(screen.getByLabelText('工作地点')).toBeInTheDocument()
  })

  it('应该显示工作类型选择框', () => {
    render(<App />)
    expect(screen.getByLabelText('工作类型')).toBeInTheDocument()
  })

  it('应该显示工作方式选择框', () => {
    render(<App />)
    expect(screen.getByLabelText('工作方式')).toBeInTheDocument()
  })
})
