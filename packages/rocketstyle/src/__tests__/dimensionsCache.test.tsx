/**
 * The dimensions map / reserved keys / omit Set are cached per dimension
 * themes object and shared across instances (2026-11 audit).
 */
import { render } from '@testing-library/react'
import { Provider } from '~/index'
import rocketstyle from '~/init'
import * as dimensionsModule from '~/utils/dimensions'

const Leaf = (p: any) => <div {...p} />

describe('dimensions map cache', () => {
  it('builds the dimensions map once per themes object across instances', () => {
    const spy = vi.spyOn(dimensionsModule, 'getDimensionsMap')
    const Comp = rocketstyle()({ name: 'D', component: Leaf })
      .theme({ color: 'red' })
      .states({ primary: { color: 'blue' }, secondary: { color: 'green' } })
    const theme = { rootSize: 16 }
    render(
      <Provider theme={theme}>
        <Comp state="primary" data-testid="a" />
        <Comp state="secondary" />
        <Comp primary />
        <Comp />
      </Provider>,
    )
    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })
})
