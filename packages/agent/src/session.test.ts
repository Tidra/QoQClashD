import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSessionManager, readSessionCookie, SESSION_COOKIE } from './session'

const ONE_DAY = 86_400_000

describe('createSessionManager', () => {
  afterEach(() => vi.useRealTimers())

  it('密码为空时既签不出也认不了任何 cookie', () => {
    const sessions = createSessionManager(() => '')
    expect(sessions.issue()).toBe('')
    expect(sessions.verify(`${Date.now() + 1000}.deadbeef`)).toBe(false)
  })

  it('签发的 cookie 能验通，改密码后立即作废', () => {
    let secret = 'hunter2'
    const sessions = createSessionManager(() => secret)
    const cookie = sessions.issue()
    expect(sessions.verify(cookie)).toBe(true)
    secret = 'hunter3'
    expect(sessions.verify(cookie)).toBe(false)
  })

  it('7 天内有效，过期即拒', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-20T00:00:00Z'))
    const sessions = createSessionManager(() => 'sek')
    const cookie = sessions.issue()
    expect(sessions.verify(cookie)).toBe(true)
    vi.setSystemTime(new Date('2026-09-26T00:00:00Z'))
    expect(sessions.verify(cookie)).toBe(true)
    vi.setSystemTime(new Date('2026-09-28T00:00:00Z'))
    expect(sessions.verify(cookie)).toBe(false)
  })

  it('伪造的签名、乱码、缺段一律拒', () => {
    const sessions = createSessionManager(() => 'sek')
    const future = Date.now() + ONE_DAY
    expect(sessions.verify('')).toBe(false)
    expect(sessions.verify(undefined)).toBe(false)
    expect(sessions.verify(null)).toBe(false)
    expect(sessions.verify('not-a-cookie')).toBe(false)
    expect(sessions.verify(`${future}.${'a'.repeat(64)}`)).toBe(false)
    expect(sessions.verify(`${future}`)).toBe(false)
    // 改期不重签：签名对不上。
    const [expiresAt, sig] = sessions.issue().split('.')
    expect(sessions.verify(`${Number(expiresAt) + ONE_DAY}.${sig}`)).toBe(false)
  })
})

describe('readSessionCookie', () => {
  it('只挑出自己那张 cookie', () => {
    expect(readSessionCookie(`theme=dark; ${SESSION_COOKIE}=abc.def; x=1`)).toBe('abc.def')
    expect(readSessionCookie('theme=dark')).toBeUndefined()
    expect(readSessionCookie(undefined)).toBeUndefined()
    expect(readSessionCookie([`a=b`, `${SESSION_COOKIE}=q`])).toBe('q')
  })
})
