import type { IRocketStories } from '~/rocketstories'
import createRocketStories from '~/rocketstories'
import type { Configuration, RocketType, StoryExtractProps } from '~/types'
import getTheme, { setTheme } from '~/utils/theme'

type InitParams = Partial<
  Omit<Configuration, 'component' | 'attrs' | 'theme'>
> & {
  theme?: Record<string, unknown>
}

/**
 * Curried factory that accepts shared configuration options first,
 * then a component, producing a fully configured IRocketStories builder.
 * Useful for pre-configuring decorators or storyOptions across many stories.
 *
 * Pass `theme` to set the global theme at runtime (alternative to
 * configuring it via `vl-tools.config`).
 */
export type Init = <P extends InitParams>(
  params: P,
) => <T extends Configuration['component']>(
  component: T,
) => T extends RocketType
  ? IRocketStories<StoryExtractProps<T>, T['$$rocketstyle'], true>
  : IRocketStories<StoryExtractProps<T>, unknown, false>

/** @see {@link Init} */
const init: Init = ({ decorators = [], storyOptions = {}, theme, ...rest }) => {
  if (theme) setTheme(theme)

  return (component) =>
    rocketstories(component, { decorators, storyOptions, theme, ...rest })
}

/**
 * One-shot factory that takes a component and optional configuration,
 * returning an IRocketStories builder with chainable methods for
 * generating Storybook stories, controls, and dimension showcases.
 */
export type Rocketstories = <C extends Configuration['component']>(
  component: C,
  options?: Partial<Omit<Configuration, 'component' | 'attrs' | 'theme'>> & {
    theme?: Record<string, unknown>
  },
) => C extends RocketType
  ? IRocketStories<StoryExtractProps<C>, C['$$rocketstyle'], true>
  : IRocketStories<StoryExtractProps<C>, unknown, false>

/** @see {@link Rocketstories} */
// @ts-expect-error — `Rocketstories` is a conditional generic over `C extends RocketType`;
// the impl returns the right runtime shape but TS can't unify both branches at the value level
const rocketstories: Rocketstories = (component, options = {}) => {
  const { decorators = [], storyOptions = {}, theme } = options

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
    // Snapshot the theme at construction time. Prefer the explicit
    // `options.theme`; fall back to the singleton so legacy callers that
    // only set `setTheme(...)` still work. Either way, this storyOf
    // instance now owns its theme — later `setTheme` calls or competing
    // `init({ theme })` invocations don't affect it.
    theme: theme ?? getTheme(),
  }

  return createRocketStories(result)
}

export { init, rocketstories }
