/* eslint-disable @typescript-eslint/ban-types */
import type { Configuration, RocketType, ExtractProps } from '~/types'
import createRocketStories, { IRocketStories } from '~/rocketstories'

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
  ? IRocketStories<ExtractProps<T>, T['$$rocketstyle'], true>
  : IRocketStories<ExtractProps<T>, unknown, false>

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
  ? IRocketStories<ExtractProps<C>, C['$$rocketstyle'], true>
  : IRocketStories<ExtractProps<C>, unknown, false>

//@ts-ignore
const rocketstories: Rocketstories = (component, options = {}) => {
  const { decorators = [], storyOptions = {} } = options

  const result: Configuration = {
    component,
    name: component.displayName || component.name,
    attrs: {},
    storyOptions: { gap: 16, direction: 'rows' as const, ...storyOptions },
    decorators,
    controls: {},
  }

  return createRocketStories(result)
}

export { init, rocketstories }