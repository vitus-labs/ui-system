/* eslint-disable @typescript-eslint/ban-types */
import type { ExtractProps, ElementType, TObj } from './utils'
import type { Dimensions, DefaultDimensions } from './dimensions'
import type { Configuration } from './configuration'
import type { IRocketStyleComponent } from './rocketstyle'

export type RocketComponent<
  C extends ElementType = ElementType,
  T extends TObj = {},
  CSS extends TObj = {},
  D extends Dimensions = DefaultDimensions,
  UB extends boolean = boolean
> = (props: Configuration<C, D>) => IRocketStyleComponent<
  // keep original component props + extract dimension props
  ExtractProps<C>,
  // set default extending props
  {},
  T,
  CSS,
  {},
  {},
  D,
  UB,
  // eslint-disable-next-line @typescript-eslint/ban-types
  {}
>
