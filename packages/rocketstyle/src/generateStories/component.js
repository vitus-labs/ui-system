import React, { createElement, useState } from 'react'
import Documentation from './components/Documentation'
import Dimension from './components/Dimension'
import { generateKnobs, getBasicKnobs } from './generateKnobs'

const Element = ({ component, type, props = {} }) => {
  const [state, setState] = useState(null)

  if (!state) {
    if (component) return createElement(component, { hook: setState })
  }

  const rocketstyleDimensions = state.rocketConfig.dimensions
  const useBooleans = state.rocketConfig.useBooleans
  const transformProps = typeof props === 'function' ? props : () => props
  const componentProps = getBasicKnobs(transformProps(rocketstyleDimensions[type]))

  const componentKnobs = useBool =>
    generateKnobs(state.keys, state.rocketConfig.dimensions, useBool)

  const baseProps = {
    title: component.displayName,
    useBooleans
  }

  if (type === 'documentation') {
    return (
      <Documentation
        {...baseProps}
        dimensions={rocketstyleDimensions}
        state={state}
        component={component}
        baseKnobs={componentProps}
        rocketstyleKnobs={
          useBooleans
            ? [componentKnobs(false), componentKnobs(true)]
            : componentKnobs(false)
        }
      />
    )
  }

  if (Object.keys(state.rocketConfig.dimensions).includes(type)) {
    return (
      <Dimension
        {...baseProps}
        dimensionName={type}
        dimensionKey={rocketstyleDimensions[type]}
        options={state.keys[type]}
        component={component}
        baseKnobs={componentProps}
        rocketstyleKnobs={
          useBooleans
            ? [componentKnobs(false), componentKnobs(true)]
            : componentKnobs(false)
        }
      />
    )
  }

  return null
}

export default Element
