/* eslint-disable import/prefer-default-export */
import { get } from '@vitus-labs/core'

// ------------------------------------------
// get container width
// ------------------------------------------
export const getContainerWidth = (props = {}, theme = {}) =>
  get(props, 'width') ||
  get(theme, 'grid.container') ||
  get(theme, 'coolgrid.container')
