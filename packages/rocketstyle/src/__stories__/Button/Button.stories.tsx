import React from 'react'
import Button, { ProviderButton, ButtonConsumer } from './Button'

// // merge types
// type OptionalPropertyNames<T> = {
//   [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never
// }[keyof T]

// type SpreadProperties<L, R, K extends keyof L & keyof R> = {
//   [P in K]: L[P] | Exclude<R[P], undefined>
// }

// type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

// type SpreadTwo<L, R> = Id<
//   Pick<L, Exclude<keyof L, keyof R>> & R
//   // Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>> &
//   // Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>> &
//   // SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
// >

// type Spread<A extends readonly [...any]> = A extends [infer L, ...infer R]
//   ? SpreadTwo<L, Spread<R>>
//   : unknown

// type A = { label?: string; href: string; onClick?: any }
// type B = { label?: boolean }
// type Z = {}

// type D = OptionalPropertyNames<A>

// type C = Spread<[A, B]>

export default {
  component: Button,
  title: 'Button',
}

export const button = () => (
  <>
    <Button label="Button" />
    <Button tertiary state="primary" multiple={['centered']} label="Button" />
  </>
)

export const childrenStyling = () => (
  <>
    <ProviderButton gap={16} beforeContent="icon" afterContent="icon">
      <ButtonConsumer gap={16} beforeContent="icon" afterContent="icon">
        inner text component
      </ButtonConsumer>
    </ProviderButton>
  </>
)
