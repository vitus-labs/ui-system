/* eslint-disable import/prefer-default-export */
import { get } from '@vitus-labs/core'

// ------------------------------------------
// get container width
// ------------------------------------------
type GetContainerWidth = (
  props?: Record<string, unknown> | unknown,
  theme?: Record<string, unknown> | unknown
) => Record<string, unknown>

export const getContainerWidth: GetContainerWidth = (props, theme) =>
  get(props, 'width') ||
  get(theme, 'grid.container') ||
  get(theme, 'coolgrid.container')
