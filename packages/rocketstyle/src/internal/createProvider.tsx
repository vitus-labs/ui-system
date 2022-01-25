import React, { forwardRef, useMemo } from 'react'
import { usePseudoState } from '~/hooks'
import LocalContext from './localContext'

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
        <LocalContext.Provider value={updatedState}>
          <WrappedComponent
            {...props}
            {...pseudo.events}
            ref={ref}
            $rocketstate={updatedState}
          />
        </LocalContext.Provider>
      )
    }
  )

export default RocketStyleProviderComponent
