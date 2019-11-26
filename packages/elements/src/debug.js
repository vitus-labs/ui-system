import React, { Component } from 'react'
import renderContent from '../utils/renderContent'

export default () => WrappedComponent => {
  const dataComponentName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'

  class EnhancedComponent extends Component {
    static displayName = 'vitus-labs/elements/debug'

    render() {
      return renderContent(WrappedComponent, {
        'data-component-name': dataComponentName,
        'data-test': dataComponentName,
        ...this.props
      })
    }
  }

  return EnhancedComponent
}
