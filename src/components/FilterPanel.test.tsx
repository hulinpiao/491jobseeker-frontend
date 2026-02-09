import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterPanel } from './FilterPanel'

describe('FilterPanel', () => {
  it('应该渲染筛选面板', () => {
    render(
      <FilterPanel filters={{}} onChange={vi.fn()} />
    )
    expect(screen.getByText('筛选条件')).toBeInTheDocument()
  })

  it('应该显示地点输入框', () => {
    render(<FilterPanel filters={{}} onChange={vi.fn()} />)
    expect(screen.getByLabelText('工作地点')).toBeInTheDocument()
  })

  it('应该支持输入地点并触发 onChange', async () => {
    const onChange = vi.fn()
    render(<FilterPanel filters={{}} onChange={onChange} />)

    const input = screen.getByLabelText('工作地点')
    await userEvent.type(input, 'Sydney')

    // onChange 应该被调用
    expect(onChange).toHaveBeenCalled()
  })

  it('应该显示传入的地点值', () => {
    render(<FilterPanel filters={{ location: 'Sydney' }} onChange={vi.fn()} />)
    const input = screen.getByLabelText('工作地点') as HTMLInputElement
    expect(input.value).toBe('Sydney')
  })

  it('应该支持选择工作类型并触发 onChange', async () => {
    const onChange = vi.fn()
    render(<FilterPanel filters={{}} onChange={onChange} />)

    const select = screen.getByLabelText('工作类型')
    await userEvent.selectOptions(select, 'full_time')

    expect(onChange).toHaveBeenCalled()
  })

  it('应该支持选择工作方式并触发 onChange', async () => {
    const onChange = vi.fn()
    render(<FilterPanel filters={{}} onChange={onChange} />)

    const select = screen.getByLabelText('工作方式')
    await userEvent.selectOptions(select, 'remote')

    expect(onChange).toHaveBeenCalled()
  })

  it('应该支持清除所有筛选', async () => {
    const onChange = vi.fn()
    render(
      <FilterPanel
        filters={{ location: 'Sydney', employmentType: 'full_time' }}
        onChange={onChange}
      />
    )

    const clearButton = screen.getByText('清除')
    await userEvent.click(clearButton)

    expect(onChange).toHaveBeenCalledWith({})
  })

  it('有筛选条件时显示清除按钮', () => {
    render(
      <FilterPanel filters={{ location: 'Sydney' }} onChange={vi.fn()} />
    )
    expect(screen.getByText('清除')).toBeInTheDocument()
  })

  it('无筛选条件时隐藏清除按钮', () => {
    render(<FilterPanel filters={{}} onChange={vi.fn()} />)
    expect(screen.queryByText('清除')).not.toBeInTheDocument()
  })
})
