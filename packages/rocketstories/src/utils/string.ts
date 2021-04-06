export const capitalize = (value) =>
  value.charAt(0).toUpperCase() + value.slice(1)

export const isColor = (strColor) => {
  const s = new Option().style
  s.color = strColor
  return s.color == strColor
}
