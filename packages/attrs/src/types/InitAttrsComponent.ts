/* eslint-disable @typescript-eslint/ban-types */
import type { ExtractProps, ElementType } from './utils'
import type { Configuration } from './configuration'
import type { AttrsComponent } from './AttrsComponent'

export type InitAttrsComponent<C extends ElementType = ElementType> = (
  params: Configuration<C>
) => AttrsComponent<
  // keep original component props + extract dimension props
  ExtractProps<C>,
  // set default extending props
  {},
  {},
  {}
>
