import {
  type ComponentType,
  type ForwardRefExoticComponent,
  forwardRef,
  useMemo,
} from 'react'
import { usePseudoState } from '~/hooks'
import type { PseudoProps } from '~/types/pseudo'
import { LocalProvider } from './localContext'

type Props = PseudoProps & Record<string, any>

type HOC = (
  WrappedComponent: ComponentType<Props>,
) => ForwardRefExoticComponent<Props>

/**
 * Higher-order component that wraps a component with a LocalProvider,
 * detecting pseudo-states (hover, focus, pressed) via mouse/focus events
 * and broadcasting them through local context to child rocketstyle components.
 */
const RocketStyleProviderComponent: HOC = (WrappedComponent) =>
  forwardRef(
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
      ref,
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
        [$rocketstate, pseudo],
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
    },
  )

export default RocketStyleProviderComponent
