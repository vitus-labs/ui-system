// @ts-nocheck
import React, { Children, isValidElement, cloneElement } from 'react'
import Styled from './styled'

const INLINE_TAGS = {
  abbr: 'abbr',
  small: 'small',
  deleted: 'del',
  inserted: 'ins',
  underlined: 'u',
  replaced: 's',
  marked: 'mark',
  strong: 'strong',
  italic: 'em',
  inline: 'span',
}

const getTag = (props) => {
  for (const key in props) {
    const value = INLINE_TAGS[key]
    if (value) {
      return value
    }
  }
  return
}

const Element = ({ inline, label, children, tag, ...props }) => {
  let _tag = tag || getTag(props)
  if (!_tag && inline) _tag = 'span'

  const content = children || label

  return (
    <Styled as={_tag} {...props}>
      {Children.map(content, (child) => {
        if (isValidElement(child) && child.type.isText === true) {
          return cloneElement(child, { inline: true })
        }
        return child
      })}
    </Styled>
  )
}

Element.displayName = 'vitus-labs/elements/Text'
Element.isText = true

export default Element
