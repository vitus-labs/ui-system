import { get } from '@vitus-labs/core'
import { isRocketComponent } from '@vitus-labs/rocketstyle'
import * as simplestory from '~/stories/base'
import * as rocketstory from '~/stories/rocketstories'
import type {
  Configuration,
  Control,
  ExtractProps,
  ListStoryOptions,
  RenderStoryOptions,
  RocketType,
  TObj,
} from '~/types'

const cloneAndEhnance = (
  defaultOptions: Configuration,
  options: Partial<Configuration>,
) => {
  const result = {
    ...defaultOptions,
    name: defaultOptions.name || options.name,
    prefix: options.prefix || defaultOptions.prefix,
    component: options.component || defaultOptions.component,
    attrs: { ...defaultOptions.attrs, ...options.attrs },
    storyOptions: { ...defaultOptions.storyOptions, ...options.storyOptions },
    controls: { ...defaultOptions.controls, ...options.controls },
    decorators: [
      ...(defaultOptions.decorators || []),
      ...(options.decorators || []),
    ],
  }

  const finalName = (result.name ||
    result.component.displayName ||
    get(result.component, 'name')) as string

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
  ISRS extends boolean = false,
> {
  CONFIG: Configuration

  // MAIN story
  // --------------------------------------------------------
  main: () => ISRS extends true
    ? ReturnType<rocketstory.RenderMain<OA>>
    : ReturnType<simplestory.RenderMain<OA>>

  // DIMENSION(S) story
  // --------------------------------------------------------
  dimension: <P extends keyof RA>(
    dimension: ISRS extends true ? P : never,
    options?: Partial<{ ignore: Array<RA[P]> }>,
  ) => ReturnType<rocketstory.RenderDimension<OA>> | null

  // RENDER story
  // --------------------------------------------------------
  render: (
    params: RenderStoryOptions<OA>,
  ) => ISRS extends true
    ? ReturnType<rocketstory.RenderRender<OA>>
    : ReturnType<simplestory.RenderRender<OA>>

  // RENDER story
  // --------------------------------------------------------
  list: (
    params: ListStoryOptions,
  ) => ISRS extends true
    ? ReturnType<rocketstory.RenderList<OA>>
    : ReturnType<simplestory.RenderList<OA>>

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
    options: Configuration['storyOptions'],
  ) => IRocketStories<OA, RA, ISRS>

  controls: (
    options: Partial<{ [I in keyof OA]: Control }>,
  ) => IRocketStories<OA, RA, ISRS>

  // CONFIG chaining method
  // --------------------------------------------------------
  config: <P extends Partial<Omit<Configuration, 'attrs'>>>(
    params: P,
  ) => IRocketStories<OA, RA, ISRS>

  // ATTRS chaining method
  // --------------------------------------------------------
  attrs: <P extends Partial<OA>>(params: P) => IRocketStories<OA, RA, ISRS>

  // COMPONENT chaining method
  // --------------------------------------------------------
  replaceComponent: <P extends Configuration['component']>(
    param: P,
  ) => P extends RocketType
    ? IRocketStories<ExtractProps<P>, P['$$rocketstyle'], true>
    : IRocketStories<ExtractProps<P>, unknown, false>

  // COMPONENT chaining method
  // --------------------------------------------------------
  decorators: <P extends Configuration['decorators']>(
    param: P,
  ) => IRocketStories<OA, RA, ISRS>
}

type CreateRocketStories = (options: Configuration) => IRocketStories
// @ts-expect-error
const createRocketStories: CreateRocketStories = (options) => {
  const isRocket = isRocketComponent(options.component)

  return {
    CONFIG: options,
    // output methods
    main: () =>
      isRocket
        ? rocketstory.renderMain({
            ...options,
            component: options.component as RocketType,
          })
        : simplestory.renderMain(options),
    dimension: (dimension, params = {}) => {
      if (!isRocket) return null

      const { ignore = [] } = params

      return rocketstory.renderDimension(dimension, {
        ...options,
        component: options.component as RocketType,
        ignore,
      })
    },

    render: (renderer) =>
      isRocket
        ? rocketstory.renderRender(renderer)({
            ...options,
            component: options.component as RocketType,
          })
        : simplestory.renderRender(renderer)({
            ...options,
            component: options.component as RocketType,
          }),

    list: (params) =>
      isRocket
        ? rocketstory.renderList(params)({
            ...options,
            component: options.component as RocketType,
          })
        : simplestory.renderList(params)({
            ...options,
            component: options.component as RocketType,
          }),

    init: {
      component: options.component,
      title: options.name,
      decorators: options.decorators,
    },

    // chaining methods
    storyOptions: (storyOptions) => cloneAndEhnance(options, { storyOptions }),
    controls: (controls) => cloneAndEhnance(options, { controls }),

    config: ({ component, storyOptions, prefix, name, decorators }) =>
      cloneAndEhnance(options, {
        component,
        storyOptions,
        prefix,
        name,
        decorators,
      }),

    attrs: (attrs) => cloneAndEhnance(options, { attrs }),

    replaceComponent: (component) => cloneAndEhnance(options, { component }),

    decorators: (decorators) => cloneAndEhnance(options, { decorators }),
  }
}

export default createRocketStories
