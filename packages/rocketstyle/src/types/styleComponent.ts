import type { MergeTypes, ExtractProps, ElementType } from './utils'
import type {
  Dimensions,
  DefaultDimensions,
  ExtractDimensionAttrsKeys,
} from './dimensions'
import type { OptionStyles } from './styles'
import type { DefaultProps, Configuration } from './configuration'
import type { RocketComponent } from './rocketstyle'

export type StyleComponent<
  C extends ElementType,
  T extends Record<string, unknown> | unknown = unknown,
  CT extends OptionStyles | unknown = unknown,
  D extends Dimensions = DefaultDimensions,
  UB extends boolean = boolean
> = (props: Partial<Configuration<C, D>>) => RocketComponent<
  // extract component props + add default rocketstyle props
  MergeTypes<
    [Omit<ExtractProps<C>, ExtractDimensionAttrsKeys<D>>, DefaultProps]
  >,
  // keep original component props + extract dimension props
  ExtractProps<C>,
  // set default extending props
  DefaultProps,
  T,
  CT,
  D,
  UB,
  // eslint-disable-next-line @typescript-eslint/ban-types
  {}
>
