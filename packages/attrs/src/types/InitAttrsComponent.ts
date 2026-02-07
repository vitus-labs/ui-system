import type { AttrsComponent } from './AttrsComponent'
import type { Configuration } from './configuration'
import type { ElementType, ExtractProps } from './utils'

export type InitAttrsComponent<C extends ElementType = ElementType> = (
  params: Configuration<C>,
) => AttrsComponent<
  C,
  // keep original component props + extract dimension props
  ExtractProps<C>,
  // set default extending props
  {},
  {},
  {}
>
