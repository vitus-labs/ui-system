import React, { Children, isValidElement, cloneElement } from 'react'
import { config, renderContent } from '@vitus-labs/core'
import Styled from './styled'

const AVAILABLE_TAGS = {
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
  paragraph: 'p',
}

const getTag = (props) => {
  for (const key in props) {
    const value = AVAILABLE_TAGS[key]
    if (value) {
      return value
    }
  }
  return
}

type Props = Partial<
  {
    inline: boolean
    label: React.ReactNode
    children: React.ReactNode
    tag: import('styled-components').StyledComponentPropsWithRef<any>
  } & Record<keyof typeof AVAILABLE_TAGS, boolean>
>

const Element: React.FC<Props> & { isText: boolean } = ({
  inline,
  label,
  children,
  tag,
  ...props
}) => {
  let finalTag = tag || getTag(props)
  if (!finalTag && inline) finalTag = 'span'

  const content = children || label

  if (config.isWeb) {
    return (
      <Styled as={finalTag} {...props}>
        {Children.map(content, (child) => {
          if (isValidElement(child) && child.type.isText === true) {
            return cloneElement(child, { inline: true })
          }
          return child
        })}
      </Styled>
    )
  }

  return (
    <Styled as={finalTag} {...props}>
      {content}
    </Styled>
  )
}

Element.displayName = 'vitus-labs/elements/Text'
Element.isText = true

export default Element
