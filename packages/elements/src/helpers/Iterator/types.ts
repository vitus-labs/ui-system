import React from 'react'

export type KeyType = React.ReactText
export type ComponentType = React.ReactNode

type ArrayObjectData = Partial<{ component: ComponentType }> &
  Record<string, any>

type ItemIdType = ArrayObjectData & {
  id?: KeyType
}

type ItemKeyType = ArrayObjectData & {
  key?: KeyType
}

type ItemItemIdType = ArrayObjectData & {
  itemId?: KeyType
}

export type DataArrayObject = ItemIdType | ItemKeyType | ItemItemIdType

type BaseProps = Partial<{
  wrapComponent: React.ReactNode
  extendProps: boolean
  itemProps:
    | Record<string, any>
    | ((key: string | number) => Record<string, any>)
}>

type ChildrenType = BaseProps & {
  children: React.ReactNodeArray
}

type DataSimpleArrayType = BaseProps & {
  component: ComponentType
  data: Array<string | number>
  itemKey?: string
}

type DataObjectArrayType = BaseProps & {
  component: ComponentType
  data: Array<DataArrayObject>
  itemKey?: string | ((item: object, index: number) => string | number)
}

export type Props = ChildrenType | DataSimpleArrayType | DataObjectArrayType
