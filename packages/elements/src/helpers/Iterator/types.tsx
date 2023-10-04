import type { ComponentType, ForwardRefExoticComponent, ReactNode } from 'react'
import { type HTMLTags } from '@vitus-labs/core'

export type MaybeNull = undefined | null
export type TObj = Record<string, unknown>
export type SimpleValue = string | number
export type ObjectValue = Partial<{
  id: SimpleValue
  key: SimpleValue
  itemId: SimpleValue
  component: ElementType
}> &
  Record<string, unknown>

export type ElementType<T extends Record<string, unknown> = any> =
  | ComponentType<T>
  | ForwardRefExoticComponent<T>
  | HTMLTags

export type ExtendedProps = {
  index: number
  first: boolean
  last: boolean
  odd: boolean
  even: boolean
  position: number
}

export type PropsCallback =
  | TObj
  | ((
      itemProps:
        | Record<string, never>
        | Record<string, SimpleValue>
        | ObjectValue,
      extendedProps: ExtendedProps,
    ) => TObj)

export type Props = Partial<{
  /**
   * Valid React `children`
   */
  children: ReactNode

  /**
   * Array of data passed to `component` prop
   */
  data: Array<SimpleValue | ObjectValue | MaybeNull>

  /**
   * A React component to be rendred within list
   */
  component: ElementType

  /**
   * Defines name of the prop to be passed to the iteration component
   * when **data** prop is type of `string[]`, `number[]` or combination
   * of both. Otherwise ignored.
   */
  valueName: string

  /**
   * A React component to be rendred within list. `wrapComponent`
   * wraps `component`. Therefore it can be used to enhance the behavior
   * of the list component
   */
  wrapComponent: ElementType

  /**
   * Extension of **item** `component` props to be passed
   */
  itemProps: PropsCallback

  /**
   * Extension of **item** `wrapComponent` props to be passed
   */
  wrapProps?: PropsCallback

  /**
   * Extension of **item** `wrapComponent` props to be passed
   */
  itemKey?:
    | keyof ObjectValue
    | ((
        item: SimpleValue | Omit<ObjectValue, 'component'>,
        index: number,
      ) => SimpleValue)
}>

// type BaseProps = Partial<{
//   wrapComponent: ElementType
// }>

// --------------------------------------------------------
// Children type
// --------------------------------------------------------
// export type ChildrenTypeCallback =
//   | ((itemProps: Record<string, never>, extendedProps: ExtendedProps) => TObj)
//   | TObj

// type ChildrenType = {
//   children: ReactNode
//   itemProps?: ChildrenTypeCallback
//   wrapProps?: ChildrenTypeCallback
// }

// --------------------------------------------------------
// Simple array type
// --------------------------------------------------------
// export type SimpleArrayTypeCallback =
//   | ((
//       itemProps: Record<string, SimpleValue>,
//       extendedProps: ExtendedProps
//     ) => TObj)
//   | TObj

// type DataSimpleArrayType = {
//   data: Array<SimpleValue | MaybeNull>
//   valueName: string
//   component: ElementType
//   itemKey?: (item: SimpleValue, index: number) => SimpleValue
//   itemProps?: SimpleArrayTypeCallback
//   wrapProps?: SimpleArrayTypeCallback
// }

// --------------------------------------------------------
// Object array type
// --------------------------------------------------------
// export type ObjectArrayTypeCallback =
//   | ((itemProps: DataArrayObject, extendedProps: ExtendedProps) => TObj)
//   | TObj

// type DataObjectArrayType = {
//   data: Array<DataArrayObject | MaybeNull>
//   component: ElementType
//   valueName?: never
//   itemKey?:
//     | keyof DataArrayObject
//     | ((item: Omit<DataArrayObject, 'component'>, index: number) => SimpleValue)
//   itemProps?: ObjectArrayTypeCallback
//   wrapProps?: ObjectArrayTypeCallback
// }
