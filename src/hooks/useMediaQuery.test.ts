import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMediaQuery } from './useMediaQuery'

// Mock window.matchMedia
const mockMatchMedia = vi.fn()

describe('useMediaQuery', () => {
  let originalMatchMedia: typeof window.matchMedia

  beforeEach(() => {
    originalMatchMedia = window.matchMedia
    vi.clearAllMocks()
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('returns initial match value', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
    window.matchMedia = mockMatchMedia

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))

    expect(result.current).toBe(true)
  })

  it('updates when media query changes', () => {
    let listener: ((event: MediaQueryListEvent) => void) | null = null

    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn((event, callback) => {
        if (event === 'change') {
          listener = callback as (event: MediaQueryListEvent) => void
        }
      }),
      removeEventListener: vi.fn(),
    })
    window.matchMedia = mockMatchMedia

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))

    expect(result.current).toBe(false)

    // Simulate media query change
    act(() => {
      listener?.({ matches: true } as MediaQueryListEvent)
    })

    expect(result.current).toBe(true)
  })

  it('cleans up event listener on unmount', () => {
    const removeEventListener = vi.fn()
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener,
    })
    window.matchMedia = mockMatchMedia

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'))

    unmount()

    expect(removeEventListener).toHaveBeenCalled()
  })
})
