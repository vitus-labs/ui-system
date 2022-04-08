import { get } from '@vitus-labs/core'
import { isRocketComponent } from '@vitus-labs/rocketstyle'
import { dimensionStory, mainStory, generalStory } from './stories'
import type {
  Element,
  RocketComponent,
  Configuration,
  AttrsTypes,
  ExtractDimensions,
} from './types'

// --------------------------------------------------------
// rocketstories
// --------------------------------------------------------
export type Init = (
  params: Partial<Pick<Configuration, 'decorators' | 'storyOptions'>>
) => <T extends Element | RocketComponent>(
  component: T
) => ReturnType<Rocketstories>

const init: Init =
  ({ decorators = [], storyOptions = {} }) =>
  (component) =>
    rocketstories(component, { decorators, storyOptions })

// --------------------------------------------------------
// rocketstories
// --------------------------------------------------------
export type Rocketstories = <T extends Element | RocketComponent>(
  component: T,
  params?: Partial<Pick<Configuration, 'storyOptions' | 'decorators'>>
) => T extends RocketComponent
  ? ReturnType<CreateRocketStories<T>>
  : ReturnType<CreateStories<T>>

//@ts-ignore
const rocketstories: Rocketstories = (
  component,
  { decorators = [], storyOptions = {} } = {}
) => {
  const options = {
    component,
    name: component.displayName || component.name,
    attrs: {},
    storyOptions: { gap: 16, direction: 'rows' as const, ...storyOptions },
    decorators,
  }

  if (!isRocketComponent(component)) {
    return createStories(options, {})
  }

  return createRocketstories(options, {})
}

// --------------------------------------------------------
// create Stories
// --------------------------------------------------------
export type CreateStories<C extends Element> = (
  defaultOptions: Configuration<C>,
  options: Partial<Configuration<C>>
) => {
  attrs: (params: AttrsTypes<C>) => ReturnType<CreateStories<C>>
  config: () => {
    component: Element
    title: string
    decorators?: Configuration['decorators']
  }
  main: () => ReturnType<typeof generalStory>
}

const createStories: CreateStories<any> = (defaultOptions, options) => {
  const name: string = get(options, 'component')
    ? get(options, 'component.displayName')
    : defaultOptions.name

  const result = {
    ...defaultOptions,
    name,
    component: options.component || defaultOptions.component,
    attrs: { ...defaultOptions.attrs, ...options.attrs },
    storyOptions: { ...defaultOptions.storyOptions, ...options.storyOptions },
    decorators: [
      ...(defaultOptions.decorators || []),
      ...(options.decorators || []),
    ],
  }

  return {
    attrs: (attrs) => createStories(result, { attrs }),

    // create object for `export default` in stories
    config: () => ({
      component: result.component,
      title: result.name,
      decorators: result.decorators,
    }),

    main: () => generalStory(result),
  }
}

// --------------------------------------------------------
// create rocket stories
// --------------------------------------------------------

export type CreateRocketStories<C extends RocketComponent> = (
  defaultOptions: Configuration<C>,
  options: Partial<Configuration<C>>
) => {
  attrs: (params: AttrsTypes<C>) => ReturnType<CreateRocketStories<C>>
  config: () => { component: Element; title: string }
  main: () => ReturnType<typeof mainStory>
  storyOptions: (
    options: Configuration['storyOptions']
  ) => ReturnType<CreateRocketStories<C>>
  dimension: <
    A extends ExtractDimensions<C> /* B = keyof C['$$rocketstyle'][A] */
  >(
    dimension: A,
    params?: Partial<{ ignore: any }>
  ) => ReturnType<typeof dimensionStory>
}

const createRocketstories: CreateRocketStories<any> = (
  options,
  defaultOptions
) => {
  const name: string = get(options, 'component')
    ? get(options, 'component.displayName')
    : defaultOptions.name

  const result = {
    ...defaultOptions,
    name,
    component: options.component || defaultOptions.component,
    attrs: { ...defaultOptions.attrs, ...options.attrs },
    storyOptions: { ...defaultOptions.storyOptions, ...options.storyOptions },
    decorators: [
      ...(defaultOptions.decorators || []),
      ...(options.decorators || []),
    ],
  }

  return {
    attrs: (attrs) => createRocketstories(result, { attrs }),

    // create object for `export default` in stories
    config: () => ({
      component: result.component,
      title: result.name,
      decorators: result.decorators,
    }),

    // generate main story
    main: () => mainStory(result),

    // define storyOptions
    storyOptions: (storyOptions) =>
      createRocketstories(result, { storyOptions }),

    // generate stories of defined dimension
    dimension: (dimension, params = {}) => {
      const { ignore = [] } = params

      return dimensionStory({
        ...result,
        ignore,
        dimension,
      })
    },
  }
}

export { init }

export default rocketstories
