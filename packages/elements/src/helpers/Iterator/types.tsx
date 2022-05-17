import type { ComponentType, ForwardRefExoticComponent, ReactNode } from 'react'
import { HTMLTags } from '@vitus-labs/core'

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
      extendedProps: ExtendedProps
    ) => TObj)

export type Props = Partial<{
  children: ReactNode
  data: Array<SimpleValue | ObjectValue | MaybeNull>
  component: ElementType
  valueName: string
  wrapComponent: ElementType
  itemProps: PropsCallback
  wrapProps?: PropsCallback
  itemKey?:
    | keyof ObjectValue
    | ((
        item: SimpleValue | Omit<ObjectValue, 'component'>,
        index: number
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
