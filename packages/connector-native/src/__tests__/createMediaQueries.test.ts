import { Dimensions } from 'react-native'
import { describe, expect, it, vi } from 'vitest'
import createMediaQueries from '~/createMediaQueries'
import { css } from '~/css'

const breakpoints = { xs: 0, sm: 576, md: 768, lg: 1024 }

describe('createMediaQueries', () => {
  it('returns an object with keys matching breakpoints', () => {
    const media = createMediaQueries({ breakpoints, rootSize: 16, css })
    expect(Object.keys(media)).toEqual(['xs', 'sm', 'md', 'lg'])
  })

  it('base breakpoint (0) always applies styles', () => {
    const media = createMediaQueries({ breakpoints, rootSize: 16, css })
    const result = media.xs`width: 100px;`

    expect(result.__brand).toBe('vl.native.css')
    expect(result.resolve({})).toEqual({ width: 100 })
  })

  it('applies styles when width >= breakpoint', () => {
    // Default mock: width=375, so sm (576) should NOT apply
    const media = createMediaQueries({ breakpoints, rootSize: 16, css })
    const result = media.sm`width: 200px;`

    expect(result).toBe('')
  })

  it('applies styles when width matches breakpoint exactly', () => {
    vi.mocked(Dimensions.get).mockReturnValue({
      width: 768,
      height: 1024,
      scale: 1,
      fontScale: 1,
    })

    const media = createMediaQueries({ breakpoints, rootSize: 16, css })
    const result = media.md`width: 300px;`

    expect(result.__brand).toBe('vl.native.css')
    expect(result.resolve({})).toEqual({ width: 300 })
  })

  it('does not apply styles when width < breakpoint', () => {
    vi.mocked(Dimensions.get).mockReturnValue({
      width: 767,
      height: 1024,
      scale: 1,
      fontScale: 1,
    })

    const media = createMediaQueries({ breakpoints, rootSize: 16, css })
    const result = media.md`width: 300px;`

    expect(result).toBe('')
  })

  it('skips breakpoint with null value', () => {
    const bps = { xs: 0, sm: 576, invalid: null as any }
    const media = createMediaQueries({ breakpoints: bps, rootSize: 16, css })
    // invalid breakpoint should not produce a callable function
    expect(media.xs).toBeDefined()
    expect(media.sm).toBeDefined()
    expect(media.invalid).toBeUndefined()
  })

  it('applies large breakpoint when screen is wide enough', () => {
    vi.mocked(Dimensions.get).mockReturnValue({
      width: 1200,
      height: 900,
      scale: 1,
      fontScale: 1,
    })

    const media = createMediaQueries({ breakpoints, rootSize: 16, css })
    const result = media.lg`width: 400px;`

    expect(result.__brand).toBe('vl.native.css')
    expect(result.resolve({})).toEqual({ width: 400 })
  })
})
