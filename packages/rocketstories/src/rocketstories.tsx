import { get } from '@vitus-labs/core'
import { isRocketComponent } from '@vitus-labs/rocketstyle'
import story from '~/createStories/story'
import mainStory from '~/createStories/mainStory'
import dimensionStories from '~/createStories/dimensionStories'
import type { Element, RocketComponent, Configuration } from '~/types'

// --------------------------------------------------------
// rocketstories
// --------------------------------------------------------
type Rocketstories = <T extends Element | RocketComponent>(
  component: T
) => T extends RocketComponent
  ? ReturnType<CreateRocketStories<T>>
  : ReturnType<CreateStories<T>>

// @ts-ignore
const rocketstories: Rocketstories = (component) => {
  if (!isRocketComponent(component)) {
    return createStories(
      {
        component,
        name: component.displayName || component.name,
        attrs: {},
      },
      {} as Configuration
    )
  }

  return createRocketstories(
    {
      component,
      name: component.displayName || component.name,
      attrs: {},
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
  attrs: (params: Record<string, unknown>) => ReturnType<CreateStories<C>>
  main: () => { component: Element; title: string }
  story: () => ReturnType<typeof story>
}

const createStories: CreateStories = (options, defaultOptions) => {
  const result = {
    ...defaultOptions,
    name: get(options, 'component')
      ? // @ts-ignore
        options.component.displayName
      : defaultOptions.name,
    component: options.component || defaultOptions.component,
    attrs: { ...defaultOptions.attrs, ...options.attrs },
  } as Configuration

  return {
    attrs: (attrs) => createStories({ attrs }, result),

    // create object for `export default` in stories
    main: () => ({
      component: result.component,
      title: result.name as string,
    }),

    story: () => story(result),
  }
}

// --------------------------------------------------------
// create rocket stories
// --------------------------------------------------------

type CreateRocketStories<C = Element> = (
  options: Partial<Configuration>,
  defaultOptions: Configuration
) => {
  attrs: (params: Record<string, any>) => ReturnType<CreateRocketStories<C>>
  main: () => { component: Element; title: string }
  mainStory: () => ReturnType<typeof mainStory>
  makeStories: (dimension: string) => ReturnType<typeof dimensionStories>
}

const createRocketstories: CreateRocketStories = (options, defaultOptions) => {
  const result = {
    ...defaultOptions,
    name: get(options, 'component')
      ? // @ts-ignore
        options.component.displayName
      : defaultOptions.name,
    component: options.component || defaultOptions.component,
    attrs: { ...defaultOptions.attrs, ...options.attrs },
  } as Configuration

  return {
    attrs: (attrs: Configuration['attrs']) =>
      createRocketstories({ attrs }, result),

    // create object for `export default` in stories
    main: () => ({
      component: result.component,
      title: result.name,
    }),

    // generate main story
    mainStory: () => mainStory(result),

    // generate stories of defined dimension
    makeStories: (dimension) =>
      dimensionStories({
        ...result,
        dimension,
      }),
  }
}

export default rocketstories
