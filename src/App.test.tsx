import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from './App'

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

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>
}

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该渲染路由', () => {
    // Note: With routing, the actual content is rendered by page components
    // This test verifies the routing setup works without errors
    const { container } = render(<App />, { wrapper: TestWrapper })
    expect(container).toBeInTheDocument()
  })
})
