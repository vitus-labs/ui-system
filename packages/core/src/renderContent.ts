import { createElement, isValidElement, cloneElement, Children } from 'react'
import isEmpty from './isEmpty'

const renderContent: (
  content?: React.ReactElement,
  attachProps?: Record<string, any>
) => React.ReactElement = (content, attachProps = {}) => {
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
