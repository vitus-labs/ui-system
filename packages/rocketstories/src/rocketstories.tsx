/* eslint-disable @typescript-eslint/ban-types */
import { get } from '@vitus-labs/core'
import { isRocketComponent } from '@vitus-labs/rocketstyle'
import { dimensionStory, mainStory, generalStory } from './stories'
import type {
  TObj,
  RocketStoryConfiguration,
  StoryConfiguration,
  ExtractProps,
} from './types'

// --------------------------------------------------------
// rocketstories
// --------------------------------------------------------
export type Init = <
  P extends
    | Partial<Omit<RocketStoryConfiguration, 'component' | 'attrs'>>
    | Partial<Omit<StoryConfiguration, 'component' | 'attrs'>>
>(
  params: P
) => <
  T extends
    | StoryConfiguration['component']
    | RocketStoryConfiguration['component']
>(
  component: T
) => T extends RocketStoryConfiguration['component']
  ? ReturnType<CreateRocketStories<ExtractProps<T>, T['$$rocketstyle'], {}>>
  : ReturnType<CreateStories<ExtractProps<T>, {}>>

const init: Init =
  ({ decorators = [], storyOptions = {} }) =>
  (component) =>
    rocketstories(component, { decorators, storyOptions })

// --------------------------------------------------------
// rocketstories
// --------------------------------------------------------
export type Rocketstories = <
  T extends
    | StoryConfiguration['component']
    | RocketStoryConfiguration['component']
>(
  component: T,
  options?: T extends RocketStoryConfiguration['component']
    ? Partial<Omit<RocketStoryConfiguration, 'component' | 'attrs'>>
    : Partial<Omit<StoryConfiguration, 'component' | 'attrs'>>
) => T extends RocketStoryConfiguration['component']
  ? ReturnType<CreateRocketStories<ExtractProps<T>, T['$$rocketstyle'], {}>>
  : ReturnType<CreateStories<ExtractProps<T>, {}>>

// @ts-ignore
const rocketstories: Rocketstories = (
  component,
  { decorators = [], storyOptions = {} } = {}
) => {
  const options = {
    component,
    name: component.displayName || component.name,
    attrs: {},
    storyOptions: { gap: 16, direction: 'rows' as const, ...storyOptions },
    decorators: [...decorators],
  }

  if (!isRocketComponent(component)) {
    return createStories(options as StoryConfiguration, {})
  }

  return createRocketStories(options as RocketStoryConfiguration, {})
}

// --------------------------------------------------------
// create Stories
// --------------------------------------------------------
export type CreateStories<OA extends TObj = {}, SO extends TObj = {}> = (
  defaultOptions: StoryConfiguration,
  options: Partial<StoryConfiguration>
) => {
  // STORY OPTIONS chaining method
  // --------------------------------------------------------
  storyOptions: (
    options: StoryConfiguration['storyOptions']
  ) => ReturnType<CreateStories<OA, SO>>

  // CONFIG chaining method
  // --------------------------------------------------------
  config: (
    params: Partial<Omit<StoryConfiguration, 'attrs'>>
  ) => ReturnType<CreateStories<OA, SO>>

  // ATTRS chaining method
  // --------------------------------------------------------
  attrs: (params: Partial<OA>) => ReturnType<CreateStories<OA, SO>>

  // COMPONENT chaining method
  // --------------------------------------------------------
  setComponent: <P extends StoryConfiguration['component']>(
    param: P
  ) => P extends StoryConfiguration['component']
    ? ReturnType<CreateStories<ExtractProps<P>, SO>>
    : ReturnType<CreateStories<{}, SO>>

  // MAIN chaining method
  // --------------------------------------------------------
  main: () => ReturnType<typeof generalStory>
  export: () => {
    component: Element
    title: string
    decorators: StoryConfiguration['decorators']
  }
}

