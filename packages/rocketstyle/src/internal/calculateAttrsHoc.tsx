// @ts-nocheck
/* eslint-disable no-underscore-dangle */
import React, { forwardRef } from 'react'
import { renderContent } from '@vitus-labs/core'
import { calculateChainOptions } from '~/utils/attrs'
import { useThemeOptions } from '~/hooks'

const RocketStyleAttrs = ({ inversed, attrs }) => {
  // --------------------------------------------------
  // .attrs(...)
  // first we need to calculate final props which are
  // being returned by using `attr` chaining method
  // --------------------------------------------------
  const _calculateChainOptions = calculateChainOptions(attrs)

  const Enhanced = (WrappedComponent) =>
    forwardRef<any, any>((props, ref) => {
      const { theme, mode, isDark, isLight } = useThemeOptions({
        inversed,
      })

      const calculatedAttrs = _calculateChainOptions([
        props,
        theme,
        {
          renderContent,
          mode,
          isDark,
          isLight,
        },
      ])

      return <WrappedComponent ref={ref} {...calculatedAttrs} />
    })

  return Enhanced
}

export default RocketStyleAttrs