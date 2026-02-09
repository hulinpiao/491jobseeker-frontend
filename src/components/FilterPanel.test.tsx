import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterPanel } from './FilterPanel'

describe('FilterPanel', () => {
  it('should render filter panel', () => {
    render(
      <FilterPanel filters={{}} onChange={vi.fn()} />
    )
    expect(screen.getByText('Filters')).toBeInTheDocument()
  })

  it('should display location input', () => {
    render(<FilterPanel filters={{}} onChange={vi.fn()} />)
    expect(screen.getByLabelText('Location')).toBeInTheDocument()
  })

  it('should support entering location and trigger onChange', async () => {
    const onChange = vi.fn()
    render(<FilterPanel filters={{}} onChange={onChange} />)

    const input = screen.getByLabelText('Location')
    await userEvent.type(input, 'Sydney')

    expect(onChange).toHaveBeenCalled()
  })

  it('should display the passed location value', () => {
    render(<FilterPanel filters={{ location: 'Sydney' }} onChange={vi.fn()} />)
    const input = screen.getByLabelText('Location') as HTMLInputElement
    expect(input.value).toBe('Sydney')
  })

  it('should support selecting employment type and trigger onChange', async () => {
    const onChange = vi.fn()
    render(<FilterPanel filters={{}} onChange={onChange} />)

    const select = screen.getByLabelText('Employment Type')
    await userEvent.selectOptions(select, 'full_time')

    expect(onChange).toHaveBeenCalled()
  })

  it('should support selecting work arrangement and trigger onChange', async () => {
    const onChange = vi.fn()
    render(<FilterPanel filters={{}} onChange={onChange} />)

    const select = screen.getByLabelText('Work Arrangement')
    await userEvent.selectOptions(select, 'remote')

    expect(onChange).toHaveBeenCalled()
  })

  it('should support clearing all filters', async () => {
    const onChange = vi.fn()
    render(
      <FilterPanel
        filters={{ location: 'Sydney', employmentType: 'full_time' }}
        onChange={onChange}
      />
    )

    const clearButton = screen.getByText('Clear')
    await userEvent.click(clearButton)

    expect(onChange).toHaveBeenCalledWith({})
  })

  it('should show clear button when filters are active', () => {
    render(
      <FilterPanel filters={{ location: 'Sydney' }} onChange={vi.fn()} />
    )
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })

  it('should hide clear button when no filters are active', () => {
    render(<FilterPanel filters={{}} onChange={vi.fn()} />)
    expect(screen.queryByText('Clear')).not.toBeInTheDocument()
  })
})
