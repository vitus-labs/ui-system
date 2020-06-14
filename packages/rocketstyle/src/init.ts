import styleComponent, { OptionsType } from './rocketstyle'
import * as React from 'react'

const defaultDimensions = {
  states: 'state',
  sizes: 'size',
  variants: 'variant',
  multiple: ['multiple', { multi: true }],
}

type RocketStyleProps = Partial<{
  dimensions:{
    [key:string] : string | Array<string|{[key:string]:boolean}>
  }
  useBooleans: boolean
}>

type ConfigProps = {
  name: string
  component: React.ComponentType<any>
}

type ComponentType<T> = React.ComponentType<T> & {
  config: <P,>(opts: Partial<OptionsType>)=> ComponentType<T & P>
  states: ((...args: any)=> ComponentType<T>)
  styles:  ((...args: any)=> ComponentType<T>)
  attrs:  ((...args: any)=> ComponentType<T>)
  multiple:  ((...args: any)=> ComponentType<T>)
  theme:  ((...args: any)=> ComponentType<T>)
}

const rocketstyle = <T,BaseType = ComponentType<T>>({
  dimensions = defaultDimensions,
  useBooleans = true,
}: RocketStyleProps = {}) => ({ name, component }: ConfigProps) => {
  // if (!name) {
  //   throw Error('Component name is missing in params')
  // }
  if (!component) {
    throw Error('Rendered component is missing in params')
  }

  return styleComponent<T,BaseType>({
    name,
    component,
    useBooleans,
    dimensions,
    dimensionKeys: Object.keys(dimensions),
    dimensionValues: Object.values(dimensions).map((item) => {
      if (Array.isArray(item)) return item[0]
      return item
    }),
  })
}

export default rocketstyle
