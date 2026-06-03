import { get } from '@vitus-labs/core'
import { isRocketComponent } from '@vitus-labs/rocketstyle'
import * as simplestory from '~/stories/base'
import * as rocketstory from '~/stories/rocketstories'
import type {
  Configuration,
  Control,
  ListStoryOptions,
  RenderStoryOptions,
  RocketType,
  StoryExtractProps,
  TObj,
} from '~/types'

/**
 * Clones the current configuration, merges in new options, and returns a
 * fresh IRocketStories instance for immutable chaining.
 *
 * Component-swap reset: when `options.component` differs from the current
 * `defaultOptions.component`, the prior `attrs` are dropped — they were
 * tailored to the previous component's prop shape, and applying them to a
 * different component silently leaks invalid props onto the rendered
 * output. Story-level config (`storyOptions`, `controls`, `decorators`)
 * is preserved because it's about how stories render, not about the
 * component's prop shape. Mirrors the same fix in `@vitus-labs/rocketstyle`'s
 * `cloneAndEnhance` (PR #200).
 *
 * Callers who want to preserve attrs across a component swap must
 * re-chain explicitly:
 *
 *   stories.replaceComponent(NewComp).attrs(sharedAttrs)
 */
const cloneAndEnhance = (
  defaultOptions: Configuration,
  options: Partial<Configuration>,
) => {
  const componentChanged =
    options.component != null && options.component !== defaultOptions.component

  const result = {
    ...defaultOptions,
    name: defaultOptions.name || options.name,
    prefix: options.prefix || defaultOptions.prefix,
    component: options.component || defaultOptions.component,
    attrs: componentChanged
      ? { ...options.attrs }
      : { ...defaultOptions.attrs, ...options.attrs },
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

/**
 * Chainable builder interface returned by the rocketstories factory.
 * Provides methods to generate Storybook stories (main, dimension, list, render)
 * and chainable configuration methods (attrs, controls, storyOptions, config, etc.).
 *
 * @typeParam OA - The component's own prop types
 * @typeParam RA - The rocketstyle dimension attributes (unknown for non-rocketstyle components)
 * @typeParam ISRS - Whether the wrapped component is a rocketstyle component
 */
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
    options?: Partial<{ ignore: RA[P][] }>,
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

  // INIT — Storybook default-export object
  // --------------------------------------------------------
  // A property literal, NOT a method. Use as `export default stories.init`
  // (no parens) — calling it as a function fails at runtime.
  init: {
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
    ? IRocketStories<StoryExtractProps<P>, P['$$rocketstyle'], true>
    : IRocketStories<StoryExtractProps<P>, unknown, false>

  // COMPONENT chaining method
  // --------------------------------------------------------
  decorators: <P extends Configuration['decorators']>(
    param: P,
  ) => IRocketStories<OA, RA, ISRS>
}

/**
 * Core story generation pipeline. Takes a full Configuration object and returns
 * an IRocketStories builder. Delegates to rocketstory or simplestory renderers
 * depending on whether the component is a rocketstyle component.
 */
type CreateRocketStories = (options: Configuration) => IRocketStories
// @ts-expect-error — `IRocketStories` is built up via Object.assign of chain
// methods; the impl satisfies the runtime shape but TS can't verify the
// recursive-builder return-type structure at the assignment site
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
    storyOptions: (storyOptions) => cloneAndEnhance(options, { storyOptions }),
    controls: (controls) => cloneAndEnhance(options, { controls }),

    config: ({ component, storyOptions, prefix, name, decorators }) =>
      cloneAndEnhance(options, {
        component,
        storyOptions,
        prefix,
        name,
        decorators,
      }),

    attrs: (attrs) => cloneAndEnhance(options, { attrs }),

    replaceComponent: (component) => cloneAndEnhance(options, { component }),

    decorators: (decorators) => cloneAndEnhance(options, { decorators }),
  }
}

export default createRocketStories
