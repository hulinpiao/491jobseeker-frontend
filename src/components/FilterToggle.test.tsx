import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterToggle } from './FilterToggle'

describe('FilterToggle', () => {
  it('renders toggle button', () => {
    render(<FilterToggle show={false} onToggle={vi.fn()} />)

    expect(screen.getByText('Filters')).toBeInTheDocument()
    expect(screen.getByText('▼')).toBeInTheDocument()
  })

  it('shows expanded icon when show is true', () => {
    render(<FilterToggle show={true} onToggle={vi.fn()} />)

    expect(screen.getByText('▲')).toBeInTheDocument()
  })

  it('displays active filter count', () => {
    render(<FilterToggle show={false} onToggle={vi.fn()} count={3} />)

    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('does not display count when zero', () => {
    render(<FilterToggle show={false} onToggle={vi.fn()} count={0} />)

    // Should not show a badge with 0
    const badge = screen.queryByText('0')
    expect(badge).not.toBeInTheDocument()
  })

  it('calls onToggle when clicked', async () => {
    const user = userEvent.setup()
    const handleToggle = vi.fn()

    render(<FilterToggle show={false} onToggle={handleToggle} />)

    const button = screen.getByRole('button', { name: /toggle filters/i })
    await user.click(button)

    expect(handleToggle).toHaveBeenCalledOnce()
  })

  it('has correct aria-expanded attribute', () => {
    const { rerender } = render(<FilterToggle show={false} onToggle={vi.fn()} />)

    const button = screen.getByRole('button', { name: /toggle filters/i })
    expect(button).toHaveAttribute('aria-expanded', 'false')

    rerender(<FilterToggle show={true} onToggle={vi.fn()} />)
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })
})
