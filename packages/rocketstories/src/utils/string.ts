// --------------------------------------------------------
// capitalize
// --------------------------------------------------------
type Capitalize = (value: string) => string

export const capitalize: Capitalize = (value) =>
  value.charAt(0).toUpperCase() + value.slice(1)

// --------------------------------------------------------
// capitalize
// --------------------------------------------------------
type IsColor = (value: string) => boolean

export const isColor: IsColor = (value) => {
  const s = new Option().style
  s.color = value
  // eslint-disable-next-line eqeqeq
  return s.color == value
}
