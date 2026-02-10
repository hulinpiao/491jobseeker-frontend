/**
 * DisclosureTriangle Component Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DisclosureTriangle } from './DisclosureTriangle'

describe('DisclosureTriangle', () => {
  it('应该渲染标题', () => {
    render(<DisclosureTriangle title="Test Title">Content</DisclosureTriangle>)

    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('默认应该是折叠状态', () => {
    render(<DisclosureTriangle title="Test Title">Hidden Content</DisclosureTriangle>)

    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument()
  })

  it('当 defaultExpanded 为 true 时应该展开', () => {
    render(
      <DisclosureTriangle title="Test Title" defaultExpanded>
        Visible Content
      </DisclosureTriangle>
    )

    expect(screen.getByText('Visible Content')).toBeInTheDocument()
  })

  it('应该在点击时切换展开/折叠', async () => {
    render(<DisclosureTriangle title="Test Title">Toggle Content</DisclosureTriangle>)

    expect(screen.queryByText('Toggle Content')).not.toBeInTheDocument()

    const button = screen.getByRole('button', { name: /Test Title/ })
    await userEvent.click(button)

    expect(screen.getByText('Toggle Content')).toBeInTheDocument()

    await userEvent.click(button)

    expect(screen.queryByText('Toggle Content')).not.toBeInTheDocument()
  })

  it('应该渲染 children 内容', () => {
    render(
      <DisclosureTriangle title="Test Title" defaultExpanded>
        <span data-testid="child-content">Child Content</span>
      </DisclosureTriangle>
    )

    expect(screen.getByTestId('child-content')).toBeInTheDocument()
  })
})
