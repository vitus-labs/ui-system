import normalizeUnit from './normalizeUnit'

type GetValueOf = (...values: Array<unknown>) => number | string | unknown
const getValueOf: GetValueOf = (...values) =>
  values.find((value) => typeof value !== 'undefined' && value !== null)

export type Value = (
  values: Array<unknown>,
  rootSize?: number,
  outputUnit?: 'px' | 'rem' | '%' | string
) => string | number
const value: Value = (values, rootSize, outputUnit) => {
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
