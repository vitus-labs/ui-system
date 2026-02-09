import type { ReactNode } from 'react'
import { cloneElement, createElement, isValidElement } from 'react'
import { isFragment, isValidElementType } from 'react-is'
import isEmpty from './isEmpty'

type CreateTypes = Parameters<typeof createElement>[0]
type CloneTypes = Parameters<typeof cloneElement>[0]
type RenderProps<T extends Record<string, unknown> | undefined> = (
  props: Partial<T>,
) => ReactNode

/**
 * Flexible element renderer that handles multiple content types:
 * - Primitives (string, number) — returned as-is
 * - Arrays and fragments — returned as-is
 * - Component types (class/function) — created via `createElement`
 * - Valid elements — cloned with `attachProps` if provided
 * - Falsy values — return null
 */
export type Render = <T extends Record<string, any> | undefined>(
  content?: CreateTypes | CloneTypes | ReactNode | ReactNode[] | RenderProps<T>,
  attachProps?: T,
) => ReturnType<typeof createElement> | ReturnType<typeof cloneElement> | null

const render: Render = (content, attachProps) => {
  if (!content) return null as any

  const render = (child: Parameters<typeof createElement>[0]) =>
    attachProps ? createElement(child, attachProps) : createElement(child)

  if (['number', 'boolean', 'bigint', 'string'].includes(typeof content)) {
    return content
  }

  if (Array.isArray(content) || isFragment(content)) {
    return content
  }

  if (isValidElementType(content)) {
    return render(content)
  }

  if (isValidElement(content)) {
    if (isEmpty(attachProps)) {
      return content
    }

    return cloneElement(content, attachProps)
  }

  return content
}

export default render
