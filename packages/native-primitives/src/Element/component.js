import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import pick from 'lodash.pick'
import Context from '../context'
import Text from '../Text'
import TEXT_PROPS_KEYS from './constants'

const pickTextStyle = styles => {
  if (Array.isArray(styles)) {
    return styles.map(item => pickTextStyle(item))
  }

  if (typeof styles === 'object') {
    return pick(styles, TEXT_PROPS_KEYS)
  }
}

const transformChildren = (children, textStyle) =>
  children.map((item, i) => {
    if (Array.isArray(item)) return transformChildren(item, textStyle)
    if (typeof item === 'string' || typeof item === 'number') {
      return (
        <Text key={i} style={textStyle}>
          {item}
        </Text>
      )
    }

    return item
  })

const Element = ({ onPress, children, style, ...props }) => {
  const textStyle = pickTextStyle(style)
  const Result = onPress ? TouchableOpacity : View
  const finalProps = {
    ...props,
    style,
    onPress
  }

  if (onPress) {
    finalProps.activeOpacity = 1
  }

  if (Array.isArray(children)) {
    return (
      <Result {...finalProps}>
        <Context.Provider value={{ textStyle }}>
          <>{transformChildren(children, textStyle)}</>
        </Context.Provider>
      </Result>
    )
  }

  return (
    <Result {...finalProps}>
      {typeof children === 'string' ? (
        <Text style={textStyle}>{children}</Text>
      ) : (
        children
      )}
    </Result>
  )
}

Element.displayName = '@vitus-labs/native-primitives/Element'

export default Element
