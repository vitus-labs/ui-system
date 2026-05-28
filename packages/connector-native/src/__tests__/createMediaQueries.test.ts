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

  // End-to-end shape of the responsive pipeline: unistyle's makeItResponsive
  // emits `[media.xs`…`, media.md`…`, …]` (CSSResult when the breakpoint
  // applies, '' when it doesn't) and feeds that array into the engine's css
  // as an interpolation. This exercises createMediaQueries + array-flattening
  // + the breakpoint cascade together, the way a real responsive native
  // component does.
  describe('responsive pipeline (media → array → css)', () => {
    it('applies base + matching breakpoint, later one wins', () => {
      vi.mocked(Dimensions.get).mockReturnValue({
        width: 768,
        height: 1024,
        scale: 1,
        fontScale: 1,
      })
      const media = createMediaQueries({ breakpoints, rootSize: 16, css })

      // mobile-first: xs (base) + md applies at width 768, lg does not
      const responsive = [
        media.xs`color: red; padding: 8px;`,
        media.md`color: blue;`,
        media.lg`color: green;`,
      ]
      const composed = css`${responsive}`

      // md overrides xs color; lg dropped (width < 1024); padding from base kept
      expect(composed.resolve({})).toEqual({ color: 'blue', padding: 8 })
    })

    it('keeps only the base breakpoint on a narrow screen', () => {
      vi.mocked(Dimensions.get).mockReturnValue({
        width: 375,
        height: 812,
        scale: 1,
        fontScale: 1,
      })
      const media = createMediaQueries({ breakpoints, rootSize: 16, css })

      const responsive = [
        media.xs`color: red;`,
        media.md`color: blue;`,
        media.lg`color: green;`,
      ]
      const composed = css`${responsive}`

      expect(composed.resolve({})).toEqual({ color: 'red' })
    })
  })
})
