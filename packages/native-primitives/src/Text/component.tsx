// @ts-nocheck
import React from 'react'
import { Text } from 'react-native'
import Context from '../context'

const TextElement = ({ style, ...props }) => (
  <Context.Consumer>
    {(value) => <Text {...props} style={[value.textStyle, style]} />}
  </Context.Consumer>
)

TextElement.displayName = '@vitus-labs/native-primitives/Text'

export default TextElement
