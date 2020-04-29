import { createElement, isValidElement, cloneElement, Children } from 'react'

const renderContent = (content, attachProps = {}) => {
  if (!content) return null

  if (Array.isArray(content)) {
    return content
  }

  if (typeof content === 'function') {
    return createElement(content, attachProps)
  }

  if (isValidElement(content)) {
    if (typeof attachProps === 'object') {
      return cloneElement(Children.only(content), attachProps)
    }

    return content
  }

  if (typeof content === 'object') {
    // FIXME: quick fix for rendering invalid elements
    // no idea of what is going on here yet
    return createElement(content, attachProps)
  }

  return content
}

export default renderContent