import normalizeUnit from './normalizeUnit'

type GetValueOf = (...values: Array<unknown>) => number | string | unknown
const getValueOf: GetValueOf = (...values) =>
  values.find((value) => typeof value !== 'undefined' && value !== null)

export type Value = (
  rootSize: number,
  values: Array<unknown>,
  outputUnit?: 'px' | 'rem' | '%' | string
) => string | number
const value: Value = (rootSize, values, outputUnit?: string) => {
  const param = getValueOf(...values)

  if (Array.isArray(param)) {
    return param
      .reduce(
        (acc, item) =>
          acc.push(
            normalizeUnit({
              param: item,
              rootSize,
              outputUnit,
            })
          ),
        []
      )
      .join(' ')
  }

  return normalizeUnit({
    param,
    rootSize,
    outputUnit,
  })
}

export default value
