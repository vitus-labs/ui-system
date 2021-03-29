// @ts-nocheck
import { isRocketComponent } from '@vitus-labs/rocketstyle'
import mainStory from '~/createStories/mainStory'
import dimensionStories from '~/createStories/dimensionStories'

export const rocketstories = (component) => {
  if (!isRocketComponent(component)) {
    throw Error('Component is not valid Rocketstyle component')
  }

  return somethingCool({
    component,
    name: component.displayName || component.name,
    attrs: {},
  })
}

export const somethingCool = (options = {}, defaultOptions = { attrs: {} }) => {
  const result = {
    ...defaultOptions,
    name: options?.component
      ? options.component.displayName
      : defaultOptions.name,
    component: options.component || defaultOptions.component,
    attrs: { ...defaultOptions.attrs, ...options.attrs },
  }

  return {
    attrs: (attrs) => somethingCool({ attrs }, result),
    main: () => ({
      component: result.component,
      title: result.name,
    }),
    mainStory: () => mainStory(result),
    makeStories: (dimension, uniqIDs = false) =>
      dimensionStories({
        ...result,
        dimension,
        uniqIDs,
      }),
  }
}

export default rocketstories
