/* eslint-disable import/prefer-default-export */
export const calculateHocsFuncs = (options = {}) =>
  Object.values(options)
    .filter((item) => typeof item === 'function')
    .reverse()
