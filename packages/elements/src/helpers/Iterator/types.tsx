/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ComponentType,
  ForwardRefExoticComponent,
  ReactText,
  ReactNodeArray,
} from 'react'

export type MaybeNull = undefined | null
export type TObj = Record<string, unknown>
export type SimpleValue = ReactText
export type ElementType<T extends Record<string, unknown> = any> =
  | ComponentType<T>
  | ForwardRefExoticComponent<T>

export type ExtendedProps = {
  index: number
  first: boolean
  last: boolean
  odd: boolean
  even: boolean
  position: number
}

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
type ChildrenTypeCallback =
  | ((itemProps: Record<string, never>, extendedProps: ExtendedProps) => TObj)
  | TObj

// type ChildrenType = {
//   children: ReactNode
//   itemProps?: ChildrenTypeCallback
//   wrapProps?: ChildrenTypeCallback
// }

// --------------------------------------------------------
// Simple array type
// --------------------------------------------------------
type SimpleArrayTypeCallback =
  | ((
      itemProps: Record<string, SimpleValue>,
      extendedProps: ExtendedProps
    ) => TObj)
  | TObj

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
type ObjectArrayTypeCallback =
  | ((itemProps: DataArrayObject, extendedProps: ExtendedProps) => TObj)
  | TObj

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

export type Props = Partial<{
  children: ReactNodeArray
  data: Array<SimpleValue | DataArrayObject | MaybeNull>
  component: ElementType
  valueName: string
  wrapComponent: ElementType
  itemProps:
    | ChildrenTypeCallback
    | SimpleArrayTypeCallback
    | ObjectArrayTypeCallback
  wrapProps?:
    | ChildrenTypeCallback
    | SimpleArrayTypeCallback
    | ObjectArrayTypeCallback
  itemKey?:
    | keyof DataArrayObject
    | ((
        item: SimpleValue | Omit<DataArrayObject, 'component'>,
        index: number
      ) => SimpleValue)
}>
