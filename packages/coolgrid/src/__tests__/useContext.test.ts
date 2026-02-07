import { getContainerWidth } from '../Container/utils'
import { getGridContext } from '../useContext'

describe('getGridContext', () => {
  it('returns columns and containerWidth from props', () => {
    const props = { columns: 12 }
    const theme = {}
    const result = getGridContext(props, theme)
    expect(result.columns).toBe(12)
  })

  it('falls back to theme.grid.columns', () => {
    const props = {}
    const theme = { grid: { columns: 24 } }
    const result = getGridContext(props, theme)
    expect(result.columns).toBe(24)
  })

  it('falls back to theme.coolgrid.columns', () => {
    const props = {}
    const theme = { coolgrid: { columns: 16 } }
    const result = getGridContext(props, theme)
    expect(result.columns).toBe(16)
  })

  it('prefers props over theme', () => {
    const props = { columns: 6 }
    const theme = { grid: { columns: 12 } }
    const result = getGridContext(props, theme)
    expect(result.columns).toBe(6)
  })

  it('returns containerWidth from theme.grid.container', () => {
    const theme = { grid: { container: { xs: '100%', md: 720 } } }
    const result = getGridContext({}, theme)
    expect(result.containerWidth).toEqual({ xs: '100%', md: 720 })
  })

  it('returns containerWidth from theme.coolgrid.container', () => {
    const theme = { coolgrid: { container: { xs: '100%' } } }
    const result = getGridContext({}, theme)
    expect(result.containerWidth).toEqual({ xs: '100%' })
  })

  it('handles empty inputs', () => {
    const result = getGridContext({}, {})
    expect(result.columns).toBeUndefined()
    expect(result.containerWidth).toBeUndefined()
  })

  it('handles default parameters', () => {
    const result = getGridContext(undefined as any, undefined as any)
    expect(result.columns).toBeUndefined()
    expect(result.containerWidth).toBeUndefined()
  })
})

describe('getContainerWidth', () => {
  it('returns width from props', () => {
    const result = getContainerWidth({ width: { xs: 600 } }, {})
    expect(result).toEqual({ xs: 600 })
  })

  it('falls back to theme.grid.container', () => {
    const result = getContainerWidth(
      {},
      { grid: { container: { xs: '100%' } } },
    )
    expect(result).toEqual({ xs: '100%' })
  })

  it('falls back to theme.coolgrid.container', () => {
    const result = getContainerWidth(
      {},
      { coolgrid: { container: { md: 720 } } },
    )
    expect(result).toEqual({ md: 720 })
  })

  it('returns undefined when nothing matches', () => {
    const result = getContainerWidth({}, {})
    expect(result).toBeFalsy()
  })
})
