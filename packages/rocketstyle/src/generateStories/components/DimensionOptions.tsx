// @ts-nocheck
import React, { createElement } from 'react'
import {
  NoAvailableOptions,
  BadgeBox,
  Badge,
  OptionBlock,
  H2,
  CodeExample,
  Text,
} from './styled'
import { create } from 'domain'

const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const getStateName = (state) =>
  state.charAt(0).toUpperCase() + state.substring(1)

const AvailableOptions = ({ data }) => {
  if (data.length <= 0)
    return <NoAvailableOptions>no available options</NoAvailableOptions>

  return (
    <BadgeBox>
      {data.map((item) => (
        <Badge key={item}>{item}</Badge>
      ))}
    </BadgeBox>
  )
}

const DimensionOptionsExample = ({
  useBooleans,
  dimensionName,
  dimensionKey,
  options,
  component,
  baseKnobs,
}) => {
  const randomlyPickedOption = randomPick(options)
  const isDimensionKeyMultiple = Array.isArray(dimensionKey)

  console.log(baseKnobs)

  const propAttr = isDimensionKeyMultiple
    ? `${dimensionKey[0]}={["${randomlyPickedOption}"]}`
    : `${dimensionKey}="${randomlyPickedOption}"`

  return (
    <OptionBlock>
      <H2>{getStateName(dimensionName)}</H2>
      <AvailableOptions data={options} />
      {options.length > 0 && (
        <>
          <CodeExample>{`<Component ${propAttr} />`}</CodeExample>

          <div>
            {options.map((item) =>
              createElement(component, { ...baseKnobs, [dimensionKey]: item })
            )}
          </div>

          {useBooleans && (
            <>
              <Text>or using boolean values examples</Text>
              <CodeExample>{`<Component ${randomlyPickedOption} />`}</CodeExample>
            </>
          )}

          <div>
            {options.map((item) =>
              createElement(component, { ...baseKnobs, [item]: true })
            )}
          </div>
        </>
      )}
    </OptionBlock>
  )
}

export default DimensionOptionsExample
