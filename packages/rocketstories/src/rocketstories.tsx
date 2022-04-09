/* eslint-disable @typescript-eslint/ban-types */
import { get } from '@vitus-labs/core'
import { isRocketComponent } from '@vitus-labs/rocketstyle'
import { dimensionStory, mainStory, generalStory } from './stories'
import type {
  TObj,
  Configuration,
  ElementType,
  RocketType,
  ExtractProps,
} from './types'

// --------------------------------------------------------
// rocketstories
// --------------------------------------------------------
export type Init = <
  P extends Partial<Omit<Configuration, 'component' | 'attrs'>>
>(
  params: P
) => <T extends Configuration['component']>(
  component: T
) => T extends RocketType
  ? IRocketStories<ExtractProps<T>, T['$$rocketstyle']>
  : IRocketStories<ExtractProps<T>, unknown>

const init: Init =
  ({ decorators = [], storyOptions = {} }) =>
  (component) =>
    rocketstories(component, { decorators, storyOptions })

// --------------------------------------------------------
// rocketstories
// --------------------------------------------------------
export type Rocketstories = <C extends Configuration['component']>(
  component: C,
  options?: Partial<Omit<Configuration, 'component' | 'attrs'>>
) => C extends RocketType
  ? IRocketStories<ExtractProps<C>, C['$$rocketstyle']>
  : IRocketStories<ExtractProps<C>, unknown>

//@ts-ignore
const rocketstories: Rocketstories = (component, options = {}) => {
  const { decorators = [], storyOptions = {} } = options

  const result: Configuration = {
    component,
    name: component.displayName || component.name,
    attrs: {},
    storyOptions: { gap: 16, direction: 'rows' as const, ...storyOptions },
    decorators: [...decorators],
  }

  return createRocketStories(result)
}

// interface VoidFunctionComponent<P = {}> {
//   (props: P, context?: any): ReactElement<any, any> | null
//   propTypes?: WeakValidationMap<P> | undefined
//   contextTypes?: ValidationMap<any> | undefined
//   defaultProps?: Partial<P> | undefined
//   displayName?: string | undefined
// }

const cloneAndEhnance = (
  options: Configuration,
  defaultOptions: Partial<Configuration>
) => {
  const result = {
    ...defaultOptions,
    name: defaultOptions.name || options.name,
    prefix: options.prefix || defaultOptions.prefix,
    component: options.component || defaultOptions.component,
    attrs: { ...defaultOptions.attrs, ...options.attrs },
    storyOptions: { ...defaultOptions.storyOptions, ...options.storyOptions },
    decorators: [
      ...(defaultOptions.decorators || []),
      ...(options.decorators || []),
    ],
  }

  const finalName: string =
    result.name || result.component.displayName || get(result.component, 'name')

  const finalStoryName = result.prefix
    ? `${result.prefix}/${finalName}`
    : finalName

  return createRocketStories({ ...result, name: finalStoryName })
}

// --------------------------------------------------------
// create rocket stories
// --------------------------------------------------------
export interface IRocketStories<
  OA extends TObj = {},
  RA extends TObj | unknown = unknown,
  SO extends TObj = {}
> {
  CONFIG: Configuration

  // MAIN chaining method
  // --------------------------------------------------------
  main: () => ReturnType<typeof mainStory> | ReturnType<typeof generalStory>

  // DIMENSION chaining method
  // --------------------------------------------------------
  dimension: (param: keyof RA) => ReturnType<typeof dimensionStory> | null

  // MAIN chaining method
  // --------------------------------------------------------
  export: () => {
    component: Configuration['component']
    title: Configuration['name']
    decorators: Configuration['decorators']
  }

  // STORY OPTIONS chaining method
  // --------------------------------------------------------
  storyOptions: (
    options: Configuration['storyOptions']
  ) => IRocketStories<OA, RA, SO>

  // CONFIG chaining method
  // --------------------------------------------------------
  config: (
    params: Partial<Omit<Configuration, 'attrs'>>
  ) => IRocketStories<OA, RA, SO>

  // ATTRS chaining method
  // --------------------------------------------------------
  attrs: <P extends Partial<OA>>(params: P) => IRocketStories<OA, RA, SO>

  // COMPONENT chaining method
  // --------------------------------------------------------
  setComponent: <P extends Configuration['component']>(
    param: P
  ) => P extends RocketType
    ? IRocketStories<ExtractProps<P>, P['$$rocketstyle'], SO>
    : P extends ElementType
    ? IRocketStories<ExtractProps<P>, unknown, SO>
    : IRocketStories<{}, unknown, SO>
}

type CreateRocketStories = (options: Configuration) => IRocketStories
const createRocketStories: CreateRocketStories = (options) => ({
  CONFIG: options,
  // chaining methods
  storyOptions: (storyOptions) => cloneAndEhnance(options, { storyOptions }),
  config: ({ component, storyOptions, prefix, name, decorators }) =>
    cloneAndEhnance(options, {
      component,
      storyOptions,
      prefix,
      name,
      decorators,
    }),
  attrs: (attrs) => cloneAndEhnance(options, { attrs }),
  setComponent: (component) =>
    //@ts-ignore
    cloneAndEhnance(options, { component }),

  // output methods
  main: () =>
    isRocketComponent(options.component)
      ? mainStory({
          ...options,
          component: options.component as RocketType,
        })
      : generalStory(options),
  dimension: (dimension, params = {}) => {
    if (!isRocketComponent(options.component)) return null

    const { ignore = [] }: any = params

    return dimensionStory({
      ...options,
      component: options.component as RocketType,
      ignore,
      dimension,
    })
  },
  export: () => ({
    component: options.component,
    title: options.name,
    decorators: options.decorators,
  }),
})

export { init }

export default rocketstories
