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
  ? ReturnType<CreateRocketStories<ExtractProps<T>, T['$$rocketstyle']>>
  : ReturnType<CreateRocketStories<ExtractProps<T>, unknown>>

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
  ? ReturnType<CreateRocketStories<ExtractProps<C>, C['$$rocketstyle']>>
  : ReturnType<CreateRocketStories<ExtractProps<C>, unknown>>

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

  return createRocketStories(result, {} as Configuration)
}

// --------------------------------------------------------
// create rocket stories
// --------------------------------------------------------
export type CreateRocketStories<
  OA extends TObj = {},
  RA extends TObj | unknown = unknown,
  SO extends TObj = {}
> = (
  defaultOptions: Configuration,
  options: Partial<Configuration>
) => {
  // STORY OPTIONS chaining method
  // --------------------------------------------------------
  storyOptions: (
    options: Configuration['storyOptions']
  ) => ReturnType<CreateRocketStories<OA, RA, SO>>

  // CONFIG chaining method
  // --------------------------------------------------------
  config: (
    params: Partial<Omit<Configuration, 'attrs'>>
  ) => ReturnType<CreateRocketStories<OA, RA, SO>>

  // ATTRS chaining method
  // --------------------------------------------------------
  attrs: <P extends Partial<OA>>(
    params: P
  ) => ReturnType<CreateRocketStories<OA, RA, SO>>

  // COMPONENT chaining method
  // --------------------------------------------------------
  setComponent: <P extends Configuration['component']>(
    param: P
  ) => P extends RocketType
    ? ReturnType<CreateRocketStories<ExtractProps<P>, P['$$rocketstyle'], SO>>
    : P extends ElementType
    ? ReturnType<CreateRocketStories<ExtractProps<P>, unknown, SO>>
    : ReturnType<CreateRocketStories<{}, unknown, SO>>

  // MAIN chaining method
  // --------------------------------------------------------
  main: () => ReturnType<typeof generalStory> | ReturnType<typeof mainStory>
  dimension: <P extends keyof RA>(
    dimension: P,
    params?: Partial<{ ignore: any }>
  ) => ReturnType<typeof dimensionStory>
  export: () => {
    component: Element
    title: string
    decorators: Configuration['decorators']
  }
}

// @ts-ignore
const createRocketStories: CreateRocketStories = (options, defaultOptions) => {
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

  console.log(finalStoryName)

  return {
    // chaining methods
    storyOptions: (storyOptions) =>
      createRocketStories(result, { storyOptions }),
    config: ({ component, storyOptions, prefix, name, decorators }) =>
      createRocketStories(result, {
        component,
        storyOptions,
        prefix,
        name,
        decorators,
      }),
    attrs: (attrs) => createRocketStories(result, { attrs }),
    setComponent: (component) => createRocketStories(result, { component }),

    // output methods
    main: () =>
      isRocketComponent(result.component)
        ? mainStory({
            ...result,
            component: result.component as RocketType,
            name: finalStoryName,
          })
        : generalStory(result),
    dimension: (dimension, params = {}) => {
      if (!isRocketComponent(result.component)) return null

      const { ignore = [] } = params

      return dimensionStory({
        ...result,
        component: result.component as RocketType,
        ignore,
        dimension,
        name: finalStoryName,
      })
    },
    export: () => ({
      component: result.component,
      title: finalStoryName,
      decorators: result.decorators,
    }),
  }
}

export { init }

export default rocketstories
