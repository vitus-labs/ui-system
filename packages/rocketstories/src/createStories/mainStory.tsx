import React, { createElement } from 'react'
import generateKnobs from '~/knobs/generateKnobs'
import { createJSXCode } from '~/utils/code'
import { transformDimensionsToKnobs } from '~/utils/dimensions'
import theme from '~/utils/theme'

const mainStory = ({ name, component, attrs }) => {
  const { dimensions, useBooleans } = component.getStaticDimensions(theme)

  const Enhanced = () => {
    if (useBooleans)
      return (
        <>
          {createElement(
            component,
            generateKnobs(
              { ...transformDimensionsToKnobs(dimensions), ...attrs },
              'Main'
            )
          )}
          {createElement(component, generateKnobs(attrs, 'UseBooleans'))}
        </>
      )

    return createElement(component, generateKnobs(attrs, 'Main'))
  }

  Enhanced.parameters = {
    docs: {
      source: {
        code: createJSXCode(name, {
          ...transformDimensionsToKnobs(dimensions),
          ...attrs,
        }),
      },
    },
  }

  return Enhanced
}

export default mainStory
