import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('renders input and button', () => {
    render(<SearchBar value="" onChange={() => {}} onSearch={() => {}} />)

    expect(screen.getByPlaceholderText('搜索职位、公司...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '搜索' })).toBeInTheDocument()
  })

  it('displays current value', () => {
    render(<SearchBar value="React" onChange={() => {}} onSearch={() => {}} />)

    const input = screen.getByPlaceholderText('搜索职位、公司...')
    expect(input).toHaveValue('React')
  })

  it('calls onChange when typing', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<SearchBar value="" onChange={handleChange} onSearch={() => {}} />)

    const input = screen.getByPlaceholderText('搜索职位、公司...')
    await user.type(input, 'a')

    expect(handleChange).toHaveBeenCalled()
  })

  it('calls onSearch when submitting form', async () => {
    const handleSearch = vi.fn()
    const user = userEvent.setup()

    render(<SearchBar value="前端" onChange={() => {}} onSearch={handleSearch} />)

    const button = screen.getByRole('button', { name: '搜索' })
    await user.click(button)

    expect(handleSearch).toHaveBeenCalled()
  })
})
