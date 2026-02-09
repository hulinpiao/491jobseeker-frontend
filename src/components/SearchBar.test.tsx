import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('renders input and button', () => {
    render(<SearchBar value="" onChange={() => {}} onSearch={() => {}} />)

    expect(screen.getByPlaceholderText('Search jobs, companies...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
  })

  it('displays current value', () => {
    render(<SearchBar value="React" onChange={() => {}} onSearch={() => {}} />)

    const input = screen.getByPlaceholderText('Search jobs, companies...')
    expect(input).toHaveValue('React')
  })

  it('calls onChange when typing', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<SearchBar value="" onChange={handleChange} onSearch={() => {}} />)

    const input = screen.getByPlaceholderText('Search jobs, companies...')
    await user.type(input, 'a')

    expect(handleChange).toHaveBeenCalled()
  })

  it('calls onSearch when submitting form', async () => {
    const handleSearch = vi.fn()
    const user = userEvent.setup()

    render(<SearchBar value="Frontend" onChange={() => {}} onSearch={handleSearch} />)

    const button = screen.getByRole('button', { name: 'Search' })
    await user.click(button)

    expect(handleSearch).toHaveBeenCalled()
  })
})
