/* eslint-disable @typescript-eslint/ban-types */
import { get } from '@vitus-labs/core'
import { isRocketComponent } from '@vitus-labs/rocketstyle'
import {
  renderDimension,
  RenderDimension,
  renderMain,
  RenderMain,
  generalStory,
  renderRender,
  renderList,
  RenderList,
} from '~/stories'
import type {
  TObj,
  Configuration,
  ElementType,
  RocketType,
  ExtractProps,
  RenderStoryCallback,
  ListStoryOptions,
} from '~/types'

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
    decorators,
  }

  return createRocketStories(result)
}

const cloneAndEhnance = (
  defaultOptions: Configuration,
  options: Partial<Configuration>
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

  // MAIN story
  // --------------------------------------------------------
  main: () => ReturnType<RenderMain<OA>> | ReturnType<typeof generalStory>

  // DIMENSION(S) story
  // --------------------------------------------------------
  dimension: <P extends keyof RA>(
    dimension: P,
    options?: Partial<{ ignore: Array<RA[P]> }>
  ) => ReturnType<RenderDimension<OA>> | null

  // RENDER story
  // --------------------------------------------------------
  render: RenderStoryCallback<OA>

  // RENDER story
  // --------------------------------------------------------
  list: (params: ListStoryOptions) => ReturnType<RenderList<OA>>

  // INIT chaining method
  // --------------------------------------------------------
  init: () => {
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

  // COMPONENT chaining method
  // --------------------------------------------------------
  decorators: <P extends Configuration['decorators']>(
    param: P
  ) => IRocketStories<OA, RA, SO>
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
  // @ts-ignore
  setComponent: (component) => cloneAndEhnance(options, { component }),

  decorators: (decorators) => cloneAndEhnance(options, { decorators }),

  // output methods
  main: () =>
    isRocketComponent(options.component)
      ? renderMain({
          ...options,
          component: options.component as RocketType,
        })
      : generalStory(options),

  render: (renderer) =>
    renderRender(renderer)({
      ...options,
      component: options.component as RocketType,
    }),

  list: (params) =>
    renderList(params)({
      ...options,
      component: options.component as RocketType,
    }),

  dimension: (dimension, params = {}) => {
    if (!isRocketComponent(options.component)) return null

    const { ignore = [] } = params

    return renderDimension(dimension, {
      ...options,
      component: options.component as RocketType,
      ignore,
    })
  },

  init: () => ({
    component: options.component,
    title: options.name,
    decorators: options.decorators,
  }),
})

export { init }

export default rocketstories
