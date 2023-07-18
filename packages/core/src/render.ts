import { isValidElementType, isFragment } from 'react-is'
import { createElement, isValidElement, cloneElement, ReactNode } from 'react'
import isEmpty from './isEmpty'

type CreateTypes = Parameters<typeof createElement>[0]
type CloneTypes = Parameters<typeof cloneElement>[0]
type RenderProps<T extends Record<string, unknown> | undefined> = (
  props: Partial<T>,
) => ReactNode

export type Render = <T extends Record<string, any> | undefined>(
  content?: CreateTypes | CloneTypes | ReactNode | ReactNode[] | RenderProps<T>,
  attachProps?: T,
) => ReturnType<typeof createElement> | ReturnType<typeof cloneElement> | null

const render: Render = (content, attachProps) => {
  if (!content) return null as any

  const isValidEl = isValidElement(content)
  const render = (content) =>
    attachProps ? createElement(content, attachProps) : createElement(content)

  if (typeof content === 'string' && isValidEl) {
    return render(content)
  }

  if (['number', 'boolean', 'bigint', 'string'].includes(typeof content)) {
    return content
  }

  if (Array.isArray(content) || isFragment(content)) {
    return content
  }

  if (isValidElementType(content)) {
    return render(content)
  }

  if (isValidEl) {
    if (isEmpty(attachProps)) {
      return content
    }

    return cloneElement(content, attachProps)
  }

  return content
}

export default render
