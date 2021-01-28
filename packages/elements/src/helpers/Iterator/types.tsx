import type {
  ComponentType,
  ForwardRefExoticComponent,
  ReactText,
  ReactNode,
} from 'react'

export type KeyType = ReactText
export type ElementType<
  T extends Record<string, unknown> | unknown = unknown
> = ComponentType<T> | ForwardRefExoticComponent<T>

export type ExtendedProps = {
  index: number
  first: boolean
  last: boolean
  odd: boolean
  even: boolean
  position: number
}

type ArrayObjectData = Partial<
  { component: ElementType } & Record<string, unknown>
>

type ItemIdType = ArrayObjectData & {
  id?: KeyType
}

type ItemKeyType = ArrayObjectData & {
  key?: KeyType
}

type ItemItemIdType = ArrayObjectData & {
  itemId?: KeyType
}

export type DataArrayObject =
  | ItemIdType
  | ItemKeyType
  | ItemItemIdType
  | ArrayObjectData

type BaseProps = Partial<{
  wrapComponent: ElementType
  extendProps: boolean
  itemProps:
    | Record<string, unknown>
    | ((
        key: string | number,
        extendedProps: ExtendedProps
      ) => Record<string, unknown>)
  wrapProps:
    | Record<string, unknown>
    | ((
        key: string | number,
        extendedProps: ExtendedProps
      ) => Record<string, unknown>)
}>

type ChildrenType = BaseProps & {
  children: ReactNode
}

type DataSimpleArrayType = BaseProps & {
  component: ElementType
  data: Array<string | number>
  itemKey?: (item: string | number, index: number) => string | number
  valueName: string
}

type DataObjectArrayType = BaseProps & {
  component: ElementType
  data: Array<DataArrayObject>
  itemKey?:
    | string
    | ((item: Record<string, unknown>, index: number) => string | number)
}

export type Props = ChildrenType | DataSimpleArrayType | DataObjectArrayType