// @ts-ignore
const createStories: CreateStories = (defaultOptions, options) => {
  const name: string = get(options, 'component')
    ? get(options, 'component.displayName')
    : defaultOptions.name

  const result = {
    ...defaultOptions,
    name,
    prefix: options.prefix || defaultOptions.prefix,
    component: options.component || defaultOptions.component,
    attrs: { ...defaultOptions.attrs, ...options.attrs },
    storyOptions: { ...defaultOptions.storyOptions, ...options.storyOptions },
    decorators: [
      ...(defaultOptions.decorators || []),
      ...(options.decorators || []),
    ],
  }

  return {
    // chaining methods
    storyOptions: (storyOptions) => createStories(result, { storyOptions }),
    config: ({ component, storyOptions, prefix, name, decorators }) =>
      createStories(result, {
        component,
        storyOptions,
        prefix,
        name,
        decorators,
      }),
    attrs: (attrs) => createStories(result, { attrs }),
    setComponent: (component) => createStories(result, { component }),

    // output methods
    main: () => generalStory(result),
    export: () => ({
      component: result.component,
      title: `${result.prefix}/${result.name}`,
      decorators: result.decorators,
    }),
  }
}

// --------------------------------------------------------
// create rocket stories
// --------------------------------------------------------
export type CreateRocketStories<
  OA extends TObj = {},
  RA extends TObj | unknown = unknown,
  SO extends TObj = {}
> = (
  defaultOptions: RocketStoryConfiguration,
  options: Partial<RocketStoryConfiguration>
) => {
  // STORY OPTIONS chaining method
  // --------------------------------------------------------
  storyOptions: (
    options: RocketStoryConfiguration['storyOptions']
  ) => ReturnType<CreateRocketStories<OA, RA, SO>>

  // CONFIG chaining method
  // --------------------------------------------------------
  config: (
    params: Partial<Omit<RocketStoryConfiguration, 'attrs'>>
  ) => ReturnType<CreateRocketStories<OA, RA, SO>>

  // ATTRS chaining method
  // --------------------------------------------------------
  attrs: (params: Partial<OA>) => ReturnType<CreateRocketStories<OA, RA, SO>>

  // COMPONENT chaining method
  // --------------------------------------------------------
  setComponent: <P extends RocketStoryConfiguration['component']>(
    param: P
  ) => P extends RocketStoryConfiguration['component']
    ? ReturnType<CreateRocketStories<ExtractProps<P>, P['$$rocketstyle'], SO>>
    : ReturnType<CreateRocketStories<{}, RA, SO>>

  // MAIN chaining method
  // --------------------------------------------------------
  main: () => ReturnType<typeof generalStory>
  dimension: <P extends keyof RA>(
    dimension: P,
    params?: Partial<{ ignore: any }>
  ) => ReturnType<typeof dimensionStory>
  export: () => {
    component: Element
    title: string
    decorators: RocketStoryConfiguration['decorators']
  }
}

// @ts-ignore
const createRocketStories: CreateRocketStories = (options, defaultOptions) => {
  const name: string = get(options, 'component')
    ? get(options, 'component.displayName')
    : defaultOptions.name

  const result = {
    ...defaultOptions,
    name,
    prefix: options.prefix || defaultOptions.prefix,
    component: options.component || defaultOptions.component,
    attrs: { ...defaultOptions.attrs, ...options.attrs },
    storyOptions: { ...defaultOptions.storyOptions, ...options.storyOptions },
    decorators: [
      ...(defaultOptions.decorators || []),
      ...(options.decorators || []),
    ],
  }

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
    main: () => mainStory(result),
    dimension: (dimension, params = {}) => {
      const { ignore = [] } = params

      return dimensionStory({
        ...result,
        ignore,
        dimension,
      })
    },
    export: () => ({
      component: result.component,
      title: `${result.prefix}/${result.name}`,
      decorators: result.decorators,
    }),
  }
}

export { init }

export default rocketstories
