// --------------------------------------------------------
// disableControl
// --------------------------------------------------------
type DisableControl = (
  name: string
) => Record<string, { table: { disable: true } }>

const disableControl: DisableControl = (name) => ({
  [name]: { table: { disable: true } },
})

// --------------------------------------------------------
// disableDimensionControls
// --------------------------------------------------------
type DisableDimensionControls = (
  dimensions: Record<string, boolean>,
  name?: string
) => any

const disableDimensionControls: DisableDimensionControls = (
  dimensions,
  dimensionName
) => {
  const result = dimensionName ? disableControl(dimensionName) : {}
  const dimensionKeys = Object.values(dimensions)

  return dimensionKeys.reduce((acc, value) => {
    Object.keys(value).forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      acc = { ...acc, ...disableControl(item) }
    })

    return acc
  }, result)
}

export default disableDimensionControls
