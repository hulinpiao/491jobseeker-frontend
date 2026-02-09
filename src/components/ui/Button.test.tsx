import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('应该渲染默认按钮', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('应该渲染为链接当 asChild 和 href 存在', () => {
    render(<Button asChild href="https://example.com">Link</Button>)
    expect(screen.getByRole('link', { name: 'Link' })).toHaveAttribute('href', 'https://example.com')
  })

  it('应该应用 variant 样式', () => {
    const { container: defaultContainer } = render(<Button variant="default">Default</Button>)
    const { container: outlineContainer } = render(<Button variant="outline">Outline</Button>)
    const { container: ghostContainer } = render(<Button variant="ghost">Ghost</Button>)

    expect(defaultContainer.querySelector('button')).toHaveClass('bg-primary')
    expect(outlineContainer.querySelector('button')).toHaveClass('border')
    expect(ghostContainer.querySelector('button')).toHaveClass('hover:bg-accent')
  })

  it('应该应用 size 样式', () => {
    const { container: smContainer } = render(<Button size="sm">Small</Button>)
    const { container: mdContainer } = render(<Button size="md">Medium</Button>)
    const { container: lgContainer } = render(<Button size="lg">Large</Button>)

    expect(smContainer.querySelector('button')).toHaveClass('h-9')
    expect(mdContainer.querySelector('button')).toHaveClass('h-10')
    expect(lgContainer.querySelector('button')).toHaveClass('h-11')
  })

  it('应该应用自定义 className', () => {
    const { container } = render(<Button className="custom-class">Custom</Button>)
    expect(container.querySelector('button')).toHaveClass('custom-class')
  })

  it('应该支持 disabled 状态', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('应该传递其他 HTML 属性', () => {
    render(<Button data-testid="custom-button" type="submit">Submit</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-testid', 'custom-button')
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('asChild 链接应该支持自定义 className', () => {
    const { container } = render(
      <Button asChild href="/test" className="link-class">Link</Button>
    )
    expect(container.querySelector('a')).toHaveClass('link-class')
  })

  it('asChild 链接应该支持 variant', () => {
    const { container } = render(
      <Button asChild href="/test" variant="outline">Link</Button>
    )
    expect(container.querySelector('a')).toHaveClass('border')
  })

  it('asChild 链接应该支持 size', () => {
    const { container } = render(
      <Button asChild href="/test" size="sm">Link</Button>
    )
    expect(container.querySelector('a')).toHaveClass('h-9')
  })
})
