/* eslint-disable import/prefer-default-export */
type CalculateHocsFuncs = (
  options: Record<string, any>
) => ((arg: any) => any)[]

export const calculateHocsFuncs: CalculateHocsFuncs = (options = {}) =>
  Object.values(options)
    .filter((item) => typeof item === 'function')
    .reverse()
