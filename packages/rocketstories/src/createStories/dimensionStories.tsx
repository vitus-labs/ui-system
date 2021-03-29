// @ts-nocheck
import React, { createElement } from 'react'
import generateKnobs from '~/utils/knobs'
import { createJSXCode, createJSXCodeArray } from '~/utils/code'
import { capitalize } from '~/utils/string'
import theme from '~/utils/theme'

const makeDimensionStories = ({
  name,
  component,
  dimension,
  attrs = {},
  uniqIDs,
}) => {
  const { dimensions, useBooleans, multiKeys } = component.getStaticDimensions(
    theme
  )

  const Enhanced = () => {
    if (!dimensions[dimension]) return null

    const isMultiKey = !!multiKeys[dimension]

    return (
      <>
        {Object.keys(dimensions[dimension]).map((item) =>
          createElement(component, {
            ...generateKnobs(attrs, uniqIDs ? capitalize(item) : null),
            [dimension]: isMultiKey ? [item] : item,
          })
        )}
      </>
    )
  }

  Enhanced.parameters = {
    docs: {
      source: {
        code: createJSXCodeArray(
          name,
          attrs,
          dimension,
          dimensions[dimension],
          useBooleans
        ),
      },
    },
  }

  return Enhanced
}

export default makeDimensionStories
