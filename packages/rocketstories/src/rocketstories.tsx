import { get } from '@vitus-labs/core'
import { isRocketComponent } from '@vitus-labs/rocketstyle'
import { dimensionStory, mainStory, generalStory } from './stories'
import type {
  Element,
  RocketComponent,
  Configuration,
  AttrsTypes,
} from './types'

type Init = ({
  decorators,
  storyOptions,
}: Partial<Pick<Configuration, 'decorators' | 'storyOptions'>>) => <
  T extends Element | RocketComponent = any
>(
  component: T
) => T extends RocketComponent
  ? ReturnType<CreateRocketStories<T>>
  : ReturnType<CreateStories<T>>

const init: Init = ({ decorators = [], storyOptions = {} }) => (component) =>
  rocketstories(component, { decorators, storyOptions })

// --------------------------------------------------------
// rocketstories
// --------------------------------------------------------
type Rocketstories = <T extends Element | RocketComponent = any>(
  component: T,
  {
    decorators,
    storyOptions,
  }?: Partial<Pick<Configuration<T>, 'storyOptions' | 'decorators'>> | any
) => T extends RocketComponent
  ? ReturnType<CreateRocketStories<T>>
  : ReturnType<CreateStories<T>>

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const rocketstories: Rocketstories = (
  component,
  { decorators = [], storyOptions = {} } = {}
) => {
  if (!isRocketComponent(component)) {
    return createStories(
      {
        component,
        name: component.displayName || component.name,
        attrs: {},
        storyOptions: { gap: 16, direction: 'rows', ...storyOptions },
        decorators,
      },
      {} as Configuration
    )
  }

  return createRocketstories(
    {
      component,
      name: component.displayName || component.name,
      attrs: {},
      storyOptions: { gap: 16, direction: 'rows', ...storyOptions },
      decorators,
    },
    {} as Configuration
  )
}

// --------------------------------------------------------
// create Stories
// --------------------------------------------------------
type CreateStories<C = Element> = (
  options: Partial<Configuration>,
  defaultOptions: Configuration
) => {
  attrs: (params: AttrsTypes<C>) => ReturnType<CreateStories<C>>
  config: () => {
    component: Element
    title: string
    decorators?: Configuration['decorators']
  }
  main: () => ReturnType<typeof generalStory>
}

const createStories: CreateStories = (options, defaultOptions) => {
  const result = {
    ...defaultOptions,
    name: get(options, 'component')
      ? get(options, 'component.displayName')
      : defaultOptions.name,
    component: options.component || defaultOptions.component,
    attrs: { ...defaultOptions.attrs, ...options.attrs },
    storyOptions: { ...defaultOptions.storyOptions, ...options.storyOptions },
    decorators: [...defaultOptions.decorators, ...(options.decorators || [])],
  } as Configuration

  return {
    attrs: (attrs) => createStories({ attrs }, result),

    // create object for `export default` in stories
    config: () => ({
      component: result.component,
      title: result.name as string,
      decorators: result.decorators,
    }),

    main: () => generalStory(result),
  }
}

// --------------------------------------------------------
// create rocket stories
// --------------------------------------------------------

type ExtractDimensions<C extends RocketComponent> = keyof C['$$rocketstyle']

type CreateRocketStories<C extends RocketComponent = any> = (
  options: Partial<Configuration<C>>,
  defaultOptions: Configuration<C>
) => {
  attrs: (params: AttrsTypes<C>) => ReturnType<CreateRocketStories<C>>
  config: () => { component: Element; title: string }
  main: () => ReturnType<typeof mainStory>
  storyOptions: (
    options: Configuration['storyOptions']
  ) => ReturnType<CreateRocketStories<C>>
  dimension: <A extends ExtractDimensions<C>, B = keyof C['$$rocketstyle'][A]>(
    dimension: A,
    params?: Partial<{ ignore: any }>
  ) => ReturnType<typeof dimensionStory>
}

const createRocketstories: CreateRocketStories = (options, defaultOptions) => {
  const result = {
    ...defaultOptions,
    name: get(options, 'component')
      ? get(options, 'component.displayName')
      : defaultOptions.name,
    component: options.component || defaultOptions.component,
    attrs: { ...defaultOptions.attrs, ...options.attrs },
    storyOptions: { ...defaultOptions.storyOptions, ...options.storyOptions },
    decorators: [...defaultOptions.decorators, ...(options.decorators || [])],
  } as Configuration

  return {
    attrs: (attrs: Configuration['attrs']) =>
      createRocketstories({ attrs }, result),

    // create object for `export default` in stories
    config: () => ({
      component: result.component,
      title: result.name,
      decorators: result.decorators,
    }),

    // generate main story
    main: () => mainStory(result as any),

    //define storyOptions
    storyOptions: (storyOptions) =>
      createRocketstories({ storyOptions }, result),

    // generate stories of defined dimension
    dimension: (dimension, params = {}) => {
      const { ignore = [] } = params

      return dimensionStory({
        ...result,
        ignore,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dimension,
      })
    },
  }
}

export { init }

export default rocketstories
