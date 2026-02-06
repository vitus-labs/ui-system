import type { IRocketStories } from '~/rocketstories'
import createRocketStories from '~/rocketstories'
import type { Configuration, ExtractProps, RocketType } from '~/types'

// --------------------------------------------------------
// rocketstories
// --------------------------------------------------------
export type Init = <
  P extends Partial<Omit<Configuration, 'component' | 'attrs'>>,
>(
  params: P,
) => <T extends Configuration['component']>(
  component: T,
) => T extends RocketType
  ? IRocketStories<ExtractProps<T>, T['$$rocketstyle'], true>
  : IRocketStories<ExtractProps<T>, unknown, false>

const init: Init =
  ({ decorators = [], storyOptions = {}, ...rest }) =>
  (component) =>
    rocketstories(component, { decorators, storyOptions, ...rest })

// --------------------------------------------------------
// rocketstories
// --------------------------------------------------------
export type Rocketstories = <C extends Configuration['component']>(
  component: C,
  options?: Partial<Omit<Configuration, 'component' | 'attrs'>>,
) => C extends RocketType
  ? IRocketStories<ExtractProps<C>, C['$$rocketstyle'], true>
  : IRocketStories<ExtractProps<C>, unknown, false>

//@ts-expect-error
const rocketstories: Rocketstories = (component, options = {}) => {
  const { decorators = [], storyOptions = {} } = options

  const result: Configuration = {
    component,
    name: component.displayName || component.name,
    attrs: {},
    storyOptions: {
      gap: 16,
      direction: 'rows',
      alignY: 'top',
      alignX: 'left',
      ...storyOptions,
    },
    decorators,
    controls: {},
  }

  return createRocketStories(result)
}

export { init, rocketstories }
