import React, { ReactNode, FC, createContext, useContext } from 'react'
import { config, isEmpty } from '@vitus-labs/core'
import { sortBreakpoints, createMediaQueries } from './mediaQueries'

const StyledProvider = config.context.Provider

// const calculateBreakpointState = (breakpoints, width) => {
//   const result = {}

//   Object.keys(breakpoints).forEach((item) => {
//     const breakpointWidth = breakpoints[item]

//     result[item] = width >= breakpointWidth
//   })

//   return result
// }

// const calculateCurrentBreakpoint = (breakpoints, width) => {
//   const sortedBreakpoints = sortBreakpoints(breakpoints)
//   let result = ''

//   sortedBreakpoints.forEach((item, i) => {
//     const breakpointWidth = breakpoints[sortedBreakpoints[i]]

//     if (width >= breakpointWidth) result = item
//   })

//   return result
// }

// const Consumer =  () => {
//   const
//   // const { width, height } = useWindowSize()

//   const result = {
//     // breakpointsState: {},
//     // currentBreakpoint: {},
//     // component: config.component,
//     // viewport: { width, height },
//     // getCurrentBreakpoint: (breakpoints) =>
//     //   calculateCurrentBreakpoint(breakpoints, width),
//     // getAllBreakpointsState: (breakpoints) =>
//     //   calculateBreakpointState(breakpoints, width),
//   }

//   return result
// }

type VitusLabsContext = {
  sortedBreakpoints?: ReturnType<typeof sortBreakpoints>
  media?: ReturnType<typeof createMediaQueries>
}

type Theme = {
  rootSize: number
  breakpoints?: Record<string, number>
  __VITUS_LABS__?: never
} & Record<string, unknown>

type ProviderType = {
  theme: Theme
  variant: 'light' | 'dark'
  inversed?: boolean
  children: ReactNode
}

type TContext = Partial<{
  theme: {
    rootSize: number
    breakpoints?: Record<string, number>
  } & Record<string, unknown>
  variant: 'light' | 'dark'
  inversed?: boolean
  utils: Record<string, unknown>
}>

const Context = createContext<TContext>({})

const Provider: FC<ProviderType> = ({ theme, variant, children, inversed }) => {
  const { variant: ctxVariant, ...ctx } = useContext(Context)

  if (inversed) {
    const inversedTheme = ctxVariant === 'dark' ? 'light' : 'dark'
    return (
      <Context.Provider value={{ ...ctx, variant: inversedTheme }}>
        <StyledProvider value={ctx.theme}>{children}</StyledProvider>
      </Context.Provider>
    )
  }

  // eslint-disable-next-line no-underscore-dangle
  const __VITUS_LABS__: VitusLabsContext = {}

  const { breakpoints, rootSize } = ctx.theme || theme

  if (!isEmpty(breakpoints)) {
    __VITUS_LABS__.sortedBreakpoints = sortBreakpoints(breakpoints)
    __VITUS_LABS__.media = createMediaQueries({
      breakpoints,
      css: config.css,
      rootSize,
    })
  }

  const result = {
    ...theme,
    __VITUS_LABS__,
  }

  return (
    <Context.Provider value={{ theme, utils: __VITUS_LABS__, variant }}>
      <StyledProvider value={result}>{children}</StyledProvider>
    </Context.Provider>
  )
}

// eslint-disable-next-line import/prefer-default-export
export { Provider }
