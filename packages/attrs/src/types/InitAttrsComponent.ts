import type { ExtractProps } from '@vitus-labs/tools-types'
import type { ElementType } from './utils'
import type { Configuration } from './configuration'
import type { AttrsComponent } from './AttrsComponent'

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
