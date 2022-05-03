import React, { forwardRef, useMemo } from 'react'
import { usePseudoState } from '~/hooks'
import { LocalProvider } from '~/context/localContext'

const RocketStyleProviderComponent = (WrappedComponent) =>
  forwardRef<any, any>(
    (
      {
        onMouseEnter,
        onMouseLeave,
        onMouseUp,
        onMouseDown,
        onFocus,
        onBlur,
        $rocketstate,
        ...props
      },
      ref
    ) => {
      // pseudo hook to detect states hover / pressed / focus
      const pseudo = usePseudoState({
        onMouseEnter,
        onMouseLeave,
        onMouseUp,
        onMouseDown,
        onFocus,
        onBlur,
      })

      const updatedState = useMemo(
        () => ({
          ...$rocketstate,
          pseudo: { ...$rocketstate.pseudo, ...pseudo.state },
        }),
        [$rocketstate, pseudo]
      )

      return (
        <LocalProvider value={updatedState}>
          <WrappedComponent
            {...props}
            {...pseudo.events}
            ref={ref}
            $rocketstate={updatedState}
          />
        </LocalProvider>
      )
    }
  )

export default RocketStyleProviderComponent
