// @ts-nocheck
import React from 'react'
import WithState from './component'

export default () => (WrappedComponent) => (props) => (
  <WithState {...props} passProps={true}>
    <WrappedComponent />
  </WithState>
)
