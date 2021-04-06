// @ts-nocheck
import { isRocketComponent } from '@vitus-labs/rocketstyle'
import mainStory from '~/createStories/mainStory'
import dimensionStories from '~/createStories/dimensionStories'

const rocketstories = (component) => {
  if (!isRocketComponent(component)) {
    throw Error('Component is not valid Rocketstyle component')
  }

  return createRocketstories({
    component,
    name: component.displayName || component.name,
    attrs: {},
  })
}

// type CreateRocketStories = <
//   A extends Record<string, unknown>,
//   B extends Record<string, unknown>
// >(
//   options: A,
//   defaultOptions: B
// ) => {
//   attrs: <T extends Record<string, unknown>>(
//     params: T
//   ) => CreateRocketStories<{ attrs: T }, B>
//   main: () => Record<string, unknown>
//   mainStory: () => ReturnType<typeof mainStory>
//   makeStories: () => ReturnType<typeof dimensionStories>
// }

const createRocketstories = (options = {}, defaultOptions = { attrs: {} }) => {
  const result = {
    ...defaultOptions,
    name: options?.component
      ? options.component.displayName
      : defaultOptions.name,
    component: options.component || defaultOptions.component,
    attrs: { ...defaultOptions.attrs, ...options.attrs },
  }

  return {
    attrs: (attrs) => createRocketstories({ attrs }, result),

    // create object for `export default` in stories
    main: () => ({
      component: result.component,
      title: result.name,
      // argTypes: {
      //   label: { control: 'text' },
      //   borderWidth: { control: { type: 'number', min: 0, max: 10 } },
      // },
    }),

    // generate main story
    mainStory: () => mainStory(result),

    // generate stories of defined dimension
    makeStories: (dimension, separatedKnobs = false) =>
      dimensionStories({
        ...result,
        dimension,
        separatedKnobs,
      }),
  }
}

export default rocketstories
