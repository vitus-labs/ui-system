import React, { createElement } from 'react'
import generateKnobs from '~/utils/knobs'
import { createJSXCode } from '~/utils/code'
import {
  transformDimensionsToKnobs,
  extractDefaultBooleanProps,
} from '~/utils/dimensions'
import theme from '~/utils/theme'

const createJSX = (name, dimensions, params, booleanDimensions) => {
  let result = ''

  result += createJSXCode(name, { ...dimensions, ...params })

  if (booleanDimensions) {
    result += `\n\n`
    result += `// Or alternatively use boolean props (e.g. ${Object.keys(
      booleanDimensions
    )})`
    result += `\n`
    result += createJSXCode(name, { ...booleanDimensions, ...params })
  }

  return result
}

const mainStory = ({ name, component, attrs }) => {
  const statics = component.getStaticDimensions(theme)
  const { useBooleans, multiKeys } = statics

  const transformedProps = transformDimensionsToKnobs(statics)

  const defaultBooleanProps = extractDefaultBooleanProps(
    transformedProps,
    multiKeys
  )

  const Enhanced = () => {
    if (useBooleans)
      return (
        <>
          {createElement(
            component,
            generateKnobs(
              {
                ...transformedProps,
                ...attrs,
              },
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
        code: createJSX(name, transformedProps, attrs, defaultBooleanProps),
      },
    },
  }

  return Enhanced
}

export default mainStory
