import { createElement, isValidElement, cloneElement, Children } from 'react'
import isEmpty from './isEmpty'

type CreateTypes = Parameters<typeof createElement>[0]
type CloneTypes = Parameters<typeof cloneElement>[0]

export type RenderContent = (
  content?: CreateTypes | CloneTypes,
  attachProps?: Record<string, any>
) => ReturnType<typeof createElement> | ReturnType<typeof cloneElement>

const renderContent: RenderContent = (content, attachProps = {}) => {
  if (!content) return null as any

  if (typeof content === 'string') {
    return content
  }

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

  if (typeof content === 'object' && !isEmpty(content)) {
    return createElement(content, attachProps)
  }

  return content
}

export default renderContent
