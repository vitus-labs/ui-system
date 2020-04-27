import {
  text,
  number,
  date,
  boolean,
  color,
  button,
  select,
  optionsKnob
} from '@storybook/addon-knobs'

const isColor = strColor => {
  const s = new Option().style
  s.color = strColor
  return s.color !== ''
}

function dateKnob(name, defaultValue, groupId) {
  const stringTimestamp = date(name, defaultValue, groupId)
  return new Date(stringTimestamp)
}

export const getBasicKnobs = (params, groupId = 'Base') => {
  const result = {}
  Object.keys(params).forEach(item => {
    const value = params[item]
    const type = typeof value

    if (isColor(value)) {
      result[item] = color(item, value, groupId)
    }

    if (value instanceof Date) {
      result[item] = dateKnob(item, value, groupId)
    }

    switch (type) {
      case 'string':
        result[item] = text(item, value, groupId)
        break
      case 'number':
        result[item] = number(item, value, {}, groupId)
        break
      // case 'function':
      //   result[item] = button(item, value, groupId)
      //   break
      case 'color':
        result[item] = color(item, value, groupId)
        break
      case 'boolean':
        result[item] = boolean(item, value, groupId)
        break
      default:
        result[item] = value
    }
  })

  return result
}

export const generateKnobs = (options, dimensions, useBools) => {
  const groupId = useBools ? 'Using boolean props' : 'Using key props'

  const result = {}

  if (useBools) {
    Object.keys(options).map(item => {
      options[item].map(item => {
        result[item] = boolean(item, false, groupId)
      })
    })
  }

  Object.keys(options).map(item => {
    const isKeyArray = Array.isArray(dimensions[item])
    const keyName = isKeyArray ? dimensions[item][0] : dimensions[item]

    const selectOptions = {}

    selectOptions['---'] = undefined

    options[item].map(item => {
      selectOptions[item] = item
    })

    if (isKeyArray) {
      result[keyName] = optionsKnob(
        keyName,
        selectOptions,
        '',
        {
          display: 'multi-select'
        },
        groupId
      )
    } else {
      result[keyName] = select(keyName, selectOptions, null, groupId)
    }
  })

  return result
}
