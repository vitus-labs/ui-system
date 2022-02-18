/* eslint-disable @typescript-eslint/ban-types */
import type { ExtractProps, ElementType, TObj } from './utils'
import type { Dimensions, DefaultDimensions } from './dimensions'
import type { Configuration } from './configuration'
import type { RocketComponent } from './rocketstyle'

export type StyleComponent<
  C extends ElementType,
  T extends TObj = {},
  CSS extends TObj = {},
  D extends Dimensions = DefaultDimensions,
  UB extends boolean = boolean
> = (props: Partial<Configuration<C, D>>) => RocketComponent<
  // keep original component props + extract dimension props
  ExtractProps<C>,
  // set default extending props
  {},
  T,
  CSS,
  D,
  UB,
  // eslint-disable-next-line @typescript-eslint/ban-types
  {}
>
