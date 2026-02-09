import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('应该渲染分页组件', () => {
    const { container } = render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('应该显示当前页码', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('应该显示第一页和最后一页', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('应该支持点击上一页', async () => {
    const onPageChange = vi.fn()
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />)

    const buttons = screen.getAllByRole('button')
    const prevButton = buttons[0]
    await userEvent.click(prevButton)

    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('第一页时上一页按钮应禁用', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    const prevButton = buttons[0]
    expect(prevButton).toBeDisabled()
  })

  it('应该支持点击下一页', async () => {
    const onPageChange = vi.fn()
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />)

    const buttons = screen.getAllByRole('button')
    const nextButton = buttons[buttons.length - 1]
    await userEvent.click(nextButton)

    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('最后一页时下一页按钮应禁用', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    const nextButton = buttons[buttons.length - 1]
    expect(nextButton).toBeDisabled()
  })

  it('应该显示省略号当页数较多时', () => {
    render(<Pagination currentPage={3} totalPages={10} onPageChange={vi.fn()} />)
    expect(screen.getByText('...')).toBeInTheDocument()
  })

  it('应该支持点击页码按钮', async () => {
    const onPageChange = vi.fn()
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />)

    const pageButton = screen.getByText('2')
    await userEvent.click(pageButton)

    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
