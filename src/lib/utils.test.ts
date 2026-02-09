import { describe, it, expect } from 'vitest'
import { formatSalary, formatDate } from './utils'

describe('formatSalary', () => {
  it('returns "薪资面议" when no salary info', () => {
    expect(formatSalary({ salary: {} })).toBe('薪资面议')
  })

  it('formats salary with min and max', () => {
    expect(
      formatSalary({ salary: { min: 10000, max: 20000, currency: 'CNY', period: 'month' } })
    ).toBe('CNY 10,000 - 20,000/月')
  })

  it('formats salary with only min', () => {
    expect(
      formatSalary({ salary: { min: 15000, currency: 'CNY', period: 'month' } })
    ).toBe('CNY 15,000+/月')
  })

  it('formats salary with only max', () => {
    expect(
      formatSalary({ salary: { max: 30000, currency: 'CNY', period: 'month' } })
    ).toBe('CNY 30,000/月以下')
  })
})

describe('formatDate', () => {
  it('returns "今天" for today', () => {
    const today = new Date().toISOString()
    expect(formatDate(today)).toBe('今天')
  })

  it('returns "昨天" for yesterday', () => {
    const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    expect(formatDate(yesterday)).toBe('昨天')
  })

  it('returns "X天前" for recent days', () => {
    const threeDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
    expect(formatDate(threeDaysAgo)).toBe('3天前')
  })

  it('returns "X周前" for weeks', () => {
    const twoWeeksAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString()
    expect(formatDate(twoWeeksAgo)).toBe('2周前')
  })

  it('returns "X月前" for months', () => {
    const twoMonthsAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString()
    expect(formatDate(twoMonthsAgo)).toBe('2月前')
  })

  it('returns "X年前" for years', () => {
    const twoYearsAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 2).toISOString()
    expect(formatDate(twoYearsAgo)).toBe('2年前')
  })
})
