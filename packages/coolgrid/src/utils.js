import { pick, get } from '@vitus-labs/core'

// ------------------------------------------
// create grid settings
// ------------------------------------------
export const createGridContext = (props = {}, ctx = {}, theme = {}) => ({
  breakpoints: get(props, 'breakpoints') || get(ctx, 'breakpoints') || get(theme, 'breakpoints'),
  rootSize: get(props, 'rootSize') || get(ctx, 'rootSize') || get(theme, 'rootSize'),
  columns: get(props, 'columns') || get(ctx, 'columns') || get(theme, 'grid.columns')
})

// ------------------------------------------
// merging utility
// ------------------------------------------
export const merge = (props = {}, ctx = {}, reservedKeys) => {
  if (!reservedKeys) return { ...ctx, ...props }

  return {
    ...pick(ctx, reservedKeys),
    ...pick(props, reservedKeys)
  }
}
