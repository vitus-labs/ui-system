import { isEmpty } from '@vitus-labs/core'
import { ALL_RESERVED_KEYS } from '~/constants'
import defaultDimensions from '~/constants/defaultDimensions'
import rocketComponent from '~/rocketstyle'
import type { DefaultDimensions, Dimensions } from '~/types/dimensions'
import type { RocketComponent } from '~/types/rocketComponent'
import type { ElementType } from '~/types/utils'
import {
  getDimensionsValues,
  getKeys,
  getMultipleDimensions,
  getTransformDimensions,
} from '~/utils/dimensions'

export type Rocketstyle = <
  D extends Dimensions = DefaultDimensions,
  UB extends boolean = true,
>({
  dimensions,
  useBooleans,
}?: {
  dimensions?: D
  useBooleans?: UB
}) => <C extends ElementType>({
  name,
  component,
}: {
  name: string
  component: C
}) => ReturnType<RocketComponent<C, {}, {}, D, UB>>

/**
 * Factory initializer for rocketstyle components. Validates dimension
 * configurations against reserved keys, then delegates to the core
 * `rocketComponent` builder with pre-computed dimension metadata.
 */
type InitErrors = Partial<{
  component: string
  name: string
  dimensions: string
  invalidDimensions: string
}>

const validateInit = (
  name: string,
  component: unknown,
  dimensions: Dimensions,
) => {
  const errors: InitErrors = {}

  if (!component) {
    errors.component = 'Parameter `component` is missing in params!'
  }

  if (!name) {
    errors.name = 'Parameter `name` is missing in params!'
  }

  if (isEmpty(dimensions)) {
    errors.dimensions = 'Parameter `dimensions` is missing in params!'
  } else {
    const definedDimensions = getKeys(dimensions)
    const invalidDimension = ALL_RESERVED_KEYS.some((item) =>
      definedDimensions.some((d) => d === item),
    )

    if (invalidDimension) {
      errors.invalidDimensions = `Some of your \`dimensions\` is invalid and uses reserved static keys which are
          ${defaultDimensions.toString()}`
    }
  }

  if (!isEmpty(errors)) {
    throw Error(JSON.stringify(errors))
  }
}

/**
 * Generic implementation. The `D | DefaultDimensions` runtime fallback is
 * narrowed to `D` via a single cast — semantically correct because when no
 * user dimensions are supplied, `D` *is* the default (its type-parameter
 * default is `DefaultDimensions`). This single boundary cast replaces the
 * file-wide `@ts-nocheck` previously used here.
 */
const rocketstyle = <
  D extends Dimensions = DefaultDimensions,
  UB extends boolean = true,
>(params?: {
  dimensions?: D
  useBooleans?: UB
}) => {
  const dimensions = (params?.dimensions ?? defaultDimensions) as D
  const useBooleans = (params?.useBooleans ?? true) as UB

  return <C extends ElementType>({
    name,
    component,
  }: {
    name: string
    component: C
  }) => {
    if (process.env.NODE_ENV !== 'production') {
      validateInit(name, component, dimensions)
    }

    // `rocketComponent` is annotated with the generic `RocketComponent` type
    // but its implementation isn't itself generic — `const x: GenericFn = impl`
    // collapses the generics down to their defaults at the call site. We
    // therefore cast through `unknown` at this single boundary so the public
    // `Rocketstyle` API remains generic over `D`/`UB` for consumers.
    return rocketComponent({
      name,
      component,
      useBooleans,
      dimensions,
      dimensionKeys: getKeys(dimensions),
      dimensionValues: getDimensionsValues(dimensions),
      multiKeys: getMultipleDimensions(dimensions),
      transformKeys: getTransformDimensions(dimensions),
      styled: true,
    } as unknown as Parameters<RocketComponent>[0]) as unknown as ReturnType<
      RocketComponent<C, {}, {}, D, UB>
    >
  }
}

const typedRocketstyle: Rocketstyle = rocketstyle

export default typedRocketstyle
