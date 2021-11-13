import { isValidElementType, isFragment } from 'react-is'
import { createElement, isValidElement, cloneElement, ReactNode } from 'react'
import isEmpty from './isEmpty'

type CreateTypes = Parameters<typeof createElement>[0]
type CloneTypes = Parameters<typeof cloneElement>[0]

// export type RenderContent = (
//   content?: CreateTypes | CloneTypes | ReactNode | ReactNode[],
//   attachProps?: Record<string, any>
// ) => ReturnType<typeof createElement> | ReturnType<typeof cloneElement> | null

// const renderContent: RenderContent = (content, attachProps) => {
//   if (!content) return null as any

//   if (typeof content === 'string') {
//     return content
//   }

//   if (Array.isArray(content)) {
//     return content
//   }

//   if (typeof content === 'function') {
//     return createElement(content, attachProps)
//   }

//   if (isValidElement(content)) {
//     if (isEmpty(attachProps)) {
//       return content
//     }

//     return cloneElement(Children.only(content), attachProps)
//   }

//   if (typeof content === 'object' && !isEmpty(content)) {
//     return createElement(content, attachProps)
//   }

//   return content
// }

// export default renderContent

export type RenderContent = (
  content?: CreateTypes | CloneTypes | ReactNode | ReactNode[],
  attachProps?: Record<string, any>
) => ReturnType<typeof createElement> | ReturnType<typeof cloneElement> | null

const renderContent: RenderContent = (content, attachProps) => {
  if (!content) return null as any

  if (typeof content === 'string' && isValidElement(content)) {
    return attachProps
      ? createElement(content, attachProps)
      : createElement(content)
  }

  if (['number', 'boolean', 'string'].includes(typeof content)) {
    return content
  }

  if (Array.isArray(content) || isFragment(content)) {
    return content
  }

  if (isValidElementType(content)) {
    return attachProps
      ? createElement(content, attachProps)
      : createElement(content)
  }

  if (isValidElement(content)) {
    if (isEmpty(attachProps)) {
      return content
    }

    return cloneElement(content, attachProps)
  }

  return content
}

export default renderContent
