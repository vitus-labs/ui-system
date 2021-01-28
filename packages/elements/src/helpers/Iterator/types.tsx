import type {
  ComponentType,
  ForwardRefExoticComponent,
  ReactText,
  ReactNode,
} from 'react'

export type MaybeNull = undefined | null
export type TObj = Record<string, unknown>
export type SimpleValue = ReactText
export type ElementType<T extends Record<string, unknown> | unknown = any> =
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

type BaseObjectData = Partial<
  { component: ElementType } & Record<string, unknown>
>
type ItemIdType = { id?: SimpleValue }
type ItemKeyType = { key?: SimpleValue }
type ItemItemIdType = { itemId?: SimpleValue }

export type DataArrayObject = (ItemIdType | ItemKeyType | ItemItemIdType) &
  BaseObjectData

type BaseProps = Partial<{
  wrapComponent: ElementType
}>

// --------------------------------------------------------
// Children type
// --------------------------------------------------------
type ChildrenTypeCallback =
  | ((itemProps: Record<string, never>, extendedProps: ExtendedProps) => TObj)
  | TObj

type ChildrenType = {
  children: ReactNode
  itemProps?: ChildrenTypeCallback
  wrapProps?: ChildrenTypeCallback
}

// --------------------------------------------------------
// Simple array type
// --------------------------------------------------------
type SimpleArrayTypeCallback =
  | ((
      itemProps: Record<string, SimpleValue>,
      extendedProps: ExtendedProps
    ) => TObj)
  | TObj

type DataSimpleArrayType = {
  data: Array<SimpleValue | MaybeNull>
  valueName: string
  component: ElementType
  itemKey?: (item: SimpleValue, index: number) => SimpleValue
  itemProps?: SimpleArrayTypeCallback
  wrapProps?: SimpleArrayTypeCallback
}

// --------------------------------------------------------
// Object array type
// --------------------------------------------------------
type ObjectArrayTypeCallback =
  | ((itemProps: DataArrayObject, extendedProps: ExtendedProps) => TObj)
  | TObj

type DataObjectArrayType = {
  data: Array<DataArrayObject | MaybeNull>
  component: ElementType
  valueName?: never
  itemKey?:
    | keyof DataArrayObject
    | ((item: Omit<DataArrayObject, 'component'>, index: number) => SimpleValue)
  itemProps?: ObjectArrayTypeCallback
  wrapProps?: ObjectArrayTypeCallback
}

export type Props = (DataObjectArrayType | DataSimpleArrayType | ChildrenType) &
  BaseProps
