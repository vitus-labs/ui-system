import type {
  ComponentType,
  ForwardRefExoticComponent,
  ReactText,
  ReactNode,
} from 'react'
import { HTMLTags } from '@vitus-labs/core'

export type MaybeNull = undefined | null
export type TObj = Record<string, unknown>
export type SimpleValue = ReactText

/**
 * @hidden
 */
export type ElementType<T extends Record<string, unknown> = any> =
  | ComponentType<T>
  | ForwardRefExoticComponent<T>
  | HTMLTags

/**
 * @hidden
 */
export type ExtendedProps = {
  index: number
  first: boolean
  last: boolean
  odd: boolean
  even: boolean
  position: number
}

/**
 * @hidden
 */
export type DataArrayObject = Partial<{
  id: SimpleValue
  key: SimpleValue
  itemId: SimpleValue
  component: ElementType
}> &
  Record<string, unknown>

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

/**
 * @hidden
 */
export type PropsCallback =
  | TObj
  | ((
      itemProps:
        | Record<string, never>
        | Record<string, SimpleValue>
        | DataArrayObject,
      extendedProps: ExtendedProps
    ) => TObj)

export type Props = Partial<{
  children: ReactNode
  data: Array<SimpleValue | DataArrayObject | MaybeNull>
  component: ElementType
  valueName: string
  wrapComponent: ElementType
  itemProps: PropsCallback
  wrapProps?: PropsCallback
  itemKey?:
    | keyof DataArrayObject
    | ((
        item: SimpleValue | Omit<DataArrayObject, 'component'>,
        index: number
      ) => SimpleValue)
}>
