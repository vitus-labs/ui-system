import type { MergeTypes, ExtractProps, ElementType } from '~/types/utils'
import type { Dimensions, ExtractDimensionAttrsKeys } from '~/types/dimensions'
import type { OptionStyles } from '~/types/styles'
import type { DefaultProps, Configuration } from '~/types/configuration'
import type { RocketComponent } from '~/types/rocketstyle'

export type StyleComponent<
  C extends ElementType = ElementType,
  T extends Record<string, unknown> | unknown = unknown,
  CT extends OptionStyles | unknown = unknown,
  D extends Dimensions = Dimensions,
  UB extends boolean = boolean
> = (
  props: Configuration<C, D>
) => RocketComponent<
  // extract component props + add default rocketstyle props
  MergeTypes<
    [Omit<ExtractProps<C>, ExtractDimensionAttrsKeys<D>>, DefaultProps<C, D>]
  >,
  // keep original component props + extract dimension props
  ExtractProps<C>,
  // set default extending props
  DefaultProps<C, D>,
  T,
  CT,
  D,
  UB,
  // eslint-disable-next-line @typescript-eslint/ban-types
  {}
>
