import {
  createElement,
  isValidElement,
  cloneElement,
  Children,
  ReactElement,
} from 'react'
import isEmpty from './isEmpty'

type RenderContent = (
  content?: ReactElement,
  attachProps?: Record<string, any>
) => ReactElement

const renderContent: RenderContent = (content, attachProps = {}) => {
  if (!content) return null

  if (Array.isArray(content)) {
    return content
  }

  if (typeof content === 'function') {
    return createElement(content, attachProps)
  }

  if (isValidElement(content)) {
    if (isEmpty(attachProps)) {
      return content
    }

    return cloneElement(Children.only(content), attachProps)
  }

  if (typeof content === 'object') {
    // FIXME: quick fix for rendering invalid elements
    // no idea of what is going on here yet
    return createElement(content, attachProps)
  }

  return content
}

export default renderContent
