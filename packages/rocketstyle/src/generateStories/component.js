import React, { Fragment, createElement, useState } from 'react'
import { select, boolean, optionsKnob } from '@storybook/addon-knobs'
import {
  InfoTable,
  Title,
  H1,
  H2,
  Text,
  BadgeBox,
  Badge,
  OptionBlock,
  NoAvailableOptions,
  CodeExample
} from './styled'

const randomPick = arr => arr[Math.floor(Math.random() * arr.length)]

const getStateName = state => state.charAt(0).toUpperCase() + state.substring(1)

const generateKnobs = (options, dimensions, generateBools) => {
  const result = {}

  if (generateBools) {
    Object.keys(options).map(item => {
      options[item].map(item => {
        result[item] = boolean(item, false, 'Rocketstyle bools')
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
        generateBools ? 'Rocketstyle bools' : 'Rocketstyle keys'
      )
    } else {
      result[keyName] = select(
        keyName,
        selectOptions,
        null,
        generateBools ? 'Rocketstyle bools' : 'Rocketstyle keys'
      )
    }
  })

  return result
}

const getAvailableOptions = keys => {
  if (keys.length <= 0)
    return <NoAvailableOptions>no available options</NoAvailableOptions>

  return (
    <BadgeBox>
      {keys.map((item, i) => (
        <Badge key={i}>{item}</Badge>
      ))}
    </BadgeBox>
  )
}

const generateAllAvailableOptions = options => {
  const keys = Object.keys(options)
  if (keys.length <= 0) {
    return <NoAvailableOptions>no available options</NoAvailableOptions>
  }

  return keys.map((item, key) => {
    const randomlyPicked = randomPick(options[item])
    return (
      <OptionBlock key={key}>
        <H2>{getStateName(item)}</H2>
        {getAvailableOptions(options[item])}
        {options[item].length > 0 && (
          <div>
            <CodeExample>{`<Component ${item}="${randomlyPicked}" />`}</CodeExample>
            <Text>or using boolean values examples</Text>
            <CodeExample>{`<Component ${randomlyPicked} />`}</CodeExample>
          </div>
        )}
      </OptionBlock>
    )
  })
}

const Element = ({ component, type, props = {} }) => {
  const [state, setState] = useState(null)

  if (!state) {
    if (component) return createElement(component, { hook: setState })
  }

  if (type === 'documentation') {
    return (
      <InfoTable>
        <Title>{component.displayName}</Title>
        <div>{generateAllAvailableOptions(state.keys)}</div>

        <H1>Interactive examples</H1>
        <H2>Using key props</H2>
        <Text>
          This is an example using standart key names as props. Use Standard knobs
          for editing this component.
        </Text>
        {createElement(component, {
          ...generateKnobs(state.keys, state.rocketConfig.dimensions, false)
        })}

        <H2>Using boolean props</H2>
        <Text>
          Your component supports using boolean props. This can be edited when
          initializing rocketstyle configuration. Set useBooleans to false if you
          would like to turn it off.
        </Text>
        <Text>
          This is an example using boolean values as props. Use useBoolean knobs for
          editing this component.
        </Text>

        {createElement(component, {
          ...generateKnobs(state.keys, state.rocketConfig.dimensions, true)
        })}

        <H1>Randomly rendered examples:</H1>
      </InfoTable>
    )
  }

  return (
    <Fragment>
      <H1>
        {component.displayName} - {getStateName(type)}
      </H1>
      {state.keys[type].map((item, key) => {
        const internalProps = {
          [state.rocketConfig.dimensions[type]]: item
        }

        let passProps = props

        if (typeof props === 'function') passProps = props(internalProps)

        return createElement(component, { key, ...internalProps, ...passProps })
      })}
    </Fragment>
  )
}

export default Element
