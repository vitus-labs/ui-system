import { useStableValue } from '@vitus-labs/core'
import type { ComponentType, FC } from 'react'
import { usePseudoState } from '~/hooks'
import type { PseudoProps } from '~/types/pseudo'
import { LocalProvider } from './localContext'

type Props = PseudoProps & Record<string, any>

type HOC = (WrappedComponent: ComponentType<Props>) => FC<Props>

/**
 * Higher-order component that wraps a component with a LocalProvider,
 * detecting pseudo-states (hover, focus, pressed) via mouse/focus events
 * and broadcasting them through local context to child rocketstyle components.
 */
const RocketStyleProviderComponent: HOC = (WrappedComponent) => {
  const HOC = ({
    onMouseEnter,
    onMouseLeave,
    onMouseUp,
    onMouseDown,
    onFocus,
    onBlur,
    $rocketstate,
    ref,
    ...props
  }: any) => {
    // pseudo hook to detect states hover / pressed / focus
    const { state: pseudoState, events: pseudoEvents } = usePseudoState({
      onMouseEnter,
      onMouseLeave,
      onMouseUp,
      onMouseDown,
      onFocus,
      onBlur,
    })

    const updatedState = useStableValue({
      ...$rocketstate,
      pseudo: { ...$rocketstate.pseudo, ...pseudoState },
    })

    return (
      <LocalProvider value={updatedState}>
        <WrappedComponent
          {...props}
          {...pseudoEvents}
          ref={ref}
          $rocketstate={updatedState}
        />
      </LocalProvider>
    )
  }
  return HOC
}

export default RocketStyleProviderComponent
