import type { ExtractProps, ElementType, TObj } from './utils'
import type { Dimensions, DefaultDimensions } from './dimensions'
import type { Configuration } from './configuration'
import type { RocketStyleComponent } from './rocketstyle'

export type RocketComponent<
  C extends ElementType = ElementType,
  T extends TObj = {},
  CSS extends TObj = {},
  D extends Dimensions = DefaultDimensions,
  UB extends boolean = boolean,
> = (props: Configuration<C, D>) => RocketStyleComponent<
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
  {}
>
